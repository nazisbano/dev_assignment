import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CreateDeveloper() {
  const [form, setForm] = useState({ name: '', email: '', skills: '', experience: '', location: '' });
  const router = useRouter();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch('/api/developers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, skills: form.skills.split(',') }),
    });
    router.push('/developers');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Create Developer Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full border p-2" name="name" placeholder="Name" onChange={handleChange} required />
        <input className="w-full border p-2" name="email" placeholder="Email" onChange={handleChange} required />
        <input className="w-full border p-2" name="skills" placeholder="Skills (comma separated)" onChange={handleChange} required />
        <input className="w-full border p-2" name="experience" placeholder="Experience" onChange={handleChange} required />
        <input className="w-full border p-2" name="location" placeholder="Location" onChange={handleChange} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Create</button>
      </form>
    </div>
  );
}