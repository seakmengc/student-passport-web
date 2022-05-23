import React, { useState } from 'react';

export const PasswordField = ({ register, label, error = '' }) => {
  const hasError = error !== '';
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='relative mb-3 w-full'>
      <div className='flex flex-row'>
        <label
          className={` uppercase ${
            hasError ? 'text-error-500' : 'text-label-600'
          } mb-2 text-xs font-bold`}
        >
          {label}
        </label>
        <label
          className='justify-end text-xs uppercase'
          onClick={() => setShowPassword(!showPassword)}
        >
          Show
        </label>
      </div>
      <input
        type={showPassword ? 'text' : 'password'}
        className={`${
          !hasError ? 'border-0' : 'border-2 border-error-500'
        } text-primary-600 placeholder-primary-300 w-full rounded bg-white px-3 py-3 text-sm shadow outline-primary transition-all duration-150 ease-linear focus:outline-none focus:ring`}
        placeholder={label}
        {...register}
      />
      {hasError && (
        <label className='text-xs text-error-500'>
          {error[0].toUpperCase() + error.slice(1)}
        </label>
      )}
    </div>
  );
};
