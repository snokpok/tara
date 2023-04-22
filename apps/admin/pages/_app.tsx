import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import Navbar from '../components/navbar.tsx';

function CustomApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Welcome to admin-test!</title>
			</Head>
			<Navbar />
			<main className="app">
				<Component {...pageProps} />
			</main>
		</>
	);
}

export default CustomApp;
