import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';

interface DeveloperForm {
  name: string;
  email: string;
  skills: string;
  experience: string;
  location: string;
}

export default function EditDeveloper() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState<DeveloperForm>({
    name: '',
    email: '',
    skills: '',
    experience: '',
    location: '',
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeveloper = async () => {
      if (!id) return;

      try {
        const res = await fetch(`/api/developers/${id}`);
        if (!res.ok) throw new Error('Failed to load developer');

        const data = await res.json();
        setForm({ ...data, skills: data.skills.join(', ') });
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
    };

    fetchDeveloper();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/developers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, skills: form.skills.split(',').map(s => s.trim()) }),
      });

      if (!res.ok) throw new Error('Update failed');
      router.push('/developers');
    } catch (err: any) {
      setError(err.message || 'Update failed');
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading developer profile...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">Edit Developer Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="name"
          value={form.name}
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="email"
          value={form.email}
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="skills"
          value={form.skills}
          placeholder="Skills (comma separated)"
          onChange={handleChange}
          required
        />
        <input
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="experience"
          value={form.experience}
          placeholder="Experience"
          onChange={handleChange}
          required
        />
        <input
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="location"
          value={form.location}
          placeholder="Location"
          onChange={handleChange}
          required
        />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded transition duration-150"
          type="submit"
        >
          Update Developer
        </button>
      </form>
    </div>
  );
}
