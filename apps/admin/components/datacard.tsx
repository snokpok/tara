import { Card, Text } from '@nextui-org/react';

const DataCard = ({ headerText, id }) => {
	return (
		<Card isHoverable variant="shadow" css={{ borderColor: '#fff', padding: '0px' }}>
			<Card.Header>
				<Text b size={32}> {headerText}</Text>
			</Card.Header>
            <Card.Body css={{paddingTop: '0px', paddingBottom:'0px'}}>
                <Text> of students struggled with </Text>
            </Card.Body>
			<Card.Footer css={{paddingTop: '0px'}}>
                <Text b> {id}  </Text>
			</Card.Footer>
		</Card>
	);
};
export default DataCard;
