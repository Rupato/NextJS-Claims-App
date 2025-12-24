'use client';

import React, { useState, useTransition } from 'react';
import { createClaim } from '../../app/actions';

interface CreateClaimFormProps {
  onSuccess: () => void;
}

interface FormData {
  amount: string;
  holder: string;
  policyNumber: string;
  insuredName: string;
  description: string;
  processingFee: string;
  incidentDate: string;
}

interface FormErrors {
  amount?: string;
  holder?: string;
  policyNumber?: string;
  insuredName?: string;
  description?: string;
  processingFee?: string;
  incidentDate?: string;
}

const CreateClaimForm: React.FC<CreateClaimFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    holder: '',
    policyNumber: '',
    insuredName: '',
    description: '',
    processingFee: '',
    incidentDate: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();

  // Calculate form validity
  const isFormValid = React.useMemo(() => {
    // Check if all required fields are filled and have no errors
    const allFieldsFilled = Object.values(formData).every(
      (value) => value.trim() !== ''
    );
    const hasNoErrors = Object.values(errors).every((error) => !error);
    const allTouched = [
      'amount',
      'holder',
      'policyNumber',
      'insuredName',
      'description',
      'processingFee',
      'incidentDate',
    ].every((field) => touched[field]);

    return allFieldsFilled && hasNoErrors && allTouched;
  }, [formData, errors, touched]);

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
    if (formData.amount && !formData.processingFee) {
      const amount = parseFloat(formData.amount);
      if (!isNaN(amount)) {
        // Set processing fee to 5% of claim amount, rounded to 2 decimal places
        const processingFee = (amount * 0.05).toFixed(2);
        setFormData((prev) => ({ ...prev, processingFee }));
      }
    }
  }, [formData.amount, formData.processingFee]);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'amount':
        if (!value) return 'Claim amount is required';
        const amount = parseFloat(value);
        if (isNaN(amount) || amount <= 0) return 'Please enter a valid amount';
        if (amount > 10000) return 'Claim amount cannot exceed $10,000';
        break;
      case 'holder':
        if (!value) return 'Policy holder name is required';
        if (value.length < 2)
          return 'Policy holder name must be at least 2 characters';
        break;
      case 'policyNumber':
        if (!value) return 'Policy number is required';
        if (!/^TL-\d{5}$/.test(value))
          return 'Policy number must be in format TL-XXXXX';
        break;
      case 'insuredName':
        if (!value) return 'Insured name is required';
        if (value.length < 2)
          return 'Insured name must be at least 2 characters';
        break;
      case 'description':
        if (!value) return 'Description is required';
        if (value.length < 10)
          return 'Description must be at least 10 characters';
        break;
      case 'processingFee':
        if (!value) return 'Processing fee is required';
        const fee = parseFloat(value);
        if (isNaN(fee) || fee < 0) return 'Please enter a valid processing fee';
        break;
      case 'incidentDate':
        if (!value) return 'Incident date is required';
        const date = new Date(value);
        const now = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 6);

        if (date > now) return 'Incident date cannot be in the future';
        if (date < sixMonthsAgo)
          return 'Incident date cannot be more than 6 months ago';
        break;
    }
    return undefined;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) newErrors[key as keyof FormErrors] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        amount: true,
        holder: true,
        policyNumber: true,
        insuredName: true,
        description: true,
        processingFee: true,
        incidentDate: true,
      });
      return;
    }

    // If validation passes, submit the form data
    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSubmit.append(key, value);
    });

    startTransition(async () => {
      const result = await createClaim(formDataToSubmit);
      if (result.success) {
        onSuccess();
      } else {
        console.error('Failed to create claim:', result.error);
      }
    });
  };

  const isFieldValid = (fieldName: string) => {
    return !errors[fieldName as keyof FormErrors] && touched[fieldName];
  };

  const isFieldInvalid = (fieldName: string) => {
    return errors[fieldName as keyof FormErrors] && touched[fieldName];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            step="0.01"
            min="0"
            max="10000"
            className={`mt-1 h-[40px] p-[10px] block w-full rounded-md shadow-sm sm:text-sm text-black ${
              isFieldInvalid('amount')
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : isFieldValid('amount')
                  ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
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
            name="processingFee"
            value={formData.processingFee}
            onChange={handleChange}
            onBlur={handleBlur}
            step="0.01"
            min="0"
            className={`mt-1 block w-full h-[40px] p-[10px] rounded-md shadow-sm text-sm text-black ${
              isFieldInvalid('processingFee')
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : isFieldValid('processingFee')
                  ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="0.00"
          />
          {errors.processingFee && (
            <p className="mt-1 text-sm text-red-600">{errors.processingFee}</p>
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
        </label>
        <input
          type="text"
          id="holder"
          name="holder"
          value={formData.holder}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-1 block w-full h-[40px] p-[10px] rounded-md shadow-sm text-sm text-black ${
            isFieldInvalid('holder')
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : isFieldValid('holder')
                ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          placeholder="Enter policy holder name"
        />
        {errors.holder && (
          <p className="mt-1 text-sm text-red-600">{errors.holder}</p>
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
          name="policyNumber"
          value={formData.policyNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-1 block w-full h-[40px] p-[10px] text-black rounded-md shadow-sm text-sm ${
            isFieldInvalid('policyNumber')
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : isFieldValid('policyNumber')
                ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          placeholder="TL-XXXXX"
        />
        {errors.policyNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.policyNumber}</p>
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
          name="insuredName"
          value={formData.insuredName}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-1 block w-full h-[40px] p-[10px] text-black rounded-md shadow-sm text-sm ${
            isFieldInvalid('insuredName')
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : isFieldValid('insuredName')
                ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          placeholder="Enter insured item name"
        />
        {errors.insuredName && (
          <p className="mt-1 text-sm text-red-600">{errors.insuredName}</p>
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
        <input
          type="date"
          id="incidentDate"
          name="incidentDate"
          value={formData.incidentDate}
          onChange={handleChange}
          onBlur={handleBlur}
          min={sixMonthsAgo}
          max={yesterday}
          className={`mt-1 block w-full h-[40px] p-[10px] text-black rounded-md shadow-sm text-sm ${
            isFieldInvalid('incidentDate')
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : isFieldValid('incidentDate')
                ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        {errors.incidentDate && (
          <p className="mt-1 text-sm text-red-600">{errors.incidentDate}</p>
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
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-1 block w-full h-[40px] p-[10px] text-black rounded-md shadow-sm text-sm ${
            isFieldInvalid('description')
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : isFieldValid('description')
                ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          placeholder="Describe the incident and claim details..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.description.length}/10 minimum characters
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isFormValid || isPending}
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
