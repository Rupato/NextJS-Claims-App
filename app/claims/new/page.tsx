'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateClaimMutation } from '@/features/claims-management/hooks/useClaimsQuery';

// Lazy load the CreateClaimForm for better performance
const CreateClaimForm = React.lazy(
  () => import('@/features/claims-management/components/CreateClaimForm')
);

// Loading fallback component
const CreateClaimFormSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-28"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
    <div className="flex justify-end space-x-3">
      <div className="h-10 bg-gray-200 rounded w-20"></div>
      <div className="h-10 bg-blue-200 rounded w-24"></div>
    </div>
  </div>
);

const NewClaimPage = () => {
  const router = useRouter();
  const createClaimMutation = useCreateClaimMutation();
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);

  // Handle successful mutation - show success message then navigate
  useEffect(() => {
    if (createClaimMutation.isSuccess) {
      // Reset unsaved changes flag since we're navigating after successful save
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasUnsavedChanges(false);
      // Show success message
      setShowSuccessMessage(true);
      // Navigate after showing success message for 2 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        router.push('/');
      }, 2000);
    }
  }, [createClaimMutation.isSuccess, router]);

  // Warn user about unsaved changes when trying to close/refresh browser
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Function to handle back button with unsaved changes warning
  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave without saving?'
      );
      if (!confirmLeave) return;
    }
    router.push('/');
  };

  // Function to pass down to form to track changes
  const handleFormChange = (hasChanges: boolean) => {
    setHasUnsavedChanges(hasChanges);
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
                onClick={handleBackClick}
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
            <Suspense fallback={<CreateClaimFormSkeleton />}>
              <CreateClaimForm onFormChange={handleFormChange} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Success Message Overlay */}
      {showSuccessMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-8 w-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Claim Created Successfully!
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Redirecting to claims list...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewClaimPage;
