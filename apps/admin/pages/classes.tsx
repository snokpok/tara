import { Button,  Container, Text } from '@nextui-org/react';
import ClassCard from '../components/classcard';

export function Classes() {
	/*
	 * Replace the elements below with your own.
	 *
	 * Note: The corresponding styles are in the ./index.css file.
	 */
	return (
<<<<<<< HEAD
		<Container fluid>
			<Text h1>Your Courses</Text>
			<Text h2>Spring 2023</Text>
      <ClassCard></ClassCard>
      <Button>Add a class</Button>
			<Text h2>Completed</Text>
		</Container>
=======
		<div>
			<div className="wrapper">
				<div className="container">
				<div id="classes">
					<h1>Your Courses</h1>
				</div>
				<div id="hero" className="rounded">
						<div className="text-container">
							<h2>Spring 2023</h2>
					</div>
				</div>
				</div>
			</div>
		</div>
>>>>>>> 2d590a3 (navbar changes)
	);
}

export default Classes;
