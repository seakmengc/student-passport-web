import { useState } from 'react';
import { AlertCommon } from 'src/@core/components/alerts/common';

export const FormWrapper = ({ children, form, onSubmit }) => {
  const [openErrorAlert, setOpenErrorAlert] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        if (openErrorAlert) {
          setOpenErrorAlert(false);
        }

        const rtn = await form.handleSubmit(onSubmit)(e);

        if (form.formState.errors['form']?.message) {
          setOpenErrorAlert(true);
        }

        return rtn;
      }}
    >
      <div>
        <AlertCommon
          open={openErrorAlert}
          msg={form.formState.errors['form']?.message}
          error={form.formState.errors['form']?.type === 'error'}
          onClose={() => setOpenErrorAlert(false)}
        ></AlertCommon>
      </div>

      {children}
    </form>
  );
};
