// import styles from './navbar.module.css';
import Link from 'next/link';
import React from 'react';
import { Navbar, Text, Image, Modal } from '@nextui-org/react';

const navbar = () => {
	return (
		<>
			<Navbar variant="sticky">
				<Navbar.Brand css={{ display: 'inline-flex', alignItems: 'center' }}>
					<Link href="/classes">
						<Image
							width={32}
							height={32}
							src="https://i.ibb.co/WzyPK1m/logo.png"
							alt="TARA logo"
						/>
						<Text weight="bold"> Tara.AI </Text>
					</Link>
				</Navbar.Brand>
				<Navbar.Content enableCursorHighlight>
					<Navbar.Link href="/classes"> Classes </Navbar.Link>
					<Navbar.Link href=""> Log out </Navbar.Link>
				</Navbar.Content>
			</Navbar>
		</>
	);
};

export default navbar;
