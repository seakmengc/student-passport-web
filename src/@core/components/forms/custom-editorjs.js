import dynamic from 'next/dynamic';
import { useState } from 'react';
const CustomEditor = dynamic(
  () => import('../../../components/editorjs/custom-editor'),
  {
    ssr: false,
  }
);

export const CustomEditorJs = ({
  form,
  name,
  label,
  setSaveContent,
  error = '',
}) => {
  const hasError = error !== '';
  const [content, setContent] = useState(form.getValues()[name] ?? '');

  return (
    <div className='relative mb-3 w-full'>
      <label
        className={`block uppercase ${
          hasError ? 'text-error-500' : 'text-primary-600'
        } mb-2 text-xs font-bold`}
      >
        {label}
      </label>
      <div className='border-primary-600 border-2'>
        <CustomEditor
          setContent={(val) => {
            form.setValue(name, val);
            console.log(
              'val from editjs',
              JSON.parse(val),
              name,
              form.getValues()[name]
            );
            setContent(val);
          }}
          content={content}
          setSaveContent={setSaveContent}
        />
      </div>
      {hasError && (
        <label className='text-xs text-error-500'>
          {error[0].toUpperCase() + error.slice(1)}
        </label>
      )}
    </div>
  );
};
