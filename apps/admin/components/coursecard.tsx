import {
	Button,
	Card,
	Container,
	Input,
	Modal,
	Text,
	Textarea,
} from '@nextui-org/react';
import { Artifact } from '@tara/types';
import React, { useState } from 'react';
import { AiOutlinePlus, AiFillPlusCircle } from 'react-icons/ai';
import { apiClient } from '../common/api';
import { useCookies } from 'react-cookie';

const CourseCard = (props: { artifact: Artifact, updateTree: () => void }) => {
	const [visible, setVisible] = React.useState(false);
	const [artifactInputName, setAIN] = React.useState('');
	const [artifactInputSolution, setAIS] = React.useState('');
	const [cookies] = useCookies();

	const closeHandler = () => {
		setVisible(false);
		setAIN('');
	};

	const handleSubmit = () => {
		apiClient.setAccessToken(cookies['token']);
		apiClient.addCourseArtifact(props.artifact.courseId, {
			type: 'QUESTION',
			solution: artifactInputSolution,
			name: artifactInputName,
			parentArtifactId: props.artifact.id,
		}).then(({id, error}) => {
			if(error) {
				alert(error);
			}
			console.log(id);
			props.updateTree();
			closeHandler();
		})
	};

	return (
		<Card
			variant={props.artifact.parentId === null ? 'shadow' : 'bordered'}
			css={{ borderColor: '#fff', color: 'white', paddingLeft: '$10' }}
			key={props.artifact.id}
		>
			<Card.Body>
				<Container
					display="flex"
					direction="row"
					wrap="nowrap"
					justify="space-between"
					alignItems="center"
					css={{ padding: '0px' }}
				>
					<Container display="flex" direction="column">
						<Text b>{props.artifact.name}</Text>
						<Text size="$xs" i>
							{props.artifact.type[0].toUpperCase() +
								props.artifact.type.substring(1).toLowerCase()}
						</Text>
					</Container>
					<Container display="flex" justify="flex-end" css={{ gap: '8px' }}>
						<Button
							icon={<AiFillPlusCircle />}
							onPress={() => {
								setVisible(true);
							}}
						/>
					</Container>
				</Container>
				{props.artifact.children?.map((child) => (
					<CourseCard artifact={child} key={child.id} updateTree={props.updateTree}/>
				))}
			</Card.Body>
			<Modal
				closeButton
				width="600px"
				aria-labelledby="modal-title"
				open={visible}
				onClose={closeHandler}
			>
				<Modal.Header>
					<Text> Add a question to {props.artifact.name}</Text>
				</Modal.Header>
				<Modal.Body>
					<Input
						clearable
						bordered
						fullWidth
						color="primary"
						size="lg"
						placeholder="e.g Question 1: Tell me an astronautical fact"
						value={artifactInputName}
						onChange={(e) => setAIN(e.target.value)}
					/>
					<Textarea
						bordered
						fullWidth
						color="primary"
						rows={8}
						size="lg"
						placeholder="e.g The Moon revolves around the Earth"
						value={artifactInputSolution}
						onChange={(e) => {
							setAIS(e.target.value);
						}}
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button auto flat color="error" onPress={closeHandler}>
						Cancel
					</Button>
					<Button
						auto
						onPress={() => {
							handleSubmit();
						}}
					>
						Submit
					</Button>
				</Modal.Footer>
			</Modal>
		</Card>
	);
};
export default CourseCard;
