import { useEffect, useMemo, useState } from 'react';
import PrivateFormLayout from '../../components/macro/layout/PrivateFormLayout';
import Button from '../../components/micro/Button/Button';
import { useTranslation } from '../../stores/LocalizationContext';
import EventCard from '../../components/macro/EventCard/EventCard';
import { TEventState } from '../../types/eventState';
import { useEvent } from '../../stores/EventContext';
import { useNavigate } from 'react-router-dom';
import { getPublicAndPrivateEvents, getPublicEvents, isUserDebtor } from '../../service';
import { useAuth } from '../../stores/AuthContext';
import styles from './styles.module.scss';

interface IStepItem {
	title: string;
	description: string;
	imagePath: string;
}

export function EventHome(): JSX.Element {
	const lang = useTranslation('eventHome');
	const { publicEvents } = useEvent();
	const { setPublicEvents } = useEvent();
	const navigate = useNavigate();
	const [userDebtor, setUserDebtor] = useState('null');
	const [isScrolling, setIsScrolling] = useState(false);

	const { user } = useAuth();

	const itemStepsData = useMemo(
		() => [
			{ title: lang.LogInTheApp.title, description: lang.LogInTheApp.description, imagePath: '/assets/pictures/joinAppLogo.png' },
			{ title: lang.joinToAnBarbecue.title, description: lang.joinToAnBarbecue.description, imagePath: '/assets/pictures/calendarLogo.png' },
			{ title: lang.letsEat.title, description: lang.letsEat.description, imagePath: '/assets/pictures/chickenLeg.png' }
		],
		[lang]
	);

	const handleScrollToEnd = () => {
		window.scrollTo({
			top: document.body.scrollHeight,
			behavior: 'smooth'
		});
		setIsScrolling(true);
	};

	const handleScrollToStart = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
		setIsScrolling(true);
	};

	/**
	 * Fetches the public events when page initialize.
	 */
	useEffect(() => {
		if (user) {
			getPublicAndPrivateEvents()
				.then(res => {
					setPublicEvents(res);
				})
				.catch(e => {
					console.error('Catch in context: ', e);
				});
		} else {
			getPublicEvents()
				.then(res => {
					setPublicEvents(res);
				})
				.catch(e => {
					console.error('Catch in context: ', e);
				});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	useEffect(() => {
		if (!user) {
			return;
		}
		isUserDebtor(user?.id as string)
			.then(res => {
				setUserDebtor(res.eventId);
			})
			.catch(e => {
				console.error('Catch in context: ', e);
			});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	return (
		<PrivateFormLayout>
			<div className={styles.content}>
				<section className={styles.header}>
					<h1>{lang.messageBanner}</h1>

					<Button kind="primary" size="large" onClick={!!user?.id ? () => navigate('/createEvent') : () => navigate('/login')}>
						{lang.newEventButton}
					</Button>
				</section>

				<section className={styles.incomingEvents}>
					{/* TODO: Ya lo puse en otro archivo pero va de nuevo: NO debería haber dos h1 en una misma página. */}
					<h1>{lang.incomingEvents}</h1>

					<div className={styles.underlineBlock}></div>
				</section>

				<section className={styles.eventsContainer}>
					{publicEvents.map(event => {
						return (
							<EventCard
								key={event._id}
								eventId={event._id}
								eventDateTime={event.datetime}
								eventUserIsDebtor={userDebtor}
								userId={user?.id}
								eventState={event.state as TEventState}
								eventData={{
									eventTitle: event.title,
									eventCook: event.chef,
									eventDescription: event.description,
									eventParticipants: event.members,
									eventParticipantLimit: event.memberLimit
								}}
							/>
						);
					})}
				</section>

				<section className={styles.participationInfo}>
					<img alt="sausages" src="/assets/pictures/pictureEvent.jpg" />

					<div className={styles.description}>
						<h1>{lang.participationInfoTitle}</h1>

						<p>{lang.participationInfoDescription}</p>

						<Button kind="primary" size="large" onClick={handleScrollToEnd}>
							{' '}
							{lang.moreAbout}{' '}
						</Button>
					</div>
				</section>

				<section className={styles.participationSteps}>
					<div className={styles.container}>
						<h2 className={styles.title}>{lang.participationStepsTitle}</h2>

						<ul className={styles.icons}>
							{itemStepsData.map((item, index) => (
								<StepItem key={`step-item-${index}`} title={item.title} description={item.description} imagePath={item.imagePath} />
							))}
						</ul>

						<p>{lang.participationStepsDescriptionPart2}</p>

						<div className={styles.participateButton}>
							<Button kind="primary" size="large" onClick={handleScrollToStart}>
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
