import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import { DeveloperCard } from '@/components/DeveloperCard';
import { getAccessToken } from '@/utils/auth';

interface Developer {
  _id: string;
  name: string;
  email: string;
  skills: string[];
  experience: string;
  location: string;
  userId: string;
}

interface QueryState {
  skill: string;
  location: string;
  page: number;
}

export default function DeveloperList() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [query, setQuery] = useState<QueryState>({ skill: '', location: '', page: 1 });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const router = useRouter();

  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/developers?skill=${query.skill}&location=${query.location}&page=${query.page}`
      );
      if (!res.ok) throw new Error('Failed to fetch developers');
      const data: Developer[] = await res.json();
      setDevelopers(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, [query]);

  const roles = user?.['https://dev-directory/roles'] as string[] | undefined;
  const isAdmin = roles?.includes('admin');

  const handleDelete = async (id: string) => {
    const token = await getAccessToken();
    const res = await fetch(`/api/developers/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      fetchDevelopers();
    } else {
      console.error('Failed to delete developer');
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center"> Developer Directory</h1>

      {/* Optional: Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <input
          type="text"
          placeholder="Search skill"
          className="border p-2 rounded-md shadow-sm"
          value={query.skill}
          onChange={(e) => setQuery({ ...query, skill: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by location"
          className="border p-2 rounded-md shadow-sm"
          value={query.location}
          onChange={(e) => setQuery({ ...query, location: e.target.value })}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
          onClick={() => fetchDevelopers()}
        >
          🔍 Search
        </button>
      </div>

      {loading && <p className="text-center text-gray-500">Loading developers...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {developers.map((dev) => (
          <DeveloperCard
            key={dev._id}
            developer={dev}
            isOwner={dev.userId === user?.sub}
            isAdmin={isAdmin ?? false}
            onEdit={() => router.push(`/developers/${dev._id}/edit`)}
            onDelete={() => handleDelete(dev._id)}
          />
        ))}
      </div>
    </div>
  );
}
