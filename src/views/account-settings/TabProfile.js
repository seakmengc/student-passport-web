// ** React Imports
import { useEffect, useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import {
  usePostUploadApi,
  usePatchApi,
  handleShowSnackbar,
} from 'src/utils/api';
import { useSnackbar } from 'notistack';
import { useRecoilState, useRecoilValue } from 'recoil';
import { authState, setAuth } from 'src/states/auth';
import { showSnackbar } from 'src/utils/snackbar';

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  // height: 120,
  fit: 'cover',
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius,
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center',
  },
}));

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4),
  },
}));

const TabAccount = () => {
  // ** State
  const [openAlert, setOpenAlert] = useState(true);
  const [imgSrc, setImgSrc] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [upload, setUpload] = useState(null);
  const [authStore, setAuthStore] = useRecoilState(authState);

  const resetImgSrc = (profileUrl = null) => {
    setImgSrc(
      profileUrl ??
        authStore.profileUrl ??
        `https://avatars.dicebear.com/api/avataaars/${authStore.firstName}.png`
    );
    setUpload(null);
  };

  useEffect(async () => {
    resetImgSrc();
  }, []);

  const onChange = async (file) => {
    const reader = new FileReader();
    const { files } = file.target;
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result);
      reader.readAsDataURL(files[0]);

      const { data, error } = await usePostUploadApi(files[0]);
      if (error) {
        showSnackbar(data, error, enqueueSnackbar);
        return;
      }

      setUpload(data);
    }
  };

  const onSave = async () => {
    const { data, error } = await usePatchApi('user/me', {
      profile: upload._id,
    });

    showSnackbar(data, error, enqueueSnackbar);

    console.log(data);
    setAuthStore({
      ...authStore,
      profile: data.profile,
      profileUrl: data.profileUrl,
    });

    resetImgSrc(data.profileUrl);
  };

  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ImgStyled src={imgSrc} alt='Profile Pic' />
              {/* <img src={imgSrc} fit='cover' width={120} /> */}
              <Box>
                <ButtonStyled
                  component='label'
                  variant='contained'
                  htmlFor='account-settings-upload-image'
                >
                  Upload New Photo
                  <input
                    hidden
                    type='file'
                    onChange={onChange}
                    accept='image/png, image/jpeg'
                    id='account-settings-upload-image'
                  />
                </ButtonStyled>
                {/* <ResetButtonStyled
                  color='error'
                  variant='outlined'
                  onClick={() => setImgSrc('/images/avatars/1.png')}
                >
                  Reset
                </ResetButtonStyled> */}
                <Typography variant='body2' sx={{ marginTop: 5 }}>
                  Allowed PNG or JPEG. Max size of 1MB.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant='contained'
              sx={{ marginRight: 3.5 }}
              onClick={onSave}
              disabled={!upload}
            >
              Save
            </Button>
            <Button
              type='reset'
              variant='outlined'
              color='secondary'
              onClick={resetImgSrc}
              disabled={!upload}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  );
};

export default TabAccount;
