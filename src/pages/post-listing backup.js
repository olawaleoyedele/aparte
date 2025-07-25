import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import toast from 'react-hot-toast';

const MAX_IMAGES = 5;
const MAX_VIDEOS = 3;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_VIDEO_SIZE_MB = 20;

export default function PostListingPage({ user }) {
  console.log('User:', user);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    propertyDescription: '',
    location: '',
    price: '',
    paymentType: 'year',
    beds: 1,
    baths: 1,
    toilets: 1,
    amenities: [],
    status: [],
    type: 'Agent',
  });

  const [images, setImages] = useState([]); // { file, previewUrl, progress }
  const [videos, setVideos] = useState([]);
  const [imageErrors, setImageErrors] = useState([]);
  const [videoErrors, setVideoErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: prev[name].includes(value)
          ? prev[name].filter((v) => v !== value)
          : [...prev[name], value],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Helper: Validate file size MB
  const isValidFileSize = (file, maxMB) => file.size / (1024 * 1024) <= maxMB;

  // Helper: Check duplicates by name + size (better than just name)
  const isDuplicateFile = (file, fileList) => {
    return fileList.some(f => f.file.name === file.name && f.file.size === file.size);
  };

  // Add files with validation and error setting
  const addFiles = (files, currentFiles, setFiles, maxFiles, maxSizeMB, setErrors, mediaType) => {
    setErrors([]); // reset errors

    let newErrors = [];
    let newFiles = [];

    for (const file of files) {
      if (!isValidFileSize(file, maxSizeMB)) {
        newErrors.push(`File "${file.name}" exceeds ${maxSizeMB}MB size limit.`);
        continue;
      }
      if (isDuplicateFile(file, currentFiles)) {
        newErrors.push(`File "${file.name}" is a duplicate and was skipped.`);
        continue;
      }
      if (currentFiles.length + newFiles.length >= maxFiles) {
        newErrors.push(`Maximum ${maxFiles} ${mediaType} allowed.`);
        break;
      }

      newFiles.push({
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
      });
    }

    if (newErrors.length) setErrors(newErrors);

    setFiles([...currentFiles, ...newFiles]);
  };

  // Handle image input change (file select or drop)
  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    addFiles(newFiles, images, setImages, MAX_IMAGES, MAX_IMAGE_SIZE_MB, setImageErrors, 'images');
    e.target.value = null; // reset input to allow reselect same files
  };

  // Handle video input change
  const handleVideoChange = (e) => {
    const newFiles = Array.from(e.target.files);
    addFiles(newFiles, videos, setVideos, MAX_VIDEOS, MAX_VIDEO_SIZE_MB, setVideoErrors, 'videos');
    e.target.value = null;
  };

  // Remove file by index and revoke object URL
  const removeMedia = (type, index) => {
    if (type === 'image') {
      URL.revokeObjectURL(images[index].previewUrl);
      const updated = [...images];
      updated.splice(index, 1);
      setImages(updated);
    } else if (type === 'video') {
      URL.revokeObjectURL(videos[index].previewUrl);
      const updated = [...videos];
      updated.splice(index, 1);
      setVideos(updated);
    }
  };

  // Simulate upload progress for demo (replace with real upload progress if available)
  const simulateUpload = (fileObj, setFiles, files, index) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      const updatedFiles = [...files];
      updatedFiles[index] = { ...fileObj, progress };
      setFiles(updatedFiles);
    }, 200);
  };

  // Handle drop events for drag & drop
  const handleDrop = (e, type) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);

    if (type === 'image') {
      addFiles(droppedFiles, images, setImages, MAX_IMAGES, MAX_IMAGE_SIZE_MB, setImageErrors, 'images');
    } else {
      addFiles(droppedFiles, videos, setVideos, MAX_VIDEOS, MAX_VIDEO_SIZE_MB, setVideoErrors, 'videos');
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  // Submit form data + files
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const toastId = toast.loading("Loading...");

    // Start fake upload progress simulation
    images.forEach((fileObj, i) => simulateUpload(fileObj, setImages, images, i));
    videos.forEach((fileObj, i) => simulateUpload(fileObj, setVideos, videos, i));

    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('propertyDescription', formData.propertyDescription);
      form.append('location', formData.location);
      form.append('price', formData.price);
      form.append('paymentType', formData.paymentType);
      form.append('beds', formData.beds);
      form.append('baths', formData.baths);
      form.append('toilets', formData.toilets);
      form.append('type', formData.type);
      form.append('agentEmail', user.email);

      formData.amenities.forEach(item => form.append('amenities[]', item));
      formData.status.forEach(item => form.append('status[]', item));
      images.forEach(fileObj => form.append('images', fileObj.file));
      videos.forEach(fileObj => form.append('videos', fileObj.file));

      const res = await fetch('/api/listings/new', {
        method: 'POST',
        body: form,
      });

      if (res.status === 409) {
        // alert('A listing with a similar description already exists. Please change your property description.');

        toast.custom((t) => (
          <div
            className={`max-w-md w-full bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden pointer-events-auto transition transform ${t.visible ? 'animate-enter opacity-100 scale-100' : 'animate-leave opacity-0 scale-95'
              }`}
          >
            <div className="p-4 flex space-x-3">
              <div className="flex-shrink-0 pt-1.5 text-yellow-500 text-xl">⚠️</div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-800">Listing Rejected</h3>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                  Our AI system has flagged this property description as a potential duplicate
                  of an existing agent’s listing. We do not allow multiple agents to post the same property.
                </p>
              </div>
            </div>
            <div className="border-t border-gray-100 flex justify-end px-4 py-2 bg-gradient-to-r from-orange-400 to-pink-500">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-sm font-medium text-white hover:text-indigo-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        ), { duration: Infinity, id: toastIdm});  // no auto-dismiss


        return;
      }

      if (res.ok) {
        toast.success(data.message || "Successfully posted", { id: toastId });
        router.push('/dashboard/listings');
      } else {
        alert('Failed to post listing');
      }

    } catch (err) {
      console.error('Listing submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Post a New Listing</h1>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          {/* Basic Info */}
          <input
            type="text"
            name="title"
            placeholder="Title"
            className="w-full border p-2"
            onChange={handleChange}
            required
          />
          <textarea
            name="propertyDescription"
            placeholder="Property Description"
            className="w-full border p-2 h-28 resize-y"
            onChange={handleChange}
            required
          ></textarea>
          <input
            type="text"
            name="location"
            placeholder="Location"
            className="w-full border p-2"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            className="w-full border p-2"
            onChange={handleChange}
            required
          />

          <select name="paymentType" className="w-full border p-2" onChange={handleChange}>
            <option value="year">Per Year</option>
            <option value="month">Per Month</option>
          </select>

          <input
            type="number"
            name="beds"
            placeholder="Bedrooms"
            className="w-full border p-2"
            onChange={handleChange}
          />
          <input
            type="number"
            name="baths"
            placeholder="Bathrooms"
            className="w-full border p-2"
            onChange={handleChange}
          />
          <input
            type="number"
            name="toilets"
            placeholder="Toilets"
            className="w-full border p-2"
            onChange={handleChange}
          />

          {/* Images */}
          <div>
            <label className="font-semibold block mb-1">
              Upload Images (max {MAX_IMAGES}, each ≤ {MAX_IMAGE_SIZE_MB}MB):
            </label>

            {/* Drag & drop area */}
            <div
              onDrop={(e) => handleDrop(e, 'image')}
              onDragOver={handleDragOver}
              className="border-dashed border-4 border-gray-400 p-6 text-center cursor-pointer hover:border-blue-500"
              onClick={() => imageInputRef.current.click()}
            >
              Drag & drop images here or click to select
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                ref={imageInputRef}
                className="hidden"
              />
            </div>

            {/* Validation errors */}
            {imageErrors.length > 0 && (
              <ul className="text-red-600 mt-2 list-disc list-inside">
                {imageErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}

            {/* Previews with progress and remove */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              {images.map(({ previewUrl, progress }, i) => (
                <div key={i} className="relative group">
                  <img
                    src={previewUrl}
                    alt={`Preview ${i}`}
                    className="h-32 w-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedia('image', i)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full px-2 text-sm opacity-0 group-hover:opacity-100 transition"
                    title="Remove"
                  >
                    ✖
                  </button>
                  {/* Progress bar */}
                  {isSubmitting && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300 rounded-b">
                      <div
                        className="h-full bg-blue-600 rounded-b"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Videos */}
          <div>
            <label className="font-semibold block mb-1">
              Upload Videos (max {MAX_VIDEOS}, each ≤ {MAX_VIDEO_SIZE_MB}MB):
            </label>

            <div
              onDrop={(e) => handleDrop(e, 'video')}
              onDragOver={handleDragOver}
              className="border-dashed border-4 border-gray-400 p-6 text-center cursor-pointer hover:border-blue-500"
              onClick={() => videoInputRef.current.click()}
            >
              Drag & drop videos here or click to select
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoChange}
                ref={videoInputRef}
                className="hidden"
              />
            </div>

            {/* Validation errors */}
            {videoErrors.length > 0 && (
              <ul className="text-red-600 mt-2 list-disc list-inside">
                {videoErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}

            {/* Previews with progress and remove */}
            <div className="grid grid-cols-1 gap-4 mt-2">
              {videos.map(({ previewUrl, progress }, i) => (
                <div key={i} className="relative group">
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-48 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedia('video', i)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full px-2 text-sm opacity-0 group-hover:opacity-100 transition"
                    title="Remove"
                  >
                    ✖
                  </button>
                  {/* Progress bar */}
                  {isSubmitting && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300 rounded-b">
                      <div
                        className="h-full bg-blue-600 rounded-b"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="font-semibold">Amenities:</label>
            {['Water', 'Electricity', 'Security', 'Parking', 'Prepaid Meter', 'Gated', 'Furnished'].map((item) => (
              <label key={item} className="block">
                <input type="checkbox" name="amenities" value={item} onChange={handleChange} /> {item}
              </label>
            ))}
          </div>

          {/* Status */}
          <div>
            <label className="font-semibold">Status:</label>
            {['Newly Built', 'Available Now', 'Verified', 'Rent', 'Agent Listing'].map((item) => (
              <label key={item} className="block">
                <input type="checkbox" name="status" value={item} onChange={handleChange} /> {item}
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {isSubmitting ? 'Posting...' : 'Post Listing'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const token = cookies.token || null;

  if (!token) {
    // No token, return no user
    return { props: { user: null } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Return user info (you can add more fields as needed)
    return {
      props: {
        user: {
          name: decoded.name || null,
          email: decoded.email || null,
          role: decoded.role || null,
        },
      },
    };
  } catch (error) {
    // Invalid token
    return { props: { user: null } };
  }
}
