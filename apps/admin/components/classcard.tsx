import { Card, Text, Link } from '@nextui-org/react';

<<<<<<< HEAD
const ClassCard = ({ headerText }) => {
	return (
		<Card variant="shadow" css={{ borderColor: '#fff', padding: '0px' }}>
			<Card.Header>
				<Text b>{headerText}</Text>
			</Card.Header>
			<Card.Body>
				<Text>Introduction to Algorithms and the Theory of Computing</Text>
			</Card.Body>
			<Card.Footer>
				<Link color="primary" target="_blank" href="/course">
					Visit course →
				</Link>
			</Card.Footer>
		</Card>
=======
const ClassCard = () => {
	return (
    <Card variant="shadow" css={{ borderColor: '#fff', padding: '16px' }}>
      <Card.Header><Text b>CSCI 270</Text></Card.Header>
      <Card.Body><Text>Introduction to Algorithms and the Theory of Computing</Text></Card.Body>
      <Card.Footer>
        <Link
          color="primary"
          href="/course">
          Visit course →
        </Link>
      </Card.Footer>
    </Card>
>>>>>>> origin/coursepage
	);
};
export default ClassCard;
