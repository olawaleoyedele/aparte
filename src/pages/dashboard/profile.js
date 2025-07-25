import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';

export default function ProfilePage({ user }) {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <p className="text-gray-600">Name: {user.name || 'N/A'}</p>
      <p className="text-gray-600">Email: {user.email || 'N/A'}</p>
      <p className="text-gray-600">Agency: {user.agencyName || 'N/A'}</p>
    </DashboardLayout>
  );
}

export const getServerSideProps = async (context) => {
  const { token } = parseCookies(context);

  if (!token) {
    return {
      redirect: {
        destination: '/login/agent',
        permanent: false,
      },
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Role check: block access if not an agent
    if (decoded.role !== 'agent') {
      return {
        redirect: {
          destination: '/unauthorized', // or redirect to home or login
          permanent: false,
        },
      };
    }

    const user = {
      name: decoded.name || '',
      email: decoded.email || '',
      agencyName: decoded.agencyName || '',
    };

    return {
      props: { user },
    };
  } catch (err) {
    console.error('JWT verification failed:', err);
    return {
      redirect: {
        destination: '/login/agent',
        permanent: false,
      },
    };
  }
};
