// ** MUI Imports
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import InputAdornment from '@mui/material/InputAdornment';

// ** Icons Imports
import Menu from 'mdi-material-ui/Menu';
import Magnify from 'mdi-material-ui/Magnify';

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler';
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown';
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown';
import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { LogoComponent } from 'src/components/logo';

const AppBarContent = (props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props;
  const router = useRouter();

  // ** Hook
  const hiddenSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Box
      className='px-4 pt-2 pb-4'
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box
        className='actions-left'
        sx={{ mr: 2, display: 'flex', alignItems: 'center' }}
      >
        <LogoComponent></LogoComponent>
        {/* <Typography>{router.route}</Typography> */}
        {/* <Typography
          variant='h7'
          className='hover:cursor-pointer'
          onClick={() => router.back()}
        >
          <KeyboardArrowLeftIcon /> Back
        </Typography> */}
        {/* <TextField
          size='small'
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Magnify fontSize='small' />
              </InputAdornment>
            ),
          }}
        /> */}
      </Box>
      <Box
        className='actions-right'
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        <NotificationDropdown />
        <UserDropdown />
      </Box>
    </Box>
  );
};

export default AppBarContent;
