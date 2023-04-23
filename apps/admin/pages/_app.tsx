import { AppProps } from 'next/app';
import Head from 'next/head';
import { NextUIProvider, createTheme} from '@nextui-org/react';
import './styles.css';
import { APIClient } from '@tara/api-client-ts';
import { useEffect } from 'react';

const client = new APIClient("http://localhost:3333");

const taraTheme = createTheme({
	type: 'light',
	theme: {
	  colors: {
		// brand colors
		background: 'white',
		text: '#061505',
		primary: '#6AA638',
		primaryBorder:'#6AA638',
		/*primaryLight: '$green200',
		primaryLightHover: '#6AA638',
		primaryLightActive: '$green400',
		primaryLightContrast: '$green600',
		primary: '#6AA638',
		primaryBorder: '$green500',
		primaryBorderHover: '$green600',
		primarySolidHover: '$green700',
		primarySolidContrast: '$white',
		primaryShadow: '$green500',
  
		gradient: 'linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)',
		link: '#5E1DAD',*/
	  },
	  space: {},
	  fonts: {}
	}
  })

function CustomApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		client.metrics().then((data) => {
			if(data.error) {
				console.error(data.error);
			}
		});
	})
	
	return (
	  <NextUIProvider theme={taraTheme}>
		<Component {...pageProps} />
	  </NextUIProvider>
	);
}

export default CustomApp;
