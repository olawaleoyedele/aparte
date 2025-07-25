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
                  Our AI system has flagged this property as a potential duplicate
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
        ), { duration: Infinity, id: toastId});  // no auto-dismiss


        return;
      }

      if (res.ok) {
        toast.success("Successfully posted", { id: toastId });
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
  <div className="max-w-4xl mx-auto p-6">
    <header className="text-center mb-10 animate-fadeIn">
  <div className="inline-flex items-center gap-3 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-full shadow-lg animate-bounce-slow">
    <span className="text-2xl">📌</span>
    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
      Post a New Listing
    </h1>
  </div>
  <p className="mt-4 text-gray-600 text-sm md:text-base max-w-xl mx-auto">
    Fill in the property details, upload media, and make your listing stand out.
  </p>
  <div className="mt-6 w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
</header>


    <form onSubmit={handleSubmit} className="space-y-8" encType="multipart/form-data">
      {/* Group: Basic Info */}
      <section className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-xl rounded-3xl p-8 space-y-8 transition-all duration-300">
  <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3 tracking-tight">
    <span className="text-blue-600">🏠</span>
    <span>Property Details</span>
  </h2>

  <div className="space-y-5">
    <input
      type="text"
      name="title"
      placeholder="Property Title (e.g. 3 Bedroom Flat at Lekki Phase 1)"
      className="w-full border border-gray-300 rounded-xl px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 transition-all"
      onChange={handleChange}
      required
    />

    <textarea
      name="propertyDescription"
      placeholder="Short property description..."
      className="w-full border border-gray-300 rounded-xl px-5 py-3 h-32 resize-y text-base focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 transition-all"
      onChange={handleChange}
      required
    ></textarea>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <input
      type="text"
      name="location"
      placeholder="Location (e.g. Ikeja GRA)"
      className="w-full border border-gray-300 rounded-xl px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-500 transition-all"
      onChange={handleChange}
      required
    />

    <input
      type="number"
      name="price"
      placeholder="Price (₦)"
      className="w-full border border-gray-300 rounded-xl px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-500 transition-all"
      onChange={handleChange}
      required
    />

    <select
      name="paymentType"
      className="w-full border border-gray-300 rounded-xl px-5 py-3 text-base text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
      onChange={handleChange}
    >
      <option value="">Select Payment Type</option>
      <option value="year">Per Year</option>
      <option value="month">Per Month</option>
    </select>

    <input
      type="text"
      value={formData.type}
      disabled
      className="w-full border border-gray-200 rounded-xl px-5 py-3 bg-gray-100 text-gray-500 text-base cursor-not-allowed"
    />
  </div>

  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
    <input
      type="number"
      name="beds"
      placeholder="Bedrooms"
      className="w-full border border-gray-300 rounded-xl px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-500 transition-all"
      onChange={handleChange}
    />
    <input
      type="number"
      name="baths"
      placeholder="Bathrooms"
      className="w-full border border-gray-300 rounded-xl px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-500 transition-all"
      onChange={handleChange}
    />
    <input
      type="number"
      name="toilets"
      placeholder="Toilets"
      className="w-full border border-gray-300 rounded-xl px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-500 transition-all"
      onChange={handleChange}
    />
  </div>
</section>

      {/* Group: Media Uploads */}
<section className="bg-white p-8 shadow-xl rounded-2xl border border-gray-200 space-y-10">
  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
    <span className="text-indigo-500 text-3xl">🖼️</span> Media Uploads
  </h2>

  {/* Images */}
  <div>
    <label className="block text-lg font-semibold text-gray-700 mb-3">
      Upload Images <span className="text-sm font-normal text-gray-500">(max {MAX_IMAGES}, ≤ {MAX_IMAGE_SIZE_MB}MB)</span>
    </label>
    <div
      onDrop={(e) => handleDrop(e, 'image')}
      onDragOver={handleDragOver}
      onClick={() => imageInputRef.current.click()}
      className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:border-indigo-400 transition p-8 text-center cursor-pointer"
    >
      <p className="text-gray-500">Drag & drop or <span className="text-indigo-600 font-medium">click</span> to upload images</p>
      <input
        type="file"
        accept="image/*"
        multiple
        ref={imageInputRef}
        onChange={handleImageChange}
        className="hidden"
      />
    </div>

    {imageErrors.length > 0 && (
      <ul className="text-red-600 mt-3 text-sm space-y-1 list-disc list-inside">
        {imageErrors.map((err, i) => (
          <li key={i}>{err}</li>
        ))}
      </ul>
    )}

    {/* Image Previews */}
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">
      {images.map(({ previewUrl, progress }, i) => (
        <div key={i} className="relative group rounded-lg overflow-hidden shadow-sm">
          <img src={previewUrl} alt={`Preview ${i}`} className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
          <button
            type="button"
            onClick={() => removeMedia('image', i)}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition"
          >
            ✖
          </button>
          {isSubmitting && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
              <div className="h-full bg-indigo-500" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      ))}
    </div>
  </div>

  {/* Videos */}
  <div>
    <label className="block text-lg font-semibold text-gray-700 mb-3">
      Upload Videos <span className="text-sm font-normal text-gray-500">(max {MAX_VIDEOS}, ≤ {MAX_VIDEO_SIZE_MB}MB)</span>
    </label>
    <div
      onDrop={(e) => handleDrop(e, 'video')}
      onDragOver={handleDragOver}
      onClick={() => videoInputRef.current.click()}
      className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:border-indigo-400 transition p-8 text-center cursor-pointer"
    >
      <p className="text-gray-500">Drag & drop or <span className="text-indigo-600 font-medium">click</span> to upload videos</p>
      <input
        type="file"
        accept="video/*"
        multiple
        ref={videoInputRef}
        onChange={handleVideoChange}
        className="hidden"
      />
    </div>

    {videoErrors.length > 0 && (
      <ul className="text-red-600 mt-3 text-sm space-y-1 list-disc list-inside">
        {videoErrors.map((err, i) => (
          <li key={i}>{err}</li>
        ))}
      </ul>
    )}

    {/* Video Previews */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
      {videos.map(({ previewUrl, progress }, i) => (
        <div key={i} className="relative group rounded-lg overflow-hidden shadow-sm">
          <video src={previewUrl} controls className="w-full h-56 object-cover rounded" />
          <button
            type="button"
            onClick={() => removeMedia('video', i)}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition"
          >
            ✖
          </button>
          {isSubmitting && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
              <div className="h-full bg-indigo-500" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
</section>


     {/* Group: Amenities & Status */}
<section className="bg-white p-8 shadow-xl rounded-2xl border border-gray-200">
  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
    <span className="text-blue-500 text-3xl">📋</span> Features & Status
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Amenities */}
    <div>
      <label className="block text-lg font-semibold text-gray-700 mb-4">Amenities</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {['Water', 'Electricity', 'Security', 'Parking', 'Prepaid Meter', 'Gated', 'Furnished'].map((item) => (
          <label
            key={item}
            className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 transition-all px-4 py-2 rounded-lg border border-gray-200 cursor-pointer"
          >
            <input
              type="checkbox"
              name="amenities"
              value={item}
              onChange={handleChange}
              className="accent-blue-600 h-4 w-4"
            />
            <span className="text-sm text-gray-800">{item}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Status */}
    <div>
      <label className="block text-lg font-semibold text-gray-700 mb-4">Status</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {['Newly Built', 'Available Now', 'Verified', 'Rent', 'Agent Listing'].map((item) => (
          <label
            key={item}
            className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 transition-all px-4 py-2 rounded-lg border border-gray-200 cursor-pointer"
          >
            <input
              type="checkbox"
              name="status"
              value={item}
              onChange={handleChange}
              className="accent-green-600 h-4 w-4"
            />
            <span className="text-sm text-gray-800">{item}</span>
          </label>
        ))}
      </div>
    </div>
  </div>
</section>


      {/* Submit */}
      <div className="text-right">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold px-6 py-2 rounded shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isSubmitting ? 'Posting...' : '📤 Post Listing'}
        </button>
      </div>
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
