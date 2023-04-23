import { Button, Container, Grid, Text, Spacer } from '@nextui-org/react';
import CourseCard from '../components/coursecard';
import Navbar from '../components/navbar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { apiClient } from '../common/api';
import { useCookies } from 'react-cookie';
import { Course } from '@tara/types';

export function CoursePage() {
	const router = useRouter();
	const [cookies, setCookie] = useCookies();
	const [course, setCourse] = useState<Course | null>(null);

	useEffect(() => {
		fetchAndUpdateTree();
	}, [router.query.courseId as string])

	const fetchAndUpdateTree = () => {
		const courseId = router.query.courseId as string;
		if(!courseId) return;
		const token = cookies['token'];
		apiClient.setAccessToken(token);
		console.log(courseId)
		apiClient.getCourse(Number.parseInt(courseId)).then(({data,error}) => {
			if(error) {
				alert(error);
			}
			setCourse(data);
		})
	}

	if(course===null) {return null}

	return (
		<>
		<Navbar />
			<Container display="flex" direction="column" css={{ gap: '32px', paddingTop: '50px' }}>
				<Text h1 size={32} color="primary">
					{course.name}
				</Text>
				<Container css={{ padding: '0px' }}>
					<Container css={{ padding: '0px', margin: '16px 0px' }}>
						{course.artifacts.map(el => {
							return (
								<>
									<CourseCard artifact={el} updateTree={fetchAndUpdateTree}/>
									<Spacer y={1} />
								</>
							)
						})}
					</Container>
					<Button>Add an assignment</Button>
				</Container>
				{/* <Container css={{ padding: '0px' }}>
					<Text h2 size={20}>Completed</Text>
					<Container css={{ padding: '0px', margin: '16px 0px'}}>
						<CourseCard></CourseCard>
						<Spacer y={1} />
						<CourseCard></CourseCard>
					</Container>
				</Container> */}
			</Container>
		</>
	);
}

export default CoursePage;
