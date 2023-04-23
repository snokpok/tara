import {
	Button,
	Container,
	Grid,
	Text,
	Spacer,
	Input,
	Modal,
	Textarea,
	Dropdown,
} from '@nextui-org/react';
import CourseCard from '../components/coursecard';
import Navbar from '../components/navbar';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { apiClient } from '../common/api';
import { useCookies } from 'react-cookie';
import { ArtifactType, Course } from '@tara/types';

const typeOptions = [
	'QUESTION',
	'PROJECT',
	'LAB',
	'EXAM',
	'ASSIGNMENT',
	'UNIDENTIFIED',
];

export function CoursePage() {
	const router = useRouter();
	const [visible, setVisible] = useState(false);
	const [cookies, setCookie] = useCookies();
	const [course, setCourse] = useState<Course | null>(null);
	const [can, setCAN] = useState<string>('');
	const [selected, setSelected] = useState<Set<ArtifactType>>(
		new Set(['ASSIGNMENT'])
	);
	const courseId = router.query.courseId as string;

	useEffect(() => {
		fetchAndUpdateTree();
	}, [router.query.courseId as string]);

	const fetchAndUpdateTree = () => {
		if (!courseId) return;
		const token = cookies['token'];
		apiClient.setAccessToken(token);
		apiClient.getCourse(Number.parseInt(courseId)).then(({ data, error }) => {
			if (error) {
				alert(error);
			}
			setCourse(data);
		});
	};

	const handleAddAssignment = () => {
		if (!courseId) return;
		const token = cookies['token'];
		apiClient.setAccessToken(token);
		apiClient
			.addCourseArtifact(Number.parseInt(courseId), {
				type: selectedValue as ArtifactType,
				name: can,
			})
			.then(({ error }) => {
				if (error) {
					alert(error);
				}
				fetchAndUpdateTree();
				setVisible(false);
			});
	};

	const selectedValue = useMemo(
		() => Array.from(selected).join(', ').replace('_', ' '),
		[selected]
	);

	if (course === null) {
		return null;
	}

	return (
		<>
			<Navbar />
			<Container
				display="flex"
				direction="column"
				css={{ gap: '32px', paddingTop: '50px' }}
			>
				<Container display="flex" justify="space-between">
					<Text h1 size={32} color="primary">
						{course.name}
					</Text>
					<Button onPress={() => setVisible(true)}>Add an assignment</Button>
				</Container>
				<Container css={{ padding: '0px' }}>
					<Container css={{ padding: '0px', margin: '16px 0px' }}>
						{course.artifacts.map((el) => {
							return (
								<>
									<CourseCard artifact={el} updateTree={fetchAndUpdateTree} />
									<Spacer y={1} />
								</>
							);
						})}
					</Container>
				</Container>

				<Modal
					closeButton
					width="600px"
					aria-labelledby="modal-title"
					open={visible}
					onClose={() => setVisible(false)}
				>
					<Modal.Header>
						<Text> Add an assignment to {course.name}</Text>
					</Modal.Header>
					<Modal.Body>
						<Container display="flex" gap={8} direction='column'>
							<Dropdown>
								<Dropdown.Button flat>{selectedValue}</Dropdown.Button>
								<Dropdown.Menu
									aria-label="Single selection actions"
									color="secondary"
									disallowEmptySelection
									selectionMode="single"
									selectedKeys={selected}
									onSelectionChange={(s) => setSelected(s as Set<ArtifactType>)}
								>
									{typeOptions.map((t) => (
										<Dropdown.Item key={t}>{t}</Dropdown.Item>
									))}
								</Dropdown.Menu>
							</Dropdown>
							<Input
								clearable
								bordered
								fullWidth
								color="primary"
								size="lg"
								placeholder="e.g Homework 1"
								value={can}
								onChange={(e) => setCAN(e.target.value)}
							/>
						</Container>
					</Modal.Body>
					<Modal.Footer>
						<Button auto flat color="error" onPress={() => setVisible(false)}>
							Cancel
						</Button>
						<Button
							auto
							onPress={() => {
								handleAddAssignment();
								setVisible(false);
								setCAN('');
							}}
						>
							Submit
						</Button>
					</Modal.Footer>
				</Modal>
			</Container>
		</>
	);
}

export default CoursePage;
