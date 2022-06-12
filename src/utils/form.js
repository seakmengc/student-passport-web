import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

export const registerField = (form, field) => {
  return {
    register: form.register(field),
    error: form.formState.errors[field]?.message ?? '',
  };
};

export const registerEditorJsField = (form, field) => {
  const { name } = form.register(field);

  return {
    form,
    name,
    error: form.formState.errors[field]?.message ?? '',
  };
};

export const registerCheckboxField = (form, field) => {
  const { name } = form.register(field);

  return {
    register: {
      onChange: (values) => {
        form.setValue(name, values);
      },
    },
    error: form.formState.errors[field]?.message ?? '',
  };
};

export const registerSelectField = (form, field, callback = null) => {
  const { name } = form.register(field);

  return {
    register: {
      onChange: (val) => {
        form.setValue(name, val);

        if (callback) {
          callback(val);
        }
      },
    },
    error: form.formState.errors[field]?.message ?? '',
  };
};

export const setFormErrorFromApi = (form, data) => {
  form.setError('form', { type: 'error', message: data.message });

  for (const key in data.errors) {
    form.setError(key, { type: 'error', message: data.errors[key][0] });
  }
};

export const useReactHookForm = (schema, defaultValues = {}) => {
  return useForm({
    resolver: schema ? yupResolver(schema) : null,
    defaultValues,
  });
};

export const arrToIdData = (arr) => {
  return arr.map((each) => ({
    id: each,
    data: each,
  }));
};
