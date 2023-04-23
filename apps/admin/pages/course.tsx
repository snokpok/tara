import { Button, Container, Spacer, Text } from '@nextui-org/react';
import CourseCard from '../components/coursecard';

import {APIClient} from "@tara/api-client-ts"
const client = new APIClient("https://localhost:3333")

export function Course() {
	return (
		<>
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
		</>
	);
}

export default Course;
