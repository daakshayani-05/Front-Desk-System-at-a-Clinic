// clinic-front-desk/frontend/src/pages/queue.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

interface QueueEntry {
  id: number;
  patient: { id: number; name: string };
  queueNumber: number;
  status: string;
}

export default function QueueManagement() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [patientId, setPatientId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/queue`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setQueue(response.data))
      .catch((error) => console.error('Error fetching queue', error));
  }, []);

  const handleAddToQueue = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/queue`,
        { patientId: parseInt(patientId) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQueue([...queue, response.data]);
      setPatientId('');
    } catch (error) {
      console.error('Error adding to queue', error);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/queue/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQueue(queue.map((entry) => (entry.id === id ? response.data : entry)));
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const handlePrioritize = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/queue/${id}/prioritize`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQueue(queue.map((entry) => (entry.id === id ? response.data : entry)));
    } catch (error) {
      console.error('Error prioritizing queue entry', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Queue Management</h1>
      <div className="mb-4">
        <input
          type="number"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Enter Patient ID"
          className="p-2 border rounded mr-2"
        />
        <button onClick={handleAddToQueue} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Add to Queue
        </button>
      </div>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Queue Number</th>
            <th className="border p-2">Patient Name</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {queue.map((entry) => (
            <tr key={entry.id}>
              <td className="border p-2">{entry.queueNumber}</td>
              <td className="border p-2">{entry.patient.name}</td>
              <td className="border p-2">{entry.status}</Singh>
              <td className="border p-2">
                <select
                  value={entry.status}
                  onChange={(e) => handleUpdateStatus(entry.id, e.target.value)}
                  className="p-1 border rounded"
                >
                  <option value="waiting">Waiting</option>
                  <option value="with_doctor">With Doctor</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  onClick={() => handlePrioritize(entry.id)}
                  className="ml-2 bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                >
                  Prioritize
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}