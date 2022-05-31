import { AdminRoute } from 'src/middleware/admin-route';
import { useRouter } from 'next/router';
import { CrudTableNoPagination } from 'src/components/crud/table-no-pagination';
import { useDeleteApi } from 'src/utils/api';
import { Typography } from '@mui/material';

const cols = [{ field: 'quest', display: 'Quest' }];

export default function QuestList() {
  const router = useRouter();
  const officeId = router.query.id;

  return (
    <>
      <Typography variant='h5'>Quests of {officeId}</Typography>
      <CrudTableNoPagination
        indexEndpoint={`quest/office/${officeId}`}
        cols={cols}
        onCreateClick={() => {
          router.push(router.asPath + '/create');
        }}
        onEditClick={(quest) => {
          router.push(router.asPath + '/' + quest._id);
        }}
        onShowClick={(quest) => {
          router.push(router.asPath + `/${quest._id}/detail`);
        }}
        onDeleteClick={async (quest) => {
          const { data, error } = await useDeleteApi('quest/' + quest._id);
        }}
        getNameIdentifier={(quest) => quest.name}
      ></CrudTableNoPagination>
    </>
  );
}

export const getServerSideProps = AdminRoute();
