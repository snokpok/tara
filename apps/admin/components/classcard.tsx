import { Card, Text, Link, Container } from '@nextui-org/react';

const ClassCard = ({ headerText, id }) => {
	return (
		<Card variant="shadow" css={{ borderColor: '#fff', padding: '0px' }}>
			<Card.Header>
				<Text b>{headerText}</Text>
			</Card.Header>
			<Card.Footer>
				<Container display="flex" direction="column" css={{ padding: '0px' }}>
					<Link color="primary" href={`/${id}`}>
						Visit course →
					</Link>
					<Link color="primary" href={`/analytics/${id}`}>
						View analytics →
					</Link>
				</Container>
			</Card.Footer>
		</Card>
	);
};
export default ClassCard;
