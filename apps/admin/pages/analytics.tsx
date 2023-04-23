import { Button,  Container, Text } from '@nextui-org/react';
import ClassCard from '../components/classcard';
import Navbar from '../components/navbar';
export function Analytics() {
	/*
	 * Replace the elements below with your own.
	 *
	 * Note: The corresponding styles are in the ./index.css file.
	 */
	return (
		<>
			<Navbar/>
			<Container>
				<Button> Refresh </Button>
			</Container>
		</>
	);
}

export default Analytics;
