'use client';

import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  useCreateClaimMutation,
  usePolicyQuery,
} from '../hooks/useClaimsQuery';
import { useRouter } from 'next/navigation';

// Yup validation schema
const validationSchema = yup.object({
  amount: yup
    .string()
    .required('Claim amount is required')
    .test('is-valid-number', 'Please enter a valid amount', (value) => {
      if (!value) return false;
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    })
    .test('max-amount', 'Claim amount cannot exceed $10,000', (value) => {
      if (!value) return true;
      const num = parseFloat(value);
      return num <= 10000;
    }),
  holder: yup
    .string()
    .required('Policy holder name is required')
    .min(2, 'Policy holder name must be at least 2 characters'),
  policyNumber: yup
    .string()
    .required('Policy number is required')
    .matches(/^TL-\d{5}$/, 'Policy number must be in format TL-XXXXX'),
  insuredName: yup
    .string()
    .required('Insured name is required')
    .min(2, 'Insured name must be at least 2 characters'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  processingFee: yup
    .string()
    .required('Processing fee is required')
    .test('is-valid-fee', 'Please enter a valid processing fee', (value) => {
      if (!value) return false;
      const num = parseFloat(value);
      return !isNaN(num) && num >= 0;
    }),
  incidentDate: yup
    .string()
    .required('Incident date is required')
    .test(
      'valid-date-range',
      'Incident date must be between 6 months ago and yesterday',
      (value) => {
        if (!value) return false;
        const date = new Date(value);
        const now = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 6);

        return date >= sixMonthsAgo && date <= now;
      }
    ),
});

type FormData = yup.InferType<typeof validationSchema>;

interface CreateClaimFormProps {
  onFormChange?: (hasChanges: boolean) => void;
}

