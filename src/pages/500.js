// ** Next Import
import Link from 'next/link';

// ** MUI Components
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout';

// ** Demo Imports
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations';
import Image from 'next/image';
import { Player } from '@lottiefiles/react-lottie-player';

// ** Styled Components
const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw',
  },
}));

const Img = styled('img')(({ theme }) => ({
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10),
  },
  [theme.breakpoints.down('md')]: {
    height: 400,
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(13),
  },
}));

const TreeIllustration = styled('img')(({ theme }) => ({
  left: 0,
  bottom: '5rem',
  position: 'absolute',
  [theme.breakpoints.down('lg')]: {
    bottom: 0,
  },
}));

const Error500 = () => {
  return (
    <Box className='content-center'>
      <Box
        sx={{
          p: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <BoxWrapper>
          <Typography variant='h1'>500</Typography>
          <Typography
            variant='h5'
            sx={{ mb: 1, fontSize: '1.5rem !important' }}
          >
            Internal server error 👨🏻‍💻
          </Typography>
          <Typography variant='body2'>Oops, something went wrong!</Typography>
        </BoxWrapper>
        <div className='h-1/4 w-full'>
          {/* <Image
            alt='error-illustration'
            src='/images/pages/500.png'
            width={1500}
            height={1000}
            layout='intrinsic'
          /> */}
          <Player
            autoplay
            loop
            src='/anims/500.json'
            style={{
              height: '300px',
              width: '300px',
            }}
          ></Player>
        </div>
        <Link passHref href='/'>
          <Button component='a' variant='contained' sx={{ px: 5.5 }}>
            Back to Home
          </Button>
        </Link>
      </Box>
      <FooterIllustrations
        image={<TreeIllustration alt='tree' src='/images/pages/tree-3.png' />}
      />
    </Box>
  );
};
Error500.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;

export default Error500;
