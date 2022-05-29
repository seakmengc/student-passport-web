// import 'react-datepicker/dist/react-datepicker.css';
import { AdminRoute } from 'src/middleware/admin-route';
import { CrudTable } from 'src/components/crud/table';

const cols = [{ field: 'name', display: 'Name' }];

export default function OfficeList() {
  return (
    <>
      <CrudTable
        indexEndpoint='office'
        getSearchQuery={(search) => 'name=' + search}
        cols={cols}
        onCreateClick={(router) => {
          router.push('/admin/offices/create');
        }}
        onEditClick={(router, office) => {
          router.push('/admin/offices/' + office._id);
        }}
        onShowClick={(router, office) => {
          router.push('/admin/offices/' + office._id + '/detail');
        }}
        onDeleteClick={async (router, office) => {
          const { data, error } = await useDeleteApi('office/' + office._id);
        }}
        getNameIdentifier={(office) => office.name}
        searchLabel='Search by Office Name'
      ></CrudTable>
    </>
  );
}

export const getServerSideProps = AdminRoute();
