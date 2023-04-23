import { Button, Modal, Input, Container, Grid, Text } from '@nextui-org/react';
import ClassCard from '../components/classcard';
import React, { useEffect } from 'react';
import Navbar from '../components/navbar';
import { apiClient } from '../common/api';
import {useCookies} from 'react-cookie'
import {Course} from '@tara/types'

// export async function getServerSideProps(req,res) {
// 	const classes = await apiClient.getCourses();
// 	return { props: { classes } };
// }

export function Classes() {
	const [visible, setVisible] = React.useState(false);
	const modalHandler = () => setVisible(true);
	const [classes, setClasses] = React.useState<Course[]>([])
	const [createClassName, setCreateClassName] = React.useState("");
	const [createClassDescription, setCreateClassDescription] = React.useState("");
	const [refetchClasses, setRFC] = React.useState(false);

	const [cookies, setCookie] = useCookies();

	const closeHandler = () => {
		setVisible(false);
	};

	const fetchUpdateClasses = () => {
		const token = cookies['token'];
		apiClient.setAccessToken(token);
		apiClient.getCourses().then((res) => {
			if(res.error) {
				alert(res.error.error);
			}
			setClasses(res.data);
		})
	}

	useEffect(() => {
		fetchUpdateClasses();
	}, [])

	const createClassHandler = async (name: string) => {
		const token = cookies['token'];
		apiClient.setAccessToken(token);
		const newclass = new Course();
		apiClient.createCourse(name).then((res) => {
			if(res.error) {
				alert(res.error.error);
			}
			newclass.id = res.id
			fetchUpdateClasses();
		})
		// newclass.name = name;
		// setClasses(prev => [...prev, newclass])
		closeHandler();
	};

	return (
		<>
			<Navbar />
			<Container
				display="flex"
				direction="column"
				css={{ gap: '32px', paddingTop: '50px' }}
			>
				<Text h1 size={32} color="primary">
					Your Classes
				</Text>
				<Container css={{ padding: '0px' }}>
					<Text h2 size={20}>
						Spring 2023
					</Text>

					<Container
						css={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
							gap: '16px',
							padding: '0px',
							margin: '16px 0px',
						}}
					>
						{classes.map((c, i) => (
							<ClassCard headerText={c.name} key={i} id={c.id} />
						))}
					</Container>
					<Button onPress={modalHandler}>Add a course</Button>
				</Container>

				<Modal
					closeButton
					aria-labelledby="modal-title"
					open={visible}
					onClose={closeHandler}
				>
					<Modal.Header>
						<Text> Add a class </Text>
					</Modal.Header>
					<Modal.Body>
						<Input
							clearable
							bordered
							fullWidth
							color="primary"
							size="lg"
							placeholder="e.g CSCI270"
							value={createClassName}
							onChange={(e) => setCreateClassName(e.target.value)}
						/>
						<Input
							clearable
							bordered
							fullWidth
							color="primary"
							size="lg"
							placeholder="e.g Introduction to Algorithms"
						/>
					</Modal.Body>
					<Modal.Footer>
						<Button auto flat color="error" onPress={closeHandler}>
							Cancel
						</Button>
						<Button auto onPress={() => createClassHandler(createClassName)}>
							Create class
						</Button>
					</Modal.Footer>
				</Modal>

				<Container css={{ padding: '0px' }}>
					<Container
						css={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
							gap: '16px',
							padding: '0px',
							margin: '16px 0px',
						}}
					></Container>
				</Container>
			</Container>
		</>
	);
}

export default Classes;
