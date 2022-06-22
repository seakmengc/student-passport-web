// ** Next Import
import Link from 'next/link';
import Image from 'next/image';

// ** MUI Components
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout';

// ** Demo Imports
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations';
import { useRouter } from 'next/router';
import { route } from 'next/dist/server/router';
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

const Error404 = () => {
  const router = useRouter();

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
          <Typography variant='h1'>404</Typography>
          <Typography
            variant='h5'
            sx={{ mb: 1, fontSize: '1.5rem !important' }}
          >
            Resource or Page Not Found ⚠️
          </Typography>
          <Typography variant='caption'>
            This might happen due to resource has been deleted or invalid url.
          </Typography>
        </BoxWrapper>
        <div className='h-1/4 w-full'>
          {/* <Image
            alt='error-illustration'
            src='/images/pages/404.png'
            width={1500}
            height={1000}
            layout='intrinsic'
          /> */}
          <Player
            autoplay
            loop
            src='/anims/404.json'
            style={{
              height: '300px',
              width: '300px',
            }}
          ></Player>
        </div>
        <Button
          component='a'
          variant='contained'
          sx={{ px: 5.5 }}
          onClick={() => {
            router.back();
          }}
        >
          Back
        </Button>
      </Box>
      <FooterIllustrations
        image={<TreeIllustration alt='tree' src='/images/pages/tree.png' />}
      />
    </Box>
  );
};
Error404.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;

export default Error404;
