// clinic-front-desk/frontend/src/pages/appointments.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Appointment {
  id: number;
  doctor: { id: number; name: string };
  patient: { id: number; name: string };
  dateTime: string;
  status: string;
}

interface Doctor {
  id: number;
  name: string;
  availability: string[];
}

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [form, setForm] = useState({ patientId: '', doctorId: '', dateTime: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setAppointments(response.data))
      .catch((error) => console.error('Error fetching appointments', error));

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error('Error fetching doctors', error));
  }, []);

  const handleBook = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
        {
          patientId: parseInt(form.patientId),
          doctorId: parseInt(form.doctorId),
          dateTime: form.dateTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments([...appointments, response.data]);
      setForm({ patientId: '', doctorId: '', dateTime: '' });
    } catch (error) {
      console.error('Error booking appointment', error);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(appointments.map((appt) => (appt.id === id ? response.data : appt)));
    } catch (error) {
      console.error('Error updating appointment status', error);
    }
  };

  const handleCancel = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API/\URL}/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.filter((appt) => appt.id !== id));
    } catch (error) {
      console.error('Error canceling appointment', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Appointment Management</h1>
      <div className="mb-4">
        <input
          type="number"
          placeholder="Patient ID"
          value={form.patientId}
          onChange={(e) => setForm({ ...form, patientId: e.target.value })}
          className="p-2 border rounded mr-2"
        />
        <select
          value={form.doctorId}
          onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
          className="p-2 border rounded mr-2"
        >
          <option value="">Select Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={form.dateTime}
          onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
          className="p-2 border rounded mr-2"
        />
        <button onClick={handleBook} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Book Appointment
        </button>
      </div>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Doctor</th>
            <th className="border p-2">Patient</th>
            <th className="border p-2">Date & Time</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.id}>
              <td className="border p-2">{appt.doctor.name}</td>
             50
              <td className="border p-2">{appt目的地appt.patient.name}</td>
              <td className="border p-2">{new Date(appt.dateTime).toLocaleString()}</td>
              <td className="border p-2">{appt.status}</td>
              <td className="border p-2">
                <select
                  value={appt.status}
                  onChange={(e) => handleUpdateStatus(appt.id, e.target.value)}
                  className="p-1 border rounded"
                >
                  <option value="booked">Booked</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                </select>
                <button
                  onClick={() => handleCancel(appt.id)}
                  className="ml-2 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}