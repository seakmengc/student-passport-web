import { Link, styled, useTheme, Typography } from '@mui/material';
import Image from 'next/image';
import themeConfig from 'src/configs/themeConfig';

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  lineHeight: 'normal',
  textTransform: 'uppercase',
  color: theme.palette.text.primary,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out',
}));

const StyledLink = styled('div')({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
});

export const LogoComponent = () => {
  const theme = useTheme();

  return (
    <Link href='/'>
      <StyledLink>
        <img src='/images/logo.png' width={75} height={75} />
        <HeaderTitle variant='h6' sx={{ ml: 3 }}>
          {themeConfig.templateName}
        </HeaderTitle>
      </StyledLink>
    </Link>
  );
};
