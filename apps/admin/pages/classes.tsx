import { Button, Modal, Input, Container, Grid, Text } from '@nextui-org/react';
import ClassCard from '../components/classcard';
import React from "react";

import {APIClient} from "@tara/api-client-ts"
const client = new APIClient("https://localhost:3333")

export function Classes() {

	const [visible, setVisible] = React.useState(false);
	const modalHandler = () => setVisible(true);

	const closeHandler = () => {
		setVisible(false);
		console.log("closed");
	};
	
	return (
		<>
		<Container css={{paddingTop: "50px"}}>
			<Text h1 size={32} color="primary" css={{margin:"10px"}}>Your Classes</Text>
			<Text h2 css={{margin:"0px 10px 5px"}}>Spring 2023</Text>
			<Grid.Container gap={2}>
				<Grid css={{padding:"0px"}} xs={4}>
					<ClassCard></ClassCard>
				</Grid>
				<Grid css={{padding:"0px"}} xs={4}>
					<ClassCard></ClassCard>
				</Grid>
				<Grid css={{padding:"0px"}} xs={4}>
					<ClassCard></ClassCard>
				</Grid>
			</Grid.Container>
			<Button css={{margin: "15px 0px"}} onPress={modalHandler}>Add a course</Button>
		</Container>

		<Modal closeButton
			aria-labelledby="modal-title"
			open={visible}
			onClose={closeHandler}>
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

		<Container css={{paddingTop: "50px"}}>
			<Text h2 css={{margin:"0px 10px 5px"}}> Archived classes </Text>
			<Grid.Container gap={2}>
				<Grid css={{padding:"0px"}} xs={4}>
					<ClassCard></ClassCard>
				</Grid>
				<Grid css={{padding:"0px"}} xs={4}>
					<ClassCard></ClassCard>
				</Grid>
				<Grid css={{padding:"0px"}} xs={4}>
					<ClassCard></ClassCard>
				</Grid>
			</Grid.Container>
		</Container>
		</>
	);
}

export default Classes;
