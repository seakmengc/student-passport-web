import { useState } from 'react';
import { AlertCommon } from 'src/@core/components/alerts/common';

export const FormWrapper = ({ children, form, onSubmit }) => {
  const hasError = Object.keys(form.formState.errors).length > 0;
  const [openErrorAlert, setOpenErrorAlert] = useState(true);

  return (
    <form
      onSubmit={(e) => {
        setOpenErrorAlert(true);

        return form.handleSubmit(onSubmit)(e);
      }}
    >
      {openErrorAlert && form.formState.errors['form']?.message && (
        <AlertCommon
          msg={form.formState.errors['form']?.message}
          error={form.formState.errors['form']?.type === 'error'}
          onClose={() => setOpenErrorAlert(false)}
        ></AlertCommon>
      )}

      {children}
    </form>
  );
};
