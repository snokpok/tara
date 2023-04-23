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
import React from 'react';
import { AiFillPlusCircle, AiFillEdit } from 'react-icons/ai';
import { apiClient } from '../common/api';
import { useCookies } from 'react-cookie';

const CourseCard = (props: { artifact: Artifact; updateTree: () => void }) => {
	const mode = props.artifact.solution || (props.artifact.children.length>0) ? 'EDIT' : 'CREATE';
	const [visible, setVisible] = React.useState(false);
	const [artifactInputName, setAIN] = React.useState(mode==="EDIT" ? props.artifact.name : "");
	const [artifactInputSolution, setAIS] = React.useState(mode==="EDIT" ? props.artifact.solution : "");
	const [cookies] = useCookies();

	const closeHandler = () => {
		setVisible(false);
		if(mode==="CREATE") {
			setAIN('');
			setAIS('');
		}
	};

	const handleCreateAssignment = () => {
		apiClient.setAccessToken(cookies['token']);
		apiClient
			.addCourseArtifact(props.artifact.courseId, {
				type: 'QUESTION',
				solution: artifactInputSolution,
				name: artifactInputName,
				parentArtifactId: props.artifact.id,
			})
			.then(({ id, error }) => {
				if (error) {
					alert(error);
				}
				props.updateTree();
				closeHandler();
			});
	};

	const handleEditAssignment = () => {
		const token = cookies['token'];
		apiClient.setAccessToken(token);
		apiClient
			.editCourseArtifact(props.artifact.courseId, props.artifact.id, {
				name: artifactInputName,
				solution: artifactInputSolution,
			})
			.then(({ error }) => {
				if (error) {
					alert(error);
				}
				props.artifact.name = artifactInputName;
				props.artifact.solution = artifactInputSolution;
				props.updateTree();
				setVisible(false);
			});
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
						<Text size="$xs" i color="gray">
							{props.artifact.type[0].toUpperCase() +
								props.artifact.type.substring(1).toLowerCase()}
						</Text>
					</Container>
					<Container display="flex" justify="flex-end" css={{ gap: '8px' }}>
						<Button
							auto
							iconRight={
								mode === 'EDIT' ? <AiFillEdit /> : <AiFillPlusCircle />
							}
							onPress={() => {
								setVisible(true);
							}}
						>
							{mode === 'EDIT' ? 'Edit' : 'Add'}
						</Button>
					</Container>
					{props.artifact.solution && <Text>has solution</Text>}
				</Container>
				{props.artifact.children?.map((child) => (
					<CourseCard
						artifact={child}
						key={child.id}
						updateTree={props.updateTree}
					/>
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
					{mode === 'CREATE' ? (
						<Text> Add a question to {props.artifact.name}</Text>
					) : (
						<Text> Edit question for {props.artifact.name}</Text>
					)}
				</Modal.Header>
				<Modal.Body>
					<Input
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
						disabled={props.artifact.children?.length>0}
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
						disabled={artifactInputName===props.artifact.name && artifactInputSolution===props.artifact.solution}
						auto
						onPress={() => {
							if(mode==="EDIT") {
								handleEditAssignment();
							}else if(mode==="CREATE") {
								handleCreateAssignment();
							}
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
