import { Card, Text, Link } from '@nextui-org/react';

const ClassCard = ({headerText}) => {
	return (
      
        <Card variant="shadow" css={{borderColor: '#fff', padding: '0px'}}>
          <Card.Header><Text b>{headerText}</Text></Card.Header>
          <Card.Body><Text>Introduction to Algorithms and the Theory of Computing</Text></Card.Body>
          <Card.Footer>
            <Link
              color="primary"
              target="_blank"
              href="/course">
              Visit course →
            </Link>
        </Card.Footer>
        </Card>

	);
};
export default ClassCard;
