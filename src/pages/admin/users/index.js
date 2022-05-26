// ** React Imports
import { useState } from 'react';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

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

export default function UserList({ rows, columns, pagination }) {
  // ** State
  const [value, setValue] = useState('account');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div className='mb-3 flex flex-row justify-end'>
        <Button variant='contained' startIcon={<AddIcon />}>
          Create
        </Button>
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
                  <StyledTableCell align='left'>{row.role}</StyledTableCell>
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
        <Pagination
          count={10}
          color='primary'
          className='flex flex-row justify-center'
        />
      </div>
    </>
  );
}

export const getServerSideProps = AdminRoute(async ({ req }) => {
  const { accessToken } = ssrGetToken(req);

  const { data, error } = await useGetApi('user', {}, accessToken);

  return {
    props: { rows: data.data, pagination: data.pagination },
  };
});
