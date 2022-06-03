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

export const CustomCheckbox = ({
  register,
  label,
  defaultValue = true,
  error = '',
}) => {
  const hasError = error !== '';

  return (
    <div>
      <FormControlLabel
        control={<Checkbox defaultChecked={defaultValue} />}
        label={label}
        {...register}
      />
      <span
        className={`${
          hasError ? 'text-error-600' : 'text-primary-600'
        } ml-2 text-sm font-semibold `}
      >
        {error}
      </span>
    </div>
  );
};
