import { Button, Container, Text } from '@nextui-org/react';
import ClassCard from '../components/classcard';

export function Course() {
	/*
	 * Replace the elements below with your own.
	 *
	 * Note: The corresponding styles are in the ./index.css file.
	 */
	return (
		<Container fluid>
			<Text h1>Your Class</Text>
			<Text h2>Coming Up</Text>
			<ClassCard></ClassCard>
			<Button>Add an assignment</Button>
			<Text h2>Completed</Text>
		</Container>
	);
}

export default Course;
