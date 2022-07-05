import { CrudTable } from 'src/components/crud/table';
import { OfficePerm } from 'src/perms/office';
import { AdminRoute } from 'src/middleware/admin-route';
import { useRef, useState } from 'react';
import {
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { useGetApi } from 'src/utils/api';
import StudentQuestDetail from './[id]/detail';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';
import { useRouter } from 'next/router';

const StudentQuestStatus = {
  1: 'PENDING',
  2: 'REJECTED',
  3: 'APPROVED',
};

const cols = [
  { field: 'office.name', display: 'Office Name' },
  { field: 'quest.quest', display: 'Quest' },
  { field: 'user.firstName', display: 'Student Name' },
  {
    field: 'status',
    display: 'Status',
    getCell: (row) => {
      let color = 'success';
      if (row.status === 'pending') {
        color = 'warning';
      } else if (row.status === 'rejected') {
        color = 'error';
      }

      return <Chip color={color} label={row.status.toUpperCase()}></Chip>;
    },
  },
  { field: 'updatedAt', display: 'Submitted At' },
];

export default function ApprovalIndex() {
  const [open, setOpen] = useState(false);
  const [studentQuest, setStudentQuest] = useState(null);
  // const [setReload, setSetReload] = useState();
  const setReload = { callback: null };

  const handleClose = () => {
    setStudentQuest(null);
    setOpen(false);
  };

  const handleCloseAndRemoveRow = (row) => {
    handleClose();

    setReload.callback(true);
  };

  return (
    <div>
      <CrudTable
        setReloadRef={setReload}
        indexEndpoint='student-quest'
        getSearchQuery={(search) => 'firstName=' + search}
        cols={cols}
        formatData={(data) => {
          return {
            data: data.data.map((each) => ({
              ...each,
              updatedAt: each.updatedAt && moment(each.updatedAt).calendar(),
            })),
            pagination: data.pagination,
          };
        }}
        shouldDisplay={(row, action) => {
          if (action === 'show') {
            return row.status === 'pending';
          }

          return OfficePerm.isSuperAdmin();
        }}
        // onEditClick={(studentQuest) => {
        //   router.push(router.asPath + '/' + studentQuest._id);
        // }}
        onShowClick={async (studentQuest) => {
          // router.push(router.asPath + '/' + studentQuest._id + '/detail');
          setOpen(true);
          const { data, error } = await useGetApi(
            'student-quest/' + studentQuest._id
          );

          setStudentQuest(data);
        }}
        // onDeleteClick={async (studentQuest) => {
        //   const { data, error } = await useDeleteApi(
        //     'studentQuest/' + studentQuest._id
        //   );
        // }}
        getNameIdentifier={(studentQuest) =>
          `${studentQuest.user?.firstName}'s quest`
        }
        searchLabel='Search'
      ></CrudTable>
      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth='md'>
        <DialogTitle>
          Quest detail
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className='ml-4 mb-4'>
          {/* <DialogContentText id='alert-dialog-description'>
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText> */}
          {!studentQuest ? (
            <CircularProgress />
          ) : (
            <StudentQuestDetail
              studentQuest={studentQuest}
              handleCloseDialog={handleCloseAndRemoveRow}
            ></StudentQuestDetail>
          )}
        </DialogContent>
        {/* <DialogActions>
              <Button onClick={handleClose}>Disagree</Button>
              <Button onClick={handleClose} autoFocus>
                Agree
              </Button>
            </DialogActions> */}
      </Dialog>
    </div>
  );
}

export const getServerSideProps = AdminRoute();
