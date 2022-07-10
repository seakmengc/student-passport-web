// ** MUI Imports
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

// ** Icons Imports

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler';
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown';
import { useRouter } from 'next/router';
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
      </Box>
      <Box
        className='actions-right'
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        {/* <ModeToggler settings={settings} saveSettings={saveSettings} /> */}
        {/* <NotificationDropdown /> */}
        <UserDropdown />
      </Box>
    </Box>
  );
};

export default AppBarContent;
