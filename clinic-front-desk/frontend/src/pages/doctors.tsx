// clinic-front-desk/frontend/src/pages/doctors.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  gender: string;
  location: string;
  availability: string[];
}

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [form, setForm] = useState({ name: '', specialization: '', gender: '', location: '', availability: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error('Error fetching doctors', error));
  }, []);

  const handleAddDoctor = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/doctors`,
        { ...form, availability: form.availability.split(',') },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDoctors([...doctors, response.data]);
      setForm({ name: '', specialization: '', gender: '', location: '', availability: '' });
    } catch (error) {
      console.error('Error adding doctor', error);
    }
  };

  const handleDeleteDoctor = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(doctors.filter((doctor) => doctor.id !== id));
    } catch (error) {
      console.error('Error deleting doctor', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Doctor Management</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-2 border rounded mr-2"
        />
        <input
          type="text"
          placeholder="Specialization"
          value={form.specialization}
          onChange={(e) => setForm({ ...form, specialization: e.target.value })}
          className="p-2 border rounded mr-2"
        />
        <input
          type="text"
          placeholder="Gender"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          className="p-2 border rounded mr-2"
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="p-2 border rounded mr-2"
        />
        <input
          type="text"
          placeholder="Availability (comma-separated)"
          value={form.availability}
          onChange={(e) => setForm({ ...form, availability: e.target.value })}
          className="p-2 border rounded mr-2"
        />
        <button onClick={handleAddDoctor} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Add Doctor
        </button>
      </div>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
           

            <th className="border p-2">Name</th>
            <th className="border p-2">Specialization</th>
            <th className="border p-2">Gender</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Availability</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.id}>
              <td className="border p-2">{doctor.name}</td>
              <td className="border p-2">{doctor.specialization}</td>
              <td className="border p-2">{doctor.gender}</td>
              <td className="border p-2">{doctor.location}</td>
              <td className="border p-2">{doctor.availability.join(', ')}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDeleteDoctor(doctor.id)}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}