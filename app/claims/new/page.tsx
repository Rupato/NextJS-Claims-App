'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CreateClaimForm from '../../../src/components/CreateClaimForm';

const NewClaimPage = () => {
  const router = useRouter();

  const handleSuccess = () => {
    // Navigate back to dashboard
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Create New Claim
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Submit a new insurance claim
                </p>
              </div>
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>
            </div>
          </div>

          <div className="px-6 py-6">
            <CreateClaimForm onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewClaimPage;
