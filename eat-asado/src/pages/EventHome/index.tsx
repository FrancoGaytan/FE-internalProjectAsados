import { useMemo } from 'react';
import PrivateFormLayout from '../../components/macro/layout/PrivateFormLayout';
import Button from '../../components/micro/Button/Button';
import { useTranslation } from '../../stores/LocalizationContext';
import styles from './styles.module.scss';
import EventCard from '../../components/macro/EventCard/EventCard';
import { TEventState } from '../../types/eventState';
import { eventsDataMock } from '../../mocks/eventsMockedData';

interface IStepItem {
	title: string;
	description: string;
	imagePath: string;
}

export function EventHome(): JSX.Element {
	const lang = useTranslation('eventHome');

	const itemStepsData = useMemo(
		() => [
			{ title: lang.LogInTheApp.title, description: lang.LogInTheApp.description, imagePath: '/assets/pictures/joinAppLogo.png' },
			{ title: lang.joinToAnBarbecue.title, description: lang.joinToAnBarbecue.description, imagePath: '/assets/pictures/calendarLogo.png' },
			{ title: lang.letsEat.title, description: lang.letsEat.description, imagePath: '/assets/pictures/chickenLeg.png' }
		],
		[lang]
	);

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
					{eventsDataMock.map(event => {
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
}

function StepItem(props: IStepItem) {
	return (
		<li className={styles.stepItem}>
			<img src={props.imagePath} alt="stepItem" />
			<h1>{props.title}</h1>
			<p>{props.description}</p>
		</li>
	);
}
