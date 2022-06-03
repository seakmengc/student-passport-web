import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Typography,
} from '@mui/material';
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration';
import { useTheme } from '@emotion/react';
import BlankLayout from './BlankLayout';

export const CardCenterLayout = ({ children }) => {
  const theme = useTheme();

  return (
    <BlankLayout>
      <Box className='content-center'>
        <Card sx={{ zIndex: 1 }} className='w-full sm:w-128'>
          <CardContent
            sx={{ padding: (theme) => `${theme.spacing(12, 9, 7)} !important` }}
          >
            {children}
          </CardContent>
        </Card>

        <FooterIllustrationsV1 />
      </Box>
    </BlankLayout>
  );
};
