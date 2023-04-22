import { Button,  Container, Text } from '@nextui-org/react';
import ClassCard from '../components/classcard';

export function Classes() {
	/*
	 * Replace the elements below with your own.
	 *
	 * Note: The corresponding styles are in the ./index.css file.
	 */
	return (
		<Container fluid>
			<Text h1>Your Courses</Text>
			<Text h2>Spring 2023</Text>
      <ClassCard></ClassCard>
      <Button>Add a class</Button>
			<Text h2>Completed</Text>
		</Container>
	);
}

export default Classes;
