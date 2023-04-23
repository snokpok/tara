import { Button, Card, Container, Text } from '@nextui-org/react';

const CourseCard = () => {
	return (
		<Card variant="shadow" css={{ borderColor: '#fff' }}>
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
						<Text b>HW 6: Hash Tables</Text>
						<Text size="$xs" i>
							March 23, 2023
						</Text>
					</Container>
					<Container display="flex" justify="flex-end" css={{ gap: '8px' }}>
						<Button>Edit assignment</Button>
						<Button>View analytics</Button>
					</Container>
				</Container>
			</Card.Body>
		</Card>
	);
};
export default CourseCard;
