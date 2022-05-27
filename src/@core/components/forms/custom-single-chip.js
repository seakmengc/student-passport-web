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
import React, { useEffect, useState } from 'react';

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

function getStyles(each, selected, theme) {
  return {
    fontWeight:
      each.data != selected
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export const CustomSingleChip = ({
  idData,
  register,
  label,
  defaultSelected = null,
  error = '',
}) => {
  const theme = useTheme();
  const hasError = error !== '';
  const [selected, setSelected] = useState(defaultSelected);

  useEffect(() => {
    register.onChange(selected);
  }, [selected]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelected(value);
  };

  return (
    <FormControl sx={{ mb: 6, width: '100%', mt: 3 }}>
      <label
        className={`block uppercase ${
          hasError ? 'text-error-500' : 'text-primary-600'
        } mb-2 text-xs font-bold`}
      >
        {label}
      </label>
      <Select
        className='w-full border-none bg-white shadow-sm ring-0'
        displayEmpty
        value={selected}
        onChange={handleChange}
        input={<OutlinedInput />}
        MenuProps={MenuProps}
        inputProps={{ 'aria-label': 'Without label' }}
      >
        {idData.map((each) => (
          <MenuItem
            key={each.id}
            value={each.id}
            style={getStyles(each, selected, theme)}
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
