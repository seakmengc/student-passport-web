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
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { AdminRoute } from 'src/middleware/admin-route';
import { useRouter } from 'next/router';

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

export default function OfficeList({ rows, pagination }) {
  const router = useRouter();

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
                    <Tooltip title='Detail'>
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

export const getServerSideProps = AdminRoute(async (ctx) => {
  const { accessToken } = await ssrGetToken(ctx);

  const { data, error } = await useGetApi('office', {}, accessToken);

  console.log(data);

  return {
    props: { rows: data.data ?? [], pagination: data.pagination ?? {} },
  };
});
