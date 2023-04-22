import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { APIClient } from '@tara/api-client-ts';
import { useEffect } from 'react';

const client = new APIClient("http://localhost:3333");

function CustomApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		client.metrics().then((data) => {
			if(data.error) {
				console.error(data.error);
			}
		});
	})
	
	return (
		<>
			<Head>
				<title>Welcome to admin-test!</title>
			</Head>
			<main className="app">
				<Component {...pageProps} />
			</main>
		</>
	);
}

export default CustomApp;
