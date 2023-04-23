<<<<<<< HEAD
import { Button, Container, Grid, Text } from '@nextui-org/react';
import CourseCard from '../components/coursecard';

import { APIClient } from '@tara/api-client-ts';
const client = new APIClient('https://localhost:3333');
=======
import { Button, Container, Spacer, Text } from '@nextui-org/react';
import CourseCard from '../components/coursecard';

import {APIClient} from "@tara/api-client-ts"
const client = new APIClient("https://localhost:3333")
>>>>>>> origin/coursepage

export function Course() {
	return (
		<>
<<<<<<< HEAD
			<Text h1>Insert Course Name</Text>
			<Text h2>Coming Up</Text>
			<CourseCard></CourseCard>
			<Button>Add an assignment</Button>
			<Text h2>Completed</Text>
=======
			<Container display="flex" direction="column" css={{ gap: '32px', paddingTop: '50px' }}>
				<Text h1 size={32} color="primary">
					Insert Course Name
				</Text>
				<Container css={{ padding: '0px' }}>
					<Text h2 size={20}>Coming Up</Text>
					<Container css={{ padding: '0px', margin: '16px 0px' }}>
						<CourseCard></CourseCard>
						<Spacer y={1} />
						<CourseCard></CourseCard>
						<Spacer y={1} />
						<CourseCard></CourseCard>
					</Container>
					<Button>Add an assignment</Button>
				</Container>
				<Container css={{ padding: '0px' }}>
					<Text h2 size={20}>Completed</Text>
					<Container css={{ padding: '0px', margin: '16px 0px'}}>
						<CourseCard></CourseCard>
						<Spacer y={1} />
						<CourseCard></CourseCard>
					</Container>
				</Container>
			</Container>
>>>>>>> origin/coursepage
		</>
	);
}

export default Course;
