// ** React Imports
import { useState, Fragment } from 'react';

// ** Next Import
import { useRouter } from 'next/router';

// ** MUI Imports
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

// ** Icons Imports
import CogOutline from 'mdi-material-ui/CogOutline';
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd';
import EmailOutline from 'mdi-material-ui/EmailOutline';
import LogoutVariant from 'mdi-material-ui/LogoutVariant';
import AccountOutline from 'mdi-material-ui/AccountOutline';
import MessageOutline from 'mdi-material-ui/MessageOutline';
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { setLogout, tokenState } from 'src/states/token';
import { useDeleteApi } from 'src/utils/api';
import { useRecoilValue } from 'recoil';
import { authState } from 'src/states/auth';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
}));

const UserDropdown = () => {
  // ** States
  const [anchorEl, setAnchorEl] = useState(null);
  const resetTokenState = useResetRecoilState(tokenState);
  const authStore = useRecoilValue(authState);

  // ** Hooks
  const router = useRouter();

  const handleDropdownOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = (url) => {
    if (url) {
      router.push(url);
    }
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await useDeleteApi('auth/logout');

    setLogout();
    router.replace('/auth/login');
  };

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary',
    },
  };

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar
          alt={authStore?.firstName}
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src={authStore?.profileUrl}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center' }}
            className='hover:cursor-pointer'
            onClick={() => {
              router.push('/profile/my');
              handleDropdownClose();
            }}
          >
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar
                alt={authStore?.firstName}
                src={authStore?.profileUrl}
                sx={{ width: '2.5rem', height: '2.5rem' }}
              />
            </Badge>
            <Box
              sx={{
                display: 'flex',
                marginLeft: 3,
                alignItems: 'flex-start',
                flexDirection: 'column',
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>
                {authStore?.firstName}
              </Typography>
              <Typography
                variant='body2'
                sx={{ fontSize: '0.8rem', color: 'text.disabled' }}
              >
                {authStore?.role}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />
        <MenuItem
          sx={{ p: 0 }}
          onClick={() => {
            router.push('/profile/my');
            handleDropdownClose();
          }}
        >
          <Box sx={styles}>
            <AccountOutline sx={{ marginRight: 2 }} />
            Profile
          </Box>
        </MenuItem>
        <MenuItem
          sx={{ p: 0 }}
          onClick={() => {
            router.push('/leaderboard');
            handleDropdownClose();
          }}
        >
          <Box sx={styles}>
            <LeaderboardIcon sx={{ marginRight: 2 }} />
            Leaderboard
          </Box>
        </MenuItem>
        <MenuItem
          sx={{ p: 0 }}
          onClick={() => {
            if (authStore.isAdmin) {
              router.push('/admin/account-settings');
            } else {
              router.push('/account-settings');
            }

            handleDropdownClose();
          }}
        >
          <Box sx={styles}>
            <CogOutline sx={{ marginRight: 2 }} />
            Settings
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ py: 2 }} onClick={handleLogout}>
          <LogoutVariant
            sx={{
              marginRight: 2,
              fontSize: '1.375rem',
              color: 'text.secondary',
            }}
          />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default UserDropdown;
