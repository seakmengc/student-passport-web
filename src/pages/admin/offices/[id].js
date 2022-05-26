import { Button, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { createRef, useRef, useState } from 'react';
import { AdminRoute } from 'src/middleware/admin-route';
import { useGetApi, usePatchApi } from 'src/utils/api';
import { ssrGetToken } from 'src/utils/ssr';

const CustomEditor = dynamic(
  () => import('../../../components/editorjs/custom-editor'),
  {
    ssr: false,
  }
);

const OfficeDetail = ({ office }) => {
  const [content, setContent] = useState(office.description);
  const [saveContent, setSaveContent] = useState({});

  return (
    <div>
      <div className='ml-4 mb-4 flex flex-row justify-between'>
        <Typography variant='h4'>{office.name}</Typography>
        <Button
          variant='contained'
          onClick={async () => {
            await saveContent.callback();
            console.log(typeof content);

            const { data, error } = await usePatchApi('office/' + office._id, {
              description: content,
            });
          }}
        >
          Save
        </Button>
      </div>

      <CustomEditor
        setContent={setContent}
        content={content}
        setSaveContent={setSaveContent}
      />
    </div>
  );
};

export default OfficeDetail;

export const getServerSideProps = AdminRoute(async ({ req, params }) => {
  const { accessToken } = ssrGetToken(req);

  const { data, error } = await useGetApi(
    'office/' + params.id,
    {},
    accessToken
  );

  console.log(data);

  return {
    props: { office: data },
  };
});
