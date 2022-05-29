// ** React Imports
import { useEffect, useRef, useState } from 'react';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// ** Icons Imports

// ** Demo Tabs Imports
import { useDeleteApi, useGetApi } from 'src/utils/api';

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css';
import { ssrGetToken } from 'src/utils/ssr';
import {
  Paper,
  Table,
  TableContainer,
  TableCell,
  tableCellClasses,
  Pagination,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Card,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { AdminRoute } from 'src/middleware/admin-route';
import { useRouter } from 'next/router';
import { CustomSearchField } from 'src/@core/components/forms/custom-search-field';
import { ConfirmationDialog } from 'src/@core/components/alerts/confirmation-dialog';
import { Popover } from '@nextui-org/react';
import { CrudActions } from 'src/@core/components/tables/crud-actions';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function OfficeList() {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const [search, setSearch] = useState('');
  const [reload, setReload] = useState(false);

  useEffect(() => {
    onPageChange(null, pagination.currentPage ?? 1);
    reload = false;
  }, [search, reload]);

  const onPageChange = async (_, page = 1) => {
    const { data, error } = await useGetApi('office', {
      page: page,
      filter: search === '' ? '' : 'name=' + search,
    });

    setRows(data.data);
    setPagination(data.pagination);
  };

  return (
    <>
      <div className='mb-3 flex flex-row justify-end'>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => {
            router.push('/admin/offices/create');
          }}
        >
          Create
        </Button>
      </div>

      <div className='my-6 flex flex-col'>
        <CustomSearchField
          label='Search by Office Name'
          onChange={(val) => {
            setSearch(val);
          }}
        ></CustomSearchField>
      </div>

      <div>
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                <StyledTableCell>No</StyledTableCell>
                <StyledTableCell align='left'>Name</StyledTableCell>
                <StyledTableCell align='left'>Admins Count</StyledTableCell>
                <StyledTableCell align='right'>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, ind) => (
                <StyledTableRow hover key={row._id}>
                  <StyledTableCell component='th' scope='row'>
                    {ind + 1}
                  </StyledTableCell>
                  <StyledTableCell align='left'>{row.name}</StyledTableCell>
                  <StyledTableCell align='left'>
                    {row.admins.length}
                  </StyledTableCell>
                  <StyledTableCell align='right'>
                    <CrudActions
                      nameIdentifier={row.name}
                      onShowClick={() => {
                        router.push('/admin/offices/' + row._id + '/detail');
                      }}
                      onEditClick={() => {
                        router.push('/admin/offices/' + row._id);
                      }}
                      onDeleteClick={async () => {
                        const { data, error } = await useDeleteApi(
                          'office/' + row._id
                        );

                        setReload(true);
                      }}
                    ></CrudActions>

                    {/* <Tooltip title='Detail'>
                      <IconButton
                        onClick={() => {
                          console.log(row);
                        }}
                      >
                        <VisibilityIcon></VisibilityIcon>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Edit'>
                      <IconButton
                        onClick={() => {
                          router.push('/admin/offices/' + row._id);
                        }}
                      >
                        <EditIcon></EditIcon>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Delete'>
                      <IconButton
                        onClick={async () => {
                          // const { data, error } = await useDeleteApi(
                          //   'office/' + row._id
                          // );
                          console.log(dialogRef.current);
                        }}
                      >
                        <DeleteIcon color='error'></DeleteIcon>
                      </IconButton>
                    </Tooltip>

                    <ConfirmationDialog state={true}></ConfirmationDialog>

                    <Popover>
                      <Popover.Trigger>
                        <IconButton
                          onClick={async () => {
                            // const { data, error } = await useDeleteApi(
                            //   'office/' + row._id
                            // );
                          }}
                        >
                          <DeleteIcon color='error'></DeleteIcon>
                        </IconButton>
                      </Popover.Trigger>
                      <Popover.Content>
                        <div className='p-3'>
                          <Typography variant='body'>
                            Are you sure want to delete{' '}
                            <i>
                              <b>{row.name}</b>
                            </i>
                            ?
                          </Typography>

                          <div className='my-3 flex flex-row justify-between'>
                            <Button className='w-full'>No</Button>
                            <Button
                              className='w-full'
                              variant='contained'
                              color='error'
                            >
                              Yes
                            </Button>
                          </div>

                          <Typography variant='caption'>
                            * This action cannot be undone!
                          </Typography>
                        </div>
                      </Popover.Content>
                    </Popover> */}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <br></br>
        {pagination && (
          <Pagination
            count={pagination.totalPages}
            page={+pagination.currentPage}
            onChange={onPageChange}
            variant='outlined'
            color='primary'
            className='flex flex-row justify-center'
            showFirstButton
            showLastButton
          />
        )}
      </div>
    </>
  );
}

export const getServerSideProps = AdminRoute();
