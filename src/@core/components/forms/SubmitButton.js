import { Button } from '@nextui-org/react';
import React from 'react';

export const SubmitButton = ({ label, type = 'submit' }) => {
  return (
    <div className='mt-6 text-center'>
      <button
        className='mr-1 mb-1 w-full rounded bg-primary-800 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-primary-600'
        type={type}
      >
        {label}
      </button>
    </div>
  );
};
