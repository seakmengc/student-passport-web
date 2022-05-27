import { useState } from 'react';
import { AlertCommon } from 'src/@core/components/alerts/common';

export const FormWrapper = ({ children, form, onSubmit }) => {
  const hasError = Object.keys(form.formState.errors).length > 0;
  const [open, setOpen] = useState(true);

  return (
    <form
      onSubmit={(e) => {
        setOpen(true);

        return form.handleSubmit(onSubmit)(e);
      }}
    >
      {open && form.formState.errors['form']?.message && (
        <AlertCommon
          msg={form.formState.errors['form']?.message}
          error={hasError}
          onClose={() => setOpen(false)}
        ></AlertCommon>
      )}

      {children}
    </form>
  );
};
