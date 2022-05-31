import styled from '@emotion/styled';
import {
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
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

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 16,
  height: 16,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 1px rgb(16 22 26 / 40%)'
      : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
  backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#f5f8fa',
  backgroundImage:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
      : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#ebf1f5',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background:
      theme.palette.mode === 'dark'
        ? 'rgba(57,75,89,.5)'
        : 'rgba(206,217,224,.5)',
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#9155FD',
  backgroundImage:
    'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&:before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#9155FD',
  },
});

// Inspired by blueprintjs
function BpRadio(props) {
  return (
    <Radio
      sx={{
        '&:hover': {
          bgcolor: 'transparent',
        },
      }}
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  );
}

export const CustomSingleChip = ({
  idData,
  register,
  label,
  defaultSelected = null,
  error = '',
}) => {
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
      {/* <Select
        className='w-full border-none bg-white shadow-sm ring-0'
        displayEmpty
        value={selected}
        onChange={handleChange}
        input={<OutlinedInput />}
        MenuProps={MenuProps}
        inputProps={{ 'aria-label': 'Without label' }}
        renderValue={(selected) => {
          if (selected === null) {
            return <em>Select</em>;
          }

          return <p className='text-label-900'>{selected}</p>;
        }}
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
      </Select> */}
      <RadioGroup value={selected} onChange={handleChange}>
        {idData.map((each) => (
          <FormControlLabel
            key={each.id}
            value={each.id}
            control={<BpRadio />}
            label={each.id}
          />
        ))}
      </RadioGroup>
      {hasError && (
        <label className='text-xs text-error-500'>
          {error[0].toUpperCase() + error.slice(1)}
        </label>
      )}
    </FormControl>
  );
};
