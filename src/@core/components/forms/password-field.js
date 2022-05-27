import { IconButton } from '@mui/material';
import React, { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export const PasswordField = ({ register, label, error = '' }) => {
  const hasError = error !== '';
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='relative mb-3 w-full'>
      <div className='flex flex-row'>
        <label
          className={` uppercase ${
            hasError ? 'text-error-500' : 'text-label-600'
          } my-auto mb-2 text-xs font-bold`}
        >
          {label}
        </label>
        <IconButton
          tabIndex={-1}
          size='5'
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <VisibilityOffIcon fontSize='small' />
          ) : (
            <VisibilityIcon fontSize='small' />
          )}
        </IconButton>
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
