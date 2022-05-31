import { Checkbox } from '@mui/material';
import MuiFormControlLabel from '@mui/material/FormControlLabel';
import React from 'react';
import { styled } from '@mui/material/styles';

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  },
}));

export const CustomCheckbox = ({ register, label, error = '' }) => {
  const hasError = error !== '';

  return (
    <div>
      <FormControlLabel
        control={<Checkbox defaultChecked={true} />}
        label={label}
        {...register}
      />
      {/* <span
        className={`${
          hasError ? 'text-error-600' : 'text-primary-600'
        } ml-2 text-sm font-semibold `}
      >
        {error}
      </span> */}
      {/* <label className='inline-flex cursor-pointer items-center'>
        <input
          type='checkbox'
          className={`form-checkbox ml-1 h-5 w-5 rounded border-0 ${
            hasError ? 'text-error-700' : 'text-primary-700'
          } transition-all duration-150 ease-linear`}
          {...register}
        />
        <span
          className={`${
            hasError ? 'text-error-600' : 'text-primary-600'
          } ml-2 text-sm font-semibold `}
        >
          {label}
        </span>
      </label> */}
    </div>
  );
};
