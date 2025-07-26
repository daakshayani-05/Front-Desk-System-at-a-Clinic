// clinic-front-desk/frontend/src/pages/dashboard.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => setUser(response.data))
      .catch(() => router.push('/'));
  }, [router]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Front Desk Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/queue" className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600">
          Queue Management
        </a>
        <a href="/appointments" className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600">
          Appointment Management
        </a>
        <a href="/doctors" className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600">
          Doctor Profiles
        </a>
      </div>
    </div>
  );
}