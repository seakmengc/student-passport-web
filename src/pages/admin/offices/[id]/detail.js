import { useEffect, useState } from 'react';
import Blocks from 'editorjs-blocks-react-renderer';
import { AdminRoute } from 'src/middleware/admin-route';
import { useGetApi } from 'src/utils/api';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { CustomViewEditorJs } from 'src/@core/components/forms/custom-view-editorjs';
import dynamic from 'next/dynamic';

const Output = dynamic(
  async () => (await import('editorjs-react-renderer')).default,
  { ssr: false }
);

export default function OfficeDetail() {
  const [office, setOffice] = useState({});
  const router = useRouter();

  useEffect(async () => {
    const { data, error } = await useGetApi('office/' + router.query.id);

    setOffice(data);
  }, []);

  return (
    <div className='mx-auto w-3/4'>
      <div className='mb-4 flex flex-row justify-start'>
        <Typography variant='h4' fontWeight={'bold'}>
          {office.name}
        </Typography>
      </div>

      <div className='mb-4 flex flex-row justify-start'>
        <Typography variant='caption'>
          Last Updated:{' '}
          {office.updatedAt && new Date(office.updatedAt).toLocaleString()}
        </Typography>
      </div>

      <div className='mx-auto'>
        {/* {office.description && (
          <Blocks
            data={JSON.parse(office.description)}
            config={{
              image: {
                className: 'full-w',
                actionsClassNames: {
                  stretched: 'image-block--stretched',
                  withBorder: 'image-block--with-border',
                  withBackground: 'image-block--with-background',
                },
              },
              code: {
                className: 'language-js',
              },
              delimiter: {
                className: 'border border-2 w-16 mx-auto',
              },
              embed: {
                className: 'border-0',
              },
              header: {
                className: 'font-bold',
              },
              list: {
                className: 'list-inside',
              },
              paragraph: {
                className: 'text-base text-opacity-75',
                actionsClassNames: {
                  alignment: 'text-{alignment}', // This is a substitution placeholder: left or center.
                },
              },
              quote: {
                className: 'py-3 px-5 italic font-serif',
              },
              table: {
                className: 'table-auto',
              },
            }}
          />
        )} */}

        {office.description && (
          <Output data={JSON.parse(office.description)}></Output>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps = AdminRoute();
