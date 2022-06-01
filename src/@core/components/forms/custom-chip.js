import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  ListItem,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import { useTheme } from '@mui/system';
import React, { useState } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export const CustomChip = ({
  idData,
  register,
  label,
  getAvatar,
  defaultSelected = [],
  error = '',
}) => {
  const theme = useTheme();
  const hasError = error !== '';
  const [selected, setSelected] = useState(defaultSelected);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    register.onChange(value);
    setSelected(value);
  };

  return (
    <FormControl sx={{ my: 3, width: '100%' }}>
      <label
        className={`block uppercase ${
          hasError ? 'text-error-500' : 'text-primary-600'
        } mb-2 text-xs font-bold`}
      >
        {label}
      </label>
      {/* <input
      type={type}
      className={`${
        !hasError ? 'border-0' : 'border-2 border-error-500'
      } text-primary-600 placeholder-primary-300 w-full rounded bg-white px-3 py-3 text-sm shadow ring-primary transition-all duration-150 ease-linear  focus:outline-none focus:ring`}
      placeholder={label}
      {...register}
    /> */}
      <Select
        className='w-full border-none bg-white shadow-sm ring-0'
        multiple
        displayEmpty
        value={selected}
        onChange={handleChange}
        input={<OutlinedInput notched={true} />}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <em>Select Admins</em>;
          }

          return (
            <ListItem
              sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, p: 0 }}
            >
              {selected.map((value) => (
                <Chip
                  key={value}
                  avatar={getAvatar ? getAvatar(value) : null}
                  label={idData.find((each) => each.id === value).data}
                  variant='filled'
                  className='text-black'
                  color='secondary'
                  onDelete={() => {
                    console.log('On Delete');
                  }}
                />
              ))}
            </ListItem>
          );
        }}
        MenuProps={MenuProps}
        inputProps={{ 'aria-label': 'Without label' }}
      >
        {idData.map((each) => (
          <MenuItem
            key={each.id}
            value={each.id}
            style={getStyles(each.data, selected, theme)}
          >
            {each.data}
          </MenuItem>
        ))}
      </Select>
      {hasError && (
        <label className='text-xs text-error-500'>
          {error[0].toUpperCase() + error.slice(1)}
        </label>
      )}
    </FormControl>
  );
};
