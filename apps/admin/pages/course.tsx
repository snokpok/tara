import { Button, Container, Grid, Text } from '@nextui-org/react';
import CourseCard from '../components/coursecard';

import { APIClient } from '@tara/api-client-ts';
const client = new APIClient('https://localhost:3333');

export function Course() {
	return (
		<>
			<Text h1>Insert Course Name</Text>
			<Text h2>Coming Up</Text>
			<CourseCard></CourseCard>
			<Button>Add an assignment</Button>
			<Text h2>Completed</Text>
		</>
	);
}

export default Course;
