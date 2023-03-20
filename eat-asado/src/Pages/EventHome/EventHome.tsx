import PrivateFormLayout from '../../Components/macro/layout/PrivateFormLayout';
import Button from '../../Components/micro/Button/Button';
import { useTranslation } from '../../stores/LocalizationContext';
import styles from './styles.module.scss';
import { EventStatesEnum } from '../../enums/EventState.enum';
import EventCard from '../../Components/macro/EventCard/EventCard';
import { TEventState, TSubscribedState, TEventParticipationState } from '../../types/eventState';

interface IStepItem {
	title: string;
	description: string;
	imagePath: string;
}

const events = [
	{
		eventId: 'ad5f4d0005d4s5df4',
		fakeDate: new Date(2017, 4, 4, 17, 23, 42, 11),
		fakeState: EventStatesEnum.Available,
		fakeEventData: {
			eventTitle: 'CORDERITO SOLEADO',
			eventDescription: 'Cordero al fuego por tres horas con unas verduritas a la parrilla',
			eventParticipants: 8,
			eventParticipantLimit: 10,
			eventCook: 'Pablito'
		}
	},
	{
		eventId: 'ad5f4dab511d4s5df4',
		fakeDate: new Date(2017, 4, 5, 18, 20, 42, 11),
		fakeState: EventStatesEnum.Available,
		fakeEventData: {
			eventTitle: 'PATA REBOZADA',
			eventDescription: 'Pata rebozada al horno durante 6 horas',
			eventParticipants: 15,
			eventParticipantLimit: 15,
			eventCook: 'Franco'
		}
	},
	{
		eventId: 'ad1f4d22af5d4s5df4',
		fakeDate: new Date(2016, 4, 4, 17, 23, 42, 11),
		fakeState: EventStatesEnum.Canceled,
		fakeEventData: {
			eventTitle: 'ASADO DE VIERNES',
			eventDescription: 'Una tiritas a la parrila con ensalada',
			eventParticipants: 2,
			eventParticipantLimit: 10,
			eventCook: 'Pablito'
		}
	},
	{
		eventId: 'aa5f4daf5d433s5df4',
		fakeDate: new Date(2018, 8, 4, 17, 23, 42, 11),
		fakeState: EventStatesEnum.Closed,
		fakeEventData: {
			eventTitle: 'PARRILLA DE LOS JEFES',
			eventDescription: 'Asado completo con ensaladas',
			eventParticipants: 10,
			eventParticipantLimit: 10,
			eventCook: 'Juanca'
		}
	},
	{
		eventId: 'ad5f4da44f5hjs5df4',
		fakeDate: new Date(2017, 4, 4, 17, 23, 42, 11),
		fakeState: EventStatesEnum.Available,
		fakeEventData: {
			eventTitle: 'ASADO NOCTURNO',
			eventDescription: 'Asadito a las brazas con vegetales a la parri',
			eventParticipants: 3,
			eventParticipantLimit: 10,
			eventCook: 'Pablito'
		}
	},
	{
		eventId: 'ad5f4daf5d4s555004',
		fakeDate: new Date(2017, 4, 4, 17, 23, 42, 11),
		fakeState: EventStatesEnum.Canceled,
		fakeEventData: {
			eventTitle: 'OTRO CORDERITO SOLEADO',
			eventDescription: 'Cordero al fuego por tres horas con unas verduritas a la parrilla',
			eventParticipants: 10,
			eventParticipantLimit: 10,
			eventCook: 'Franco'
		}
	}
];

const StepItem = (props: IStepItem) => {
	return (
		<li className={styles.stepItem}>
			<img src={props.imagePath} alt="stepItem" />
			<h1>{props.title}</h1>
			<p>{props.description}</p>
		</li>
	);
};

export const EventHome = () => {
	const lang = useTranslation('eventHome');

	const itemStepsData = [
		{ title: lang.LogInTheApp.title, description: lang.LogInTheApp.description, imagePath: '/assets/pictures/joinAppLogo.png' },
		{ title: lang.joinToAnBarbecue.title, description: lang.joinToAnBarbecue.description, imagePath: '/assets/pictures/calendarLogo.png' },
		{ title: lang.letsEat.title, description: lang.letsEat.description, imagePath: '/assets/pictures/chickenLeg.png' }
	];
	return (
		<PrivateFormLayout>
			<div className={styles.content}>
				<section className={styles.header}>
					<h1>{lang.messageBanner}</h1>
					<Button kind="primary" size="large">
						{lang.newEventButton}
					</Button>
				</section>
				<section className={styles.incomingEvents}>
					<h1>{lang.incomingEvents}</h1>
					<div className={styles.underlineBlock}></div>
				</section>
				<section className={styles.eventsContainer}>
					{events.map(event => {
						//todo: hay que ordenar los eventos por fecha de realizacion
						return (
							<EventCard
								key={event.eventId}
								eventDateTime={event.fakeDate}
								eventState={event.fakeState as TEventState}
								eventData={event.fakeEventData}
							/>
						);
					})}
				</section>
				<section className={styles.participationInfo}>
					<img alt="sausages" src="/assets/pictures/sausages.png" />
					<div className={styles.description}>
						<h1>{lang.participationInfoTitle}</h1>
						<p>{lang.participationInfoDescription}</p>
						<Button kind="primary" size="large">
							{' '}
							{lang.moreAbout}{' '}
						</Button>
					</div>
				</section>
				<section className={styles.participationSteps}>
					<div className={styles.container}>
						<h2 className={styles.title}>{lang.participationStepsTitle}</h2>
						<p>{lang.participationStepsDescriptionPart1}</p>
						<ul className={styles.icons}>
							{itemStepsData.map((item, index) => (
								<StepItem key={`step-item-${index}`} title={item.title} description={item.description} imagePath={item.imagePath} />
							))}
						</ul>
						<p>{lang.participationStepsDescriptionPart2}</p>
						<div className={styles.participateButton}>
							<Button kind="primary" size="large">
								{lang.participateButton}
							</Button>
						</div>
					</div>
				</section>
			</div>
		</PrivateFormLayout>
	);
};
