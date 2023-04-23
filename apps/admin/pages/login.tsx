import { Button, Container, Input } from '@nextui-org/react';
import { useState } from 'react';
import { apiClient } from '../common/api';
import { useRouter } from 'next/router';

const Login = () => {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [pwd, setPwd] = useState('');
	return (
		<Container
			display="flex"
			direction="column"
			css={{ gap: '32px', paddingTop: '50px', maxWidth: '20rem' }}
		>
			<Input
				type="email"
				value={email}
				placeholder="Email"
				onChange={(e) => {
					setEmail(e.target.value);
				}}
			/>
			<Input
				type="password"
				value={pwd}
				placeholder="password"
				onChange={(e) => {
					setPwd(e.target.value);
				}}
			/>
			<Button
				onClick={async (e) => {
					const res = await apiClient.login(email, pwd);
					if (res.error) {
						alert(res.error.error);
					} else {
						document.cookie = `token=${res.data.accessToken}; path=/`;
						router.replace('/classes');
					}
				}}
			>
				Login
			</Button>
		</Container>
	);
};

export default Login;
