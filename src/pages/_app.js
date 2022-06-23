// ** Next Imports
import Head from 'next/head';
import { Router } from 'next/router';

// ** Loader Import
import NProgress from 'nprogress';

// ** Emotion Imports
import { CacheProvider } from '@emotion/react';

// ** Config Imports
import themeConfig from 'src/configs/themeConfig';

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout';
import ThemeComponent from 'src/@core/theme/ThemeComponent';

// ** Contexts
import {
  SettingsConsumer,
  SettingsProvider,
} from 'src/@core/context/settingsContext';

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache';

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css';

// ** Global css styles
import '../../styles/globals.css';

import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';
import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import { retrieveMyOffices } from 'src/states/offices';

const clientSideEmotionCache = createEmotionCache();

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start();
  });
  Router.events.on('routeChangeError', () => {
    NProgress.done();
  });
  Router.events.on('routeChangeComplete', () => {
    NProgress.done();
  });
}

// ** Configure JSS & ClassName
const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  // Variables
  const getLayout =
    Component.getLayout ?? ((page) => <UserLayout>{page}</UserLayout>);

  return (
    <RecoilRoot>
      <RecoilNexus />
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{`${themeConfig.templateName}`}</title>
          <meta name='description' content={`${themeConfig.templateName}`} />
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>

        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          autoHideDuration={1500}
          variant='success'
        >
          <SettingsProvider>
            <SettingsConsumer>
              {(args) => {
                if (typeof window !== 'undefined') {
                  args.settings = {
                    ...args.settings,
                    mode: localStorage.getItem('mode') ?? 'light',
                  };

                  args.saveSettings();
                }

                return (
                  <ThemeComponent settings={args.settings}>
                    {getLayout(<Component {...pageProps} />)}
                  </ThemeComponent>
                );
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </SnackbarProvider>
      </CacheProvider>
    </RecoilRoot>
  );
};

export default App;
