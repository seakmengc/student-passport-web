// ** React Imports
import { useState } from 'react';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// ** Icons Imports

// ** Demo Tabs Imports
import { useGetApi } from 'src/utils/api';

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
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

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

export default function AccountSettings({ rows, columns, pagination }) {
  // ** State
  const [value, setValue] = useState('account');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    // <div style={{ height: '80vh', width: '100%' }}>
    //   <DataGrid
    //     getRowId={(row) => row._id}
    //     rows={rows}
    //     columns={columns}
    //     pageSize={pagination.total}
    //     rowsPerPageOptions={[10]}
    //     page={pagination.currentPage}
    //     paginationMode='server'

    //     autoHeight={true}
    //   />
    // </div>

    <>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow className='bg-primary-600'>
              <StyledTableCell>No</StyledTableCell>
              <StyledTableCell align='left'>First Name</StyledTableCell>
              <StyledTableCell align='left'>Last Name</StyledTableCell>
              <StyledTableCell align='right'>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, ind) => (
              <StyledTableRow hover key={row._id}>
                <StyledTableCell component='th' scope='row'>
                  {ind + 1}
                </StyledTableCell>
                <StyledTableCell align='left'>{row.firstName}</StyledTableCell>
                <StyledTableCell align='left'>{row.lastName}</StyledTableCell>
                <StyledTableCell align='right'>
                  <IconButton>
                    <VisibilityIcon></VisibilityIcon>
                  </IconButton>
                  <IconButton>
                    <EditIcon></EditIcon>
                  </IconButton>
                  <IconButton>
                    <DeleteIcon color='error'></DeleteIcon>
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br></br>
      <Pagination
        count={10}
        color='primary'
        className='flex flex-row justify-center'
      />
    </>
  );
}

export async function getServerSideProps({ req }) {
  const { accessToken } = ssrGetToken(req);

  const { data, error } = await useGetApi('user', {}, accessToken);

  if (error) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  const columns = [
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
  ];

  console.log(data.data[0]);

  return {
    props: { rows: data.data, columns, pagination: data.pagination },
  };
}
