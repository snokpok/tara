import { AppProps } from 'next/app';
import Head from 'next/head';
import { NextUIProvider } from '@nextui-org/react';
import './styles.css';
import Navbar from '../components/navbar';

function CustomApp({ Component, pageProps }: AppProps) {
	return (
	  <NextUIProvider>
		<Navbar/>
		<Component {...pageProps} />
	  </NextUIProvider>
	);
}

export default CustomApp;
