import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      <h1 className="text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
        Attendance System
      </h1>
      <p className="text-xl mb-12 text-gray-300">
        Secure, Geolocation-based Attendance Tracking
      </p>

      <div className="flex gap-6">
        <Link href="/login" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all shadow-lg hover:shadow-blue-500/30">
          Login
        </Link>
      </div>
    </main>
  );
}
