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

export const useReactHookForm = (schema) => {
  return useForm({
    resolver: yupResolver(schema),
  });
};
