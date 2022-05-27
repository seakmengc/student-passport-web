// ** React Imports
import { useEffect, useState } from 'react';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// ** Icons Imports

// ** Demo Tabs Imports
import { useGetApi } from 'src/utils/api';
import { AdminRoute } from 'src/middleware/admin-route';

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
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import router from 'next/router';
import { CustomTextField } from 'src/@core/components/forms/custom-text-field';
import { CustomSearchField } from 'src/@core/components/forms/custom-search-field';

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

export default function UserList() {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const [search, setSearch] = useState('');

  useEffect(() => {
    onPageChange(null, 1);
  }, [search]);

  const onPageChange = async (_, page = 1) => {
    const { data, error } = await useGetApi('user', {
      page: page,
      filter: search === '' ? '' : 'firstName=' + search,
    });

    setRows(data.data);
    setPagination(data.pagination);
  };

  return (
    <>
      <div className='mb-3 flex flex-row justify-end'>
        <Button
          size='medium'
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => {
            router.push('/admin/users/register');
          }}
        >
          Create
        </Button>
      </div>

      <div className='my-6 flex flex-col'>
        <CustomSearchField
          label='Search by First Name'
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
                <StyledTableCell align='left'>First Name</StyledTableCell>
                <StyledTableCell align='left'>Last Name</StyledTableCell>
                <StyledTableCell align='left'>Email</StyledTableCell>
                <StyledTableCell align='left'>Role</StyledTableCell>
                <StyledTableCell align='right'>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, ind) => (
                <StyledTableRow hover key={row._id}>
                  <StyledTableCell component='th' scope='row'>
                    {ind + 1}
                  </StyledTableCell>
                  <StyledTableCell align='left'>
                    {row.firstName}
                  </StyledTableCell>
                  <StyledTableCell align='left'>{row.lastName}</StyledTableCell>
                  <StyledTableCell align='left'>{row.email}</StyledTableCell>
                  <StyledTableCell align='left'>
                    <Chip
                      label={row.role}
                      color={row.role?.endsWith('Admin') ? 'primary' : 'info'}
                      variant='filled'
                    />
                  </StyledTableCell>
                  <StyledTableCell align='right'>
                    <Tooltip title='Detail'>
                      <IconButton>
                        <VisibilityIcon></VisibilityIcon>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Edit'>
                      <IconButton>
                        <EditIcon></EditIcon>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Delete'>
                      <IconButton>
                        <DeleteIcon color='error'></DeleteIcon>
                      </IconButton>
                    </Tooltip>
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
