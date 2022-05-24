import React from 'react';
import { AlertCommon } from 'src/@core/components/alerts/common';

export const FormWrapper = ({ children, form, onSubmit }) => {
  const hasError = Object.keys(form.formState.errors).length > 0;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <AlertCommon
        msg={form.formState.errors['form']?.message ?? ''}
        error={hasError}
      ></AlertCommon>

      {children}
    </form>
  );
};
