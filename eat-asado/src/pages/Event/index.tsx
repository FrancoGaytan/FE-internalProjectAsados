import { useMemo, useState, useEffect } from 'react';
import PrivateFormLayout from '../../components/macro/layout/PrivateFormLayout';
import Button from '../../components/micro/Button/Button';
import { useTranslation } from '../../stores/LocalizationContext';
import styles from './styles.module.scss';
import { useEvent } from '../../stores/EventContext';
import { useAuth } from '../../stores/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getEventById } from '../../service';
import { useParams } from 'react-router-dom';
import { IUser } from '../../models/user';

export function Event(): JSX.Element {
	const lang = useTranslation('eventHome');
	const { user } = useAuth();
	const navigate = useNavigate();
	const [event, setEvent] = useState<any>(); //TODO: Sacar o typear este any
	const userIdParams = useParams();

	const itemStepsData = useMemo(
		() => [
			{ title: lang.LogInTheApp.title, description: lang.LogInTheApp.description, imagePath: '/assets/pictures/joinAppLogo.png' },
			{ title: lang.joinToAnBarbecue.title, description: lang.joinToAnBarbecue.description, imagePath: '/assets/pictures/calendarLogo.png' },
			{ title: lang.letsEat.title, description: lang.letsEat.description, imagePath: '/assets/pictures/chickenLeg.png' }
		],
		[lang]
	);

	useEffect(() => {
		const abortController = new AbortController();
		getEventById(userIdParams.eventId, abortController.signal)
			.then(res => {
				setEvent(res);
				console.log(res);
			})
			.catch(e => {
				console.error('Catch in context: ', e);
			});

		return () => abortController.abort();
	}, []);

	function parseMinutes(minutes: string) {
		let newMinutes = minutes;
		if (Number(minutes) < 10) {
			newMinutes = '0' + minutes;
		}
		return newMinutes;
	}

	function getOnlyDate(evDateTime: Date) {
		return evDateTime.getDate().toString() + '. ' + evDateTime.getMonth().toString() + '. ' + evDateTime.getFullYear().toString() + '.';
	}

	function getOnlyHour(evDateTime: Date) {
		return evDateTime.getHours().toString() + ':' + parseMinutes(evDateTime.getMinutes().toString());
	}

	return (
		//TODO: Fijate como renderizar todo solo cuando el evento este cargado
		<PrivateFormLayout>
			<div className={styles.content}>
				<section className={styles.header}>
					<h1>{lang.messageBanner}</h1>
					<Button kind="primary" size="large" onClick={() => navigate('/createEvent')}>
						{lang.newEventButton}
					</Button>
				</section>
				{!!event && (
					<section className={styles.event}>
						<h1>{event.title}</h1>
						{/* TODO: Sacar todos los operadores ternarios con los loadings */}
						<main className={styles.eventData}>
							<div className={styles.eventOrganization}>
								<div className={styles.sectionTitle}>
									<div className={styles.calendarLogo}></div>
									<h3>Organización</h3>
								</div>
								<h5>Fecha: {getOnlyDate(new Date(event.datetime))}</h5>
								<h5>Hora: {getOnlyHour(new Date(event.datetime))}</h5>
								<h5>Organizador: {event.organizer.name}</h5>
								<h5>Asador: {event.eventCook}</h5>
								{/* no tengo al chef ni al encargado de compras*/}
								<h5>Encargado de Compras: {}</h5>

								<div className={styles.secondRow}>
									<div className={styles.sectionTitle}>
										<div className={styles.restaurantLogo}></div>
										<h3>Menu/Descripción</h3>
									</div>
									<h5>{event.description}</h5>
								</div>
							</div>
							<div className={styles.eventParticipants}>
								<div className={styles.participantsTitle}></div>
								<div className={styles.sectionTitle}>
									<div className={styles.participantsLogo}></div>
									<h3>
										Comensales: {event.members.length}/{event.memberLimit}
									</h3>
								</div>
								{event.members.map((member: IUser) => (
									<h5>{member.name}</h5>
								))}
							</div>
						</main>
						<Button kind="secondary" size="short" onClick={() => navigate('/')}>
							{}Participate/Bajarse
						</Button>
					</section>
				)}
			</div>
		</PrivateFormLayout>
	);
}
