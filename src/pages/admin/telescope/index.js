import router from 'next/router';
import { CrudTable } from 'src/components/crud/table';
import { OfficePerm } from 'src/perms/office';
import { AdminRoute } from 'src/middleware/admin-route';
import moment from 'moment';

const cols = [
  { field: 'method', display: 'method' },
  { field: 'path', display: 'path' },
  { field: 'statusCode', display: 'status Code' },
  { field: 'userId', display: 'user' },
  { field: 'duration', display: 'duration' },
  { field: 'time', display: 'time' },
];

export default function TelescopeIndex() {
  return (
    <CrudTable
      indexEndpoint='telescope'
      formatData={(data) => {
        data.data = data.data.map((each) => ({
          ...each,
          time: moment(each.time).fromNow(),
          duration: each.duration + ' ms',
        }));

        return data;
      }}
      getSearchQuery={(search) => 'firstName=' + search}
      cols={cols}
      shouldDisplay={(_, action) => {
        return true;
      }}
      onShowClick={(telescope) => {
        router.push(router.asPath + '/' + telescope._id);
      }}
      getNameIdentifier={(telescope) => `${telescope.path}`}
    ></CrudTable>
  );
}

export const getServerSideProps = AdminRoute();
