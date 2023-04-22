// import styles from './navbar.module.css';
import Link from 'next/link';
import { Navbar, Text } from "@nextui-org/react";

const navbar = () => 
{
	return(
		<Navbar variant="sticky">
			<Navbar.Brand>
				<Link href="/classes">
					<Text weight="bold"> Tara.AI </Text>
				</Link>
			</Navbar.Brand>
			<Navbar.Content>
				<Navbar.Link href="/classes"> Classes </Navbar.Link>
				<Navbar.Link href="/analytics"> Analytics </Navbar.Link>
			</Navbar.Content>
		</Navbar>

	);
};

export default navbar;
