// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <h1 className="text-3xl font-bold mb-4">Welcome to 152 Bar</h1>
      <p className="text-xl mb-6">Our website is being updated.</p>
      <a 
        href="/client-app" 
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Go to Application
      </a>
    </div>
  );
} 