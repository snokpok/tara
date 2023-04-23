import { Button, Progress, Container, Text } from '@nextui-org/react';
import Navbar from '../components/navbar';
import DataCard from '../components/datacard';
export function Analytics() {
	/*
	 * Replace the elements below with your own.
	 *
	 * Note: The corresponding styles are in the ./index.css file.
	 */
	return (
		<>
			<Navbar />
			<Container display="flex" direction="column" css={{ gap: '32px', paddingTop: '50px' }}>
				<Text h1 size={32} color="primary">
					Data Analytics
				</Text>
				<Container css={{ padding: '0px' }}>
					<Text h2 size={20}>
						Topic sentiments
					</Text>
					<Container css={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
							gap: '16px',
							padding: '0px',
							margin: '16px 0px',	}}>
						<DataCard headerText="78%" id="Dijkstra's Algorithm and MSTs"></DataCard>
						<DataCard headerText="78%" id="Dijkstra's Algorithm and MSTs"></DataCard>
						<DataCard headerText="78%" id="Dijkstra's Algorithm and MSTs"></DataCard>
						<DataCard headerText="78%" id="Dijkstra's Algorithm and MSTs"></DataCard>
					</Container>
					<Container css={{ padding: '0px' }}>
						<Text h2 size={20}>
							Overall class sentiment
						</Text>
						<Progress color="primary" value={75}/>
					</Container>
					<Button css={{ marginTop: '40px' }}> Refresh </Button>
				</Container>
			</Container>
		</>
	);
}

export default Analytics;
