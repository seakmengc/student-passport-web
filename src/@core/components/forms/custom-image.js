import styled from '@emotion/styled';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { usePostUploadApi } from 'src/utils/api';
import { showSnackbar } from 'src/utils/snackbar';

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius,
}));

const CustomImage = ({
  form,
  field,
  defaultImageSrc,
  enqueueSnackbar,
  label,
}) => {
  const [imgSrc, setImgSrc] = useState(defaultImageSrc ?? '/images/no.jpeg');
  const hasError = !!form.formState.errors[field];

  const onImageChange = async (file) => {
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

      form.setValue(field, data._id);
    }
  };

  return (
    <div className='my-4'>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ImgStyled
          src={imgSrc}
          className={hasError ? 'border-2 border-red-600' : 'border-none'}
        />
        <Box>
          <Button component='label' variant='contained' htmlFor='upload'>
            {label}
            <input
              hidden
              type='file'
              onChange={onImageChange}
              accept='image/png, image/jpeg'
              id='upload'
            />
          </Button>
          <br></br>
          <Typography variant='caption' sx={{ marginTop: 5 }}>
            Allowed PNG or JPEG. Max size of 1MB.
          </Typography>
        </Box>
      </Box>
      {hasError && (
        <p className='capitalize-first text-xs text-error-500'>
          {form.formState.errors[field]?.message}
        </p>
      )}
    </div>
  );
};

export default CustomImage;
