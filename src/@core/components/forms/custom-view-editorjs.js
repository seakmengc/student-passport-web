import dynamic from 'next/dynamic';
import { useState } from 'react';
const CustomEditor = dynamic(
  () => import('../../../components/editorjs/custom-editor'),
  {
    ssr: false,
  }
);

export const CustomViewEditorJs = ({ content }) => {
  return (
    <CustomEditor
      setContent={(val) => {}}
      content={content}
      setSaveContent={() => {}}
      readOnly={true}
    />
  );
};
