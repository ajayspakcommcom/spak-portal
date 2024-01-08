import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { store } from '../redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Preloader from '@/components/preloader';
import { persistStore } from 'redux-persist';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const persistor = persistStore(store);

const theme = createTheme({
  typography: {
    fontSize: 13
  }
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={<Preloader />} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </>
  )
}
