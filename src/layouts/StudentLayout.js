import useMediaQuery from '@mui/material/useMediaQuery';
import VerticalAppBarContent from './components/student/AppBarContent';
import { useSettings } from 'src/@core/hooks/useSettings';
import { Box, Typography } from '@mui/material';
import { DivingScuba } from 'mdi-material-ui';

export const StudentLayout = ({ children }) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings();

  /**
   *  The below variable will hide the current layout menu at given screen size.
   *  The menu will be accessible from the Hamburger icon only (Vertical Overlay Menu).
   *  You can change the screen size from which you want to hide the current layout menu.
   *  Please refer useMediaQuery() hook: https://mui.com/components/use-media-query/,
   *  to know more about what values can be passed to this hook.
   *  ! Do not change this value unless you know what you are doing. It can break the template.
   */
  const hidden = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <Box>
      <VerticalAppBarContent
        hidden={hidden}
        settings={settings}
        saveSettings={saveSettings}
      />
      <Box className='px-4 lg:px-36'>
        <Typography variant='h4'>Welcome to Student Passport!</Typography>

        <div className='pt-4'>{children}</div>
      </Box>
    </Box>

    // <VerticalLayout
    //   hidden={hidden}
    //   settings={settings}
    //   saveSettings={saveSettings}
    //   verticalNavItems={VerticalNavItems()} // Navigation Items
    //   verticalAppBarContent={(
    //     props // AppBar Content
    //   ) => (
    //     <VerticalAppBarContent
    //       hidden={hidden}
    //       settings={settings}
    //       saveSettings={saveSettings}
    //       toggleNavVisibility={props.toggleNavVisibility}
    //     />
    //   )}
    // >
    //   {children}
    // </VerticalLayout>
  );
};
