import { Badge, Card, Text, Link } from '@nextui-org/react';

const CourseCard = () => {
	return (
		<Card isHoverable variant="shadow">
			<Card.Body>
				<Text>HW 6: Hash Tables</Text>
				<Text>The date</Text>
				<Badge>assignment type</Badge>
			</Card.Body>
		</Card>
	);
};
export default CourseCard;
