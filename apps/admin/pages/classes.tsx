import { Button, Modal, Input, Container, Grid, Text } from '@nextui-org/react';
import ClassCard from '../components/classcard';
import React from 'react';
import Navbar from '../components/navbar';
import { APIClient } from '@tara/api-client-ts';
export async function getServerSideProps() {
	// const client = new APIClient('http://localhost:3333');
	// const classes = await client.getCourses();
	return { props: { classes: [] } };
}

export function Classes({ classes }) {
	const [visible, setVisible] = React.useState(false);
	const modalHandler = () => setVisible(true);

	const closeHandler = () => {
		setVisible(false);
		console.log('closed');
	};

	const createClassHandler = async (name: string) => {
		try {
			//const newClass = await client.
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
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
						<Button auto onPress={closeHandler}>
							Create class
						</Button>
					</Modal.Footer>
				</Modal>

				<Container css={{ padding: '0px' }}>
					<Text h2 size={20}>
						Archived classes
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
					</Container>
				</Container>
			</Container>
		</>
	);
}

export default Classes;
