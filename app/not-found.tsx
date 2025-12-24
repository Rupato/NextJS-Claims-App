import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <span className="text-6xl" role="img" aria-label="Not Found">
            🔍
          </span>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-6">
          {"The page you're looking for doesn't exist or has been moved."}
        </p>

        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