const CreateClaimForm: React.FC<CreateClaimFormProps> = ({ onFormChange }) => {
  const navigate = useRouter();
  // Initialize React Hook Form with Yup resolver
  const {
    register,
    handleSubmit: rhfHandleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur', // Validate on blur
  });

  const [isHolderAutoFilled, setIsHolderAutoFilled] = useState(false);
  const [shouldLookupPolicy, setShouldLookupPolicy] = useState(false);

  // Watch form values for smart behaviors using useWatch
  const formValues = useWatch({
    control,
  });

  // Use the client-side mutation hook
  const createClaimMutation = useCreateClaimMutation();
  const isPending = createClaimMutation.isPending;
  const mutationError = createClaimMutation.error;

  // Policy lookup query - only enabled when we have a valid policy number and should lookup
  const {
    data: policyData,
    isLoading: isPolicyLoading,
    error: policyError,
  } = usePolicyQuery(
    formValues.policyNumber || '',
    shouldLookupPolicy && !!formValues.policyNumber
  );

  // Calculate date constraints
  const sixMonthsAgo = React.useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    return date.toISOString().split('T')[0];
  }, []);

  const yesterday = React.useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Smart field behavior: auto-calculate processing fee based on amount
  React.useEffect(() => {
    if (formValues.amount && !formValues.processingFee) {
      const amount = parseFloat(formValues.amount.replace(/,/g, '')); // Remove commas for calculation
      if (!isNaN(amount)) {
        // Set processing fee to 5% of claim amount, rounded to 2 decimal places
        const processingFee = (amount * 0.05).toFixed(2);
        setValue('processingFee', processingFee);
      }
    }
  }, [formValues.amount, formValues.processingFee, setValue]);

  // Handle policy lookup response
  React.useEffect(() => {
    if (policyData && shouldLookupPolicy) {
      // Auto-fill holder name
      setValue('holder', policyData.holder);
      setIsHolderAutoFilled(true);
      setShouldLookupPolicy(false); // Reset the trigger
    } else if (policyData === null && shouldLookupPolicy) {
      // Policy not found - allow manual entry
      setIsHolderAutoFilled(false);
      setShouldLookupPolicy(false); // Reset the trigger
    }
  }, [policyData, shouldLookupPolicy, setValue]);

  // Handle policy lookup errors
  React.useEffect(() => {
    if (policyError && shouldLookupPolicy) {
      // API failed - allow manual entry
      setIsHolderAutoFilled(false);
      setShouldLookupPolicy(false);
    }
  }, [policyError, shouldLookupPolicy]);

  // Track form changes for unsaved changes warning
  React.useEffect(() => {
    const hasChanges = Object.values(formValues).some(
      (value) => value && value.trim() !== ''
    );
    onFormChange?.(hasChanges);
  }, [formValues, onFormChange]);

  // Handle policy lookup trigger
  const handlePolicyBlur = () => {
    const policyNumber = formValues.policyNumber;
    if (policyNumber && /^TL-\d{5}$/.test(policyNumber)) {
      setShouldLookupPolicy(true);
    }
  };

  // Handle form submission with React Hook Form
  const onSubmit = (data: FormData) => {
    createClaimMutation.mutate(data);
    navigate.replace('/');
  };

  return (
    <form onSubmit={rhfHandleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Amount */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Claim Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            step="0.01"
            min="0"
            max="10000"
            className={`mt-1 h-[40px] p-[10px] block w-full rounded-md shadow-sm sm:text-sm text-black ${
              errors.amount
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="0.00"
            {...register('amount')}
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        {/* Processing Fee */}
        <div>
          <label
            htmlFor="processingFee"
            className="block text-sm font-medium text-gray-700"
          >
            Processing Fee ($)
          </label>
          <input
            type="number"
            id="processingFee"
            step="0.01"
            min="0"
            className={`mt-1 block w-full h-[40px] p-[10px] rounded-md shadow-sm text-sm text-black ${
              errors.processingFee
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="0.00"
            {...register('processingFee')}
          />
          {errors.processingFee && (
            <p className="mt-1 text-sm text-red-600">
              {errors.processingFee.message}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Auto-calculated as 5% of claim amount
          </p>
        </div>
      </div>

      {/* Policy Holder */}
      <div>
        <label
          htmlFor="holder"
          className="block text-sm font-medium text-gray-700"
        >
          Policy Holder Name
          {isHolderAutoFilled && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              Auto-filled
            </span>
          )}
        </label>
        <div className="relative">
          <input
            type="text"
            id="holder"
            className={`mt-1 block w-full h-[40px] p-[10px] rounded-md shadow-sm text-sm text-black ${
              errors.holder
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : isHolderAutoFilled
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder={
              isHolderAutoFilled
                ? 'Auto-filled from policy'
                : 'Enter policy holder name'
            }
            {...register('holder')}
          />
          {isPolicyLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg
                className="animate-spin h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}
        </div>
        {errors.holder && (
          <p className="mt-1 text-sm text-red-600">{errors.holder.message}</p>
        )}
        {isHolderAutoFilled && (
          <p className="mt-1 text-xs text-green-600">
            Policy verified ✓ You can still edit this field if needed
          </p>
        )}
      </div>

      {/* Policy Number */}
      <div>
        <label
          htmlFor="policyNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Policy Number
        </label>
        <input
          type="text"
          id="policyNumber"
          className={`mt-1 block w-full h-[40px] p-[10px] text-black rounded-md shadow-sm text-sm ${
            errors.policyNumber
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          placeholder="TL-XXXXX"
          {...register('policyNumber', {
            onBlur: handlePolicyBlur,
          })}
        />
        {errors.policyNumber && (
          <p className="mt-1 text-sm text-red-600">
            {errors.policyNumber.message}
          </p>
        )}
      </div>

      {/* Insured Name */}
      <div>
        <label
          htmlFor="insuredName"
          className="block text-sm font-medium text-gray-700"
        >
          Insured Item Name
        </label>
        <input
          type="text"
          id="insuredName"
          className={`mt-1 block w-full h-[40px] p-[10px] text-black rounded-md shadow-sm text-sm ${
            errors.insuredName
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          placeholder="Enter insured item name"
          {...register('insuredName')}
        />
        {errors.insuredName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.insuredName.message}
          </p>
        )}
      </div>

      {/* Incident Date */}
      <div>
        <label
          htmlFor="incidentDate"
          className="block text-sm font-medium text-gray-700"
        >
          Incident Date
        </label>
        <DatePicker
          selected={
            formValues.incidentDate ? new Date(formValues.incidentDate) : null
          }
          onChange={(date: Date | null) => {
            const dateString = date ? date.toISOString().split('T')[0] : '';
            setValue('incidentDate', dateString);
          }}
          minDate={new Date(sixMonthsAgo)}
          maxDate={new Date(yesterday)}
          dateFormat="MMM dd, yyyy"
          placeholderText="Select incident date"
          className={`mt-1 block w-full h-[40px] p-[10px] text-black rounded-md shadow-sm text-sm ${
            errors.incidentDate
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        {errors.incidentDate && (
          <p className="mt-1 text-sm text-red-600">
            {errors.incidentDate.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className={`mt-1 block w-full h-[40px] p-[10px] text-black rounded-md shadow-sm text-sm ${
            errors.description
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          placeholder="Describe the incident and claim details..."
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formValues.description?.length || 0}/10 minimum characters
        </p>
      </div>

      {/* API Error Display */}
      {mutationError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400" role="img" aria-label="Error">
                ⚠️
              </span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Failed to create claim
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  {mutationError instanceof Error
                    ? mutationError.message
                    : 'An unexpected error occurred. Please try again.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isValid || isPending}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating Claim...
            </>
          ) : (
            <>
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create Claim
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateClaimForm;
