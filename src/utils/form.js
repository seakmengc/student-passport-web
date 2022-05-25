import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

export const registerField = (form, field) => {
  return {
    register: form.register(field),
    error: form.formState.errors[field]?.message ?? '',
  };
};

export const registerCheckboxField = (form, field) => {
  const { name } = form.register(field);

  return {
    register: {
      onChange: (isChecked) => {
        form.setValue(name, isChecked);
      },
    },
    error: form.formState.errors[field]?.message ?? '',
  };
};

export const setFormErrorFromApi = (form, data) => {
  form.setError('form', { type: 'api', message: data.message });

  for (const key in data.errors) {
    form.setError(key, { type: 'api', message: data.errors[key][0] });
  }
};

export const useReactHookForm = (schema) => {
  return useForm({
    resolver: yupResolver(schema),
  });
};
