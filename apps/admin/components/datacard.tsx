import { Card, Text } from '@nextui-org/react';

const DataCard = ({ headerText, id }) => {
	return (
		<Card isHoverable variant="shadow" css={{ borderColor: '#fff', padding: '0px' }}>
			<Card.Header>
				<Text b size={36}> {headerText}</Text>
			</Card.Header>
            <Card.Body css={{paddingTop: '0px', paddingBottom:'0px'}}>
                <Text> of class confusions were due to </Text>
            </Card.Body>
			<Card.Footer css={{paddingTop: '0px'}}>
                <Text b size={18}> {id}  </Text>
			</Card.Footer>
		</Card>
	);
};
export default DataCard;
