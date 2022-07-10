import { AdminRoute } from 'src/middleware/admin-route';
import router from 'next/router';
import { CrudTable } from 'src/components/crud/table';
import { OfficePerm } from 'src/perms/office';
import { Avatar, Checkbox, Chip, IconButton, Tooltip } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import CachedIcon from '@mui/icons-material/Cached';
import { useRef, useState } from 'react';
import { useDeleteApi, usePutApi } from 'src/utils/api';
import { useSnackbar } from 'notistack';
import { getProfileUrl, getUploadUrl } from 'src/utils/user';
import { SuperAdminRoute } from 'src/middleware/super-admin-route';

const cols = [
  {
    field: 'profile',
    display: 'Profile',
    getCell: (row) => {
      return <Avatar src={getProfileUrl(row)}></Avatar>;
    },
  },
  { field: 'name', display: 'Name' },
  { field: 'email', display: 'Email' },
  { field: 'role', display: 'Role' },
  {
    field: 'isActive',
    display: 'Active',
    getCell: (row) => {
      console.log(row);

      return (
        <Chip
          color={row.isActive ? 'success' : 'error'}
          label={row.isActive ? 'Active' : 'Blocked'}
        ></Chip>
      );
    },
  },
];

export default function UserList() {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <>
      <CrudTable
        indexEndpoint='user'
        getSearchQuery={(search) => 'firstName=' + search}
        cols={cols}
        shouldDisplay={(_, action) => {
          if (action === 'show') {
            return true;
          }

          return OfficePerm.isSuperAdmin();
        }}
        getCustomActions={(row, openDialog) => {
          if (!OfficePerm.isSuperAdmin() || row.role === 'Super Admin') {
            return;
          }

          return (
            <Tooltip title={row.isActive ? 'Block' : 'Unblock'}>
              <IconButton
                onClick={() => {
                  openDialog({
                    title: `Are you sure want to ${
                      row.isActive ? 'block' : 'unblock'
                    } ${row.name}?`,
                    content: row.isActive
                      ? 'He/she will be logged out from all sessions!'
                      : '',
                    onYes: async () => {
                      const res = await usePutApi(
                        'user/' +
                          row._id +
                          '/' +
                          (row.isActive ? 'block' : 'unblock')
                      );
                      if (res.error) {
                        enqueueSnackbar(res.data.message, { variant: 'error' });
                        return;
                      }

                      row.isActive = !row.isActive;
                      enqueueSnackbar(
                        `User ${row.isActive ? 'unblocked' : 'blocked'}!`,
                        { variant: row.isActive ? 'success' : 'warning' }
                      );
                    },
                  });
                }}
              >
                {row.isActive ? (
                  <BlockIcon color='error'></BlockIcon>
                ) : (
                  <CachedIcon color='success'></CachedIcon>
                )}
              </IconButton>
            </Tooltip>
          );
        }}
        // onCreateClick={() => {
        //   router.push(router.asPath + '/register');
        // }}
        // onEditClick={(user) => {
        //   router.push(router.asPath + '/' + user._id);
        // }}
        // onShowClick={(user) => {
        //   router.push(router.asPath + '/' + user._id + '/detail');
        // }}
        // onDeleteClick={async (user) => {
        //   const { data, error } = await useDeleteApi('user/' + user._id);
        // }}
        getNameIdentifier={(user) => user.email}
        searchLabel='Search by First Name'
      ></CrudTable>
    </>
  );
}

export const getServerSideProps = SuperAdminRoute();
