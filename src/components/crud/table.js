import { useEffect, useState } from 'react';
import { useGetApi } from 'src/utils/api';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  TableCell,
  tableCellClasses,
  Pagination,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import { CustomSearchField } from 'src/@core/components/forms/custom-search-field';
import { CrudActions } from 'src/@core/components/tables/crud-actions';
import { AlertCommon } from 'src/@core/components/alerts/common';
import { getArrByField } from 'src/utils/arr';

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

/**
 * cols format: [
 *  {
 *      field,
 *      display,
 *      format, (props...)
 *  }
 * ]
 */
export const CrudTable = ({
  indexEndpoint,
  getSearchQuery,
  cols,
  onCreateClick,
  onEditClick,
  onShowClick,
  onDeleteClick,
  getNameIdentifier,
  shouldDisplay,
  getCustomActions = null,
  formatData = null,
  searchLabel = 'Search',
}) => {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const [search, setSearch] = useState('');
  const [reload, setReload] = useState(false);
  const [alert, setAlert] = useState(null);
  const [dialog, setDialog] = useState({ open: false });

  const handleClose = () => {
    setDialog({ ...dialog, open: false });
  };

  const openDialog = ({
    title = 'Are you sure want to delete?',
    content = 'This action cannot be undone!',
    onYes,
  }) => {
    setDialog({ title, content, onYes, open: true });
  };

  useEffect(() => {
    onPageChange(null, pagination.currentPage ?? 1);

    if (reload) {
      reload = false;
    }
  }, [search, reload]);

  const onPageChange = async (_, page = 1) => {
    const { data, error } = await useGetApi(indexEndpoint, {
      page: page,
      filter: getSearchQuery(search),
    });

    if (formatData) {
      data = formatData(data);
    }

    if (error) {
      setAlert({
        type: 'error',
        message: data.message,
      });
      return;
    }

    setRows(data.data);
    setPagination(data.pagination);
  };

  return (
    <>
      <Dialog
        open={dialog.open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle>{dialog?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialog?.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            No
          </Button>
          <Button
            onClick={async () => {
              await dialog?.onYes();

              handleClose();
            }}
            color='error'
            variant='contained'
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {alert !== '' && (
        <div className='mb-3 flex flex-row justify-end'>
          <AlertCommon
            msg={alert?.message}
            error={alert?.type === 'error'}
            onClose={() => {
              setAlert(null);
            }}
          ></AlertCommon>
        </div>
      )}

      {onCreateClick && shouldDisplay(null, 'create') && (
        <div className='mb-3 flex flex-row justify-end'>
          <Button
            size='small'
            variant='contained'
            startIcon={<AddIcon />}
            onClick={onCreateClick}
          >
            Create
          </Button>
        </div>
      )}

      <div className='my-6 flex flex-col'>
        <CustomSearchField
          label={searchLabel}
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
                {cols.map((col) => {
                  return (
                    <StyledTableCell align='left'>
                      {col.display}
                    </StyledTableCell>
                  );
                })}
                <StyledTableCell align='right'>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, ind) => (
                <StyledTableRow hover key={row._id}>
                  <StyledTableCell component='th' scope='row'>
                    {ind + 1}
                  </StyledTableCell>
                  {cols.map((col) => {
                    return (
                      <StyledTableCell align='left' {...col.format}>
                        {col.getCell
                          ? col.getCell(row)
                          : getArrByField(row, col.field)}
                      </StyledTableCell>
                    );
                  })}
                  <StyledTableCell align='right'>
                    {getCustomActions && getCustomActions(row, openDialog)}
                    <CrudActions
                      nameIdentifier={getNameIdentifier(row)}
                      onShowClick={
                        onShowClick && shouldDisplay(null, 'show')
                          ? () => onShowClick(row)
                          : null
                      }
                      onEditClick={
                        onEditClick && shouldDisplay(null, 'edit')
                          ? () => onEditClick(row)
                          : null
                      }
                      onDeleteClick={
                        onDeleteClick && shouldDisplay(null, 'delete')
                          ? async () => {
                              await onDeleteClick(row);

                              setReload(true);
                            }
                          : null
                      }
                    ></CrudActions>
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
};
