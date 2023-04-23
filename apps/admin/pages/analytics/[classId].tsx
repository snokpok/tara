import axios from 'axios';
import {useState, useEffect} from 'react'
import { Button, Progress, Container, Text } from '@nextui-org/react';
import { useRouter } from 'next/router';
import Navbar from '../../components/navbar';
import DataCard from '../../components/datacard';
import { apiClient } from '../../common/api';
import { useCookies } from 'react-cookie';
import { Course } from '@tara/types';


const URL_NLP = "http://127.0.0.1:6363"

export function Analytics() {
	/*
	 * Replace the elements below with your own.
	 *
	 * Note: The corresponding styles are in the ./index.css file.
	 */

	const [topicFreqs, setTF] = useState({});
	const [sentiments, setSentiments] = useState({});
	const [course, setCourse] = useState<Course | null>(null);
	const [cookies, setCookie] = useCookies();

	const router = useRouter();
	const class_id = router.query.classId as string


	const fetchAndUpdateTree = async () => {
		if (!class_id) return;
		const token = cookies['token'];
		apiClient.setAccessToken(token);
		await apiClient.getCourse(Number.parseInt(class_id)).then(({ data, error }) => {
			if (error) {
				alert(error);
			}
			console.log(data)
			setCourse(data);
		});
	};

	useEffect(() => {
		if(class_id) {
			fetchAndUpdateTree();
			axios.get(`${URL_NLP}/data?class_id=${class_id}`).then(({data}) => {
				const res = data.result as {sentiments: Record<string,number>, frequencies: Record<string,number>}
				setTF(res['frequencies'])
				setSentiments(res['sentiments'])
			})
		}
	}, []);

	return (
		<>
			<Navbar />
			<Container display="flex" direction="column" css={{ gap: '32px', paddingTop: '50px' }}>
				<Text h1 size={32} color="primary">
					{course && course.name} -- Data Analytics
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
						{Object.entries(topicFreqs).map(([topic, frequency]) => (
							<DataCard headerText={`${Math.round(frequency*10)/10}%`} id={topic} key={topic} />
						))}
					</Container>
					<Container css={{ padding: '0px' }}>
						<Text h2 size={20}>
							Overall class sentiment
						</Text>
						<Progress color="primary" value={((sentiments['positive'] + 0.0)/(sentiments['positive'] + sentiments['negative']) * 100)}/>
						<Text b>
							Positive: {sentiments['positive']}, Negative: {sentiments['negative']} (based on general course discussions)
						</Text>
					</Container>
					<Button css={{ marginTop: '40px' }}> Refresh </Button>
				</Container>
			</Container>
		</>
	);
}

export default Analytics;
