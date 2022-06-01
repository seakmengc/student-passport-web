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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import { CustomSearchField } from 'src/@core/components/forms/custom-search-field';
import { CrudActions } from 'src/@core/components/tables/crud-actions';
import { AlertCommon } from 'src/@core/components/alerts/common';

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
 *      getCell, (rtn component)
 *  }
 * ]
 */
export const CrudTableNoPagination = ({
  indexEndpoint,
  cols,
  onCreateClick,
  onEditClick,
  onShowClick,
  onDeleteClick,
  getNameIdentifier,
  getCustomActions = null,
  formatData = null,
  searchLabel = 'Search',
}) => {
  const [rows, setRows] = useState([]);

  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    onPageChange();

    if (reload) {
      reload = false;
    }
  }, [reload]);

  const onPageChange = async () => {
    const { data, error } = await useGetApi(indexEndpoint);

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

    setRows(data);
  };

  return (
    <>
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

      <div className='mb-3 flex flex-row justify-end'>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => {
            onCreateClick();
          }}
        >
          Create
        </Button>
      </div>

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
                        {col.getCell ? col.getCell(row) : row[col.field]}
                      </StyledTableCell>
                    );
                  })}
                  <StyledTableCell align='right'>
                    {getCustomActions && getCustomActions(row)}
                    <CrudActions
                      nameIdentifier={getNameIdentifier(row)}
                      onShowClick={onShowClick ? () => onShowClick(row) : null}
                      onEditClick={onEditClick ? () => onEditClick(row) : null}
                      onDeleteClick={
                        onDeleteClick
                          ? async () => {
                              await onDeleteClick(row);

                              setRows(
                                rows.filter((each) => each._id !== row._id)
                              );
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
      </div>
    </>
  );
};
