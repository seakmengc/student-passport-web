import router, { useRouter } from 'next/router';
import { CrudTable } from 'src/components/crud/table';
import { OfficePerm } from 'src/perms/office';
import { AdminRoute } from 'src/middleware/admin-route';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useGetApi } from 'src/utils/api';

const renderTelescope = (telescope) => {
  for (const key in telescope) {
  }
};

export default function TelescopeDetail() {
  const router = useRouter();
  const [telescope, setTelescope] = useState();

  useEffect(async () => {
    const { data, error } = await useGetApi('telescope/' + router.query.id);

    setTelescope(data);
  }, []);

  if (!telescope) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {Object.keys(telescope).map((key) => {
        return (
          <p>
            {key}: {telescope[key]}
          </p>
        );
      })}
    </>
  );
}

export const getServerSideProps = AdminRoute();
