import {
  Box,
  Chip,
  FormControl,
  InputLabel,
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

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

export const CustomChip = ({
  idData,
  register,
  label,
  defaultSelected = [],
  error = '',
}) => {
  const theme = useTheme();
  const hasError = error !== '';
  const [selected, setSelected] = useState(defaultSelected);

  console.log({ idData });

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log('value', value);
    register.onChange(value);
    setSelected(value);
  };

  return (
    <FormControl
      sx={{ m: 1, width: '100%', mt: 3 }}
      className='relative mb-3 w-full'
    >
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
        input={<OutlinedInput />}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <em>Select Admins</em>;
          }

          return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={idData.find((each) => each.id === value).data}
                />
              ))}
            </Box>
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
