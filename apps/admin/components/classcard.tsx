import { Card, Text, Link } from '@nextui-org/react';

const ClassCard = ({ headerText, id }) => {
	return (
		<Card variant="shadow" css={{ borderColor: '#fff', padding: '0px' }}>
			<Card.Header>
				<Text b>{headerText}</Text>
			</Card.Header>
			<Card.Footer>
				<Link color="primary" href={`/${id}`}>
					Visit course →
				</Link>
				<Link color="primary" href={`/analytics/${id}`}>
					View analytics →
				</Link>
			</Card.Footer>
		</Card>
	);
};
export default ClassCard;
