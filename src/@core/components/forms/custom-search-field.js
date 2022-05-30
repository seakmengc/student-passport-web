import React from 'react';
import _ from 'lodash/debounce';

export const CustomSearchField = ({
  onChange,
  label,
  type = 'text',
  error = '',
}) => {
  const hasError = error !== '';

  return (
    <div className='relative mb-3 w-full'>
      <input
        type={type}
        className={`${
          !hasError ? 'border-0' : 'border-2 border-error-500'
        } placeholder-primary-300 w-full rounded bg-white px-3 py-3 text-sm text-black shadow ring-primary transition-all duration-150 ease-linear  focus:outline-none focus:ring`}
        placeholder={label}
        onChange={_((event) => {
          const {
            target: { value },
          } = event;

          onChange(value);
        }, 600)}
      />
      {hasError && (
        <label className='text-xs text-error-500'>
          {error[0].toUpperCase() + error.slice(1)}
        </label>
      )}
    </div>
  );
};
