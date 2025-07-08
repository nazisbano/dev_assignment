import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import type { NextPage } from 'next';
import { LogIn, LogOut, Plus, Users } from 'lucide-react';

const Home: NextPage = () => {
  const { user, isLoading } = useUser();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-300 opacity-30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-green-300 opacity-20 rounded-full blur-3xl animate-pulse" />

      {/* Card */}
      <section className="relative z-10 max-w-2xl w-full backdrop-blur-lg bg-white/80 border border-blue-100 rounded-3xl shadow-2xl p-10">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-2">Developer Directory</h1>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading user information...</p>
        ) : user ? (
          <>
            <p className="text-lg text-center text-gray-700 mb-6">
              Welcome back, <span className="font-semibold">{user.name || user.email}</span>!
            </p>

            <div className="grid gap-4">
              <Link
                href="/developers"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl shadow transition duration-150"
              >
                <Users className="w-5 h-5" /> View All Developers
              </Link>
              <Link
                href="/developers/create"
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl shadow transition duration-150"
              >
                <Plus className="w-5 h-5" /> Create Developer Profile
              </Link>
              <Link
                href="/api/auth/logout"
                className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:underline font-medium mt-2 transition"
              >
                <LogOut className="w-5 h-5" /> Logout
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="text-lg text-center text-gray-700 mb-6">
              Please log in to view and manage developer profiles.
            </p>
            <Link
              href="/api/auth/login"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl shadow transition duration-150"
            >
              <LogIn className="w-2 h-2" /> Login with Auth0
            </Link>
          </>
        )}
      </section>
    </main>
  );
};

export default Home;
