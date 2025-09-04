import { JSX, useEffect, useMemo, useState } from 'react';
import PrivateFormLayout from '../../components/macro/layout/PrivateFormLayout';
import Button from '../../components/micro/Button/Button';
import { useTranslation } from '../../stores/LocalizationContext';
import EventCard from '../../components/macro/EventCard/EventCard';
import { TEventState } from '../../types/eventState';
import { useEvent } from '../../stores/EventContext';
import { useNavigate } from 'react-router-dom';
import { getPublicAndPrivateEvents, getPublicEvents, hasPendingTransfers, isUserDebtor } from '../../service';
import { useAuth } from '../../stores/AuthContext';
import ImageSlider from '../../components/macro/Slider/ImageSlider';
import { eventImages } from '../../utils/eventImages';
import styles from './styles.module.scss';
import { AlertTypes } from '../../components/micro/AlertPopup/AlertPopup';
import { useAlert } from '../../stores/AlertContext';
import Modal from '../../components/macro/Modal/Modal';
import PendingApprovalWarning from '../../components/macro/PendingApprovalWarning/PendingApprovalWarning';

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
	const [userDebtor, setUserDebtor] = useState<string[]>([]);
	const [isScrolling, setIsScrolling] = useState(false);
	const { setAlert } = useAlert();
	const [modalPendingTransfer, setModalPendingTransfer] = useState<string[]>([]);

	const { user } = useAuth();

	const itemStepsData = useMemo(
		() => [
			{ title: lang.LogInTheApp.title, description: lang.LogInTheApp.description, imagePath: '/assets/pictures/joinAppLogo.png' },
			{ title: lang.joinToAnBarbecue.title, description: lang.joinToAnBarbecue.description, imagePath: '/assets/pictures/calendarLogo.png' },
			{ title: lang.letsEat.title, description: lang.letsEat.description, imagePath: '/assets/pictures/chickenLeg.png' }
		],
		[lang]
	);

	const goToFaq = () => {
		navigate('/faq');
	};

	const handleScrollToStart = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
		setIsScrolling(true);
	};

	function closeModalPendingTransfer(): void {
		setModalPendingTransfer([]);
	}

	/**
	 * Fetches the public events when page initialize.
	 */
	useEffect(() => {
		if (user !== null) {
			getPublicAndPrivateEvents()
				.then(res => {
					setTimeout(() => {
						setPublicEvents(res);
					}, 200);
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
				setUserDebtor(res);
			})
			.catch(e => {
				console.error('Catch in context: ', e);
			});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	useEffect(() => {
		if (!user) {
			return;
		}
		hasPendingTransfers(user?.id as string)
			.then((res: Array<string>) => {
				setModalPendingTransfer(res);
			})
			.catch(e => {
				console.error('Catch in context: ', e);
			});
	}, [user]);

	useEffect(() => {
		const fetchLatestData = () => {
			if (user !== null) {
				getPublicAndPrivateEvents()
					.then(res => {
						setTimeout(() => {
							setPublicEvents(res);
						}, 200);
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
		};
		// Llamada periódica cada 3 minutos
		const interval = setInterval(() => {
			if (document.visibilityState === 'visible') {
				fetchLatestData();
			}
		}, 180000);

		// También actualiza al volver a la pestaña
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				fetchLatestData();
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			clearInterval(interval);
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, []);
	return (
		<>
			<PrivateFormLayout>
				<div className={styles.content} data-testid="eventhome-content">
					<section className={styles.header} data-testid="eventhome-header">
						<Button
							kind="primary"
							size="large"
							onClick={!!user?.id ? () => navigate('/createEvent/new') : () => navigate('/login')}
							disabled={userDebtor?.length > 0}>
							{lang.newEventButton}
						</Button>
					</section>

					<section className={styles.incomingEvents} data-testid="eventhome-incoming-events">
						{/* TODO: Ya lo puse en otro archivo pero va de nuevo: NO debería haber dos h1 en una misma página. */}
						<h1>{lang.incomingEvents}</h1>

						<div className={styles.underlineBlock} data-testid="eventhome-underline-block"></div>
					</section>

					<section className={styles.eventsContainer} data-testid="eventhome-events-container">
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
										eventShoppingDesignees: event.shoppingDesignee ?? [],
										eventDescription: event.description,
										eventParticipants: event.members,
										eventParticipantLimit: event.memberLimit,
										eventAvgRate: event.ratings.avgScore,
										eventRatingsAmount: event.ratings.ratingsAmount
									}}
								/>
							);
						})}
					</section>

					<section className={styles.participationInfo} data-testid="eventhome-participation-info">
						<ImageSlider images={eventImages} altText="Event image" />

						<div className={styles.description} data-testid="eventhome-description">
							<h1>{lang.participationInfoTitle}</h1>

							<p>{lang.participationInfoDescription}</p>
							<div className={styles.buttonContainer} data-testid="eventhome-description-btn-container">
								<Button kind="primary" size="large" onClick={goToFaq}>
									{' '}
									{lang.moreAbout}{' '}
								</Button>
							</div>
						</div>
					</section>

					<section className={styles.participationSteps} data-testid="eventhome-participation-steps">
						<div className={styles.container} data-testid="eventhome-steps-container">
							<h2 className={styles.title}>{lang.participationStepsTitle}</h2>

							<ul className={styles.icons} data-testid="eventhome-steps-icons">
								{itemStepsData.map((item, index) => (
									<StepItem
										key={`step-item-${index}`}
										title={item.title}
										description={item.description}
										imagePath={item.imagePath}
									/>
								))}
							</ul>

							<p>{lang.participationStepsDescriptionPart2}</p>

							<div className={styles.participateButton} data-testid="eventhome-participate-btn-container">
								<Button kind="primary" size="large" onClick={handleScrollToStart}>
									{lang.participateButton}
								</Button>
							</div>
						</div>
					</section>
				</div>
			</PrivateFormLayout>
			<Modal isOpen={modalPendingTransfer.length > 0} closeModal={closeModalPendingTransfer}>
				<PendingApprovalWarning eventId={modalPendingTransfer[0] as string} closeModal={closeModalPendingTransfer} />
			</Modal>
		</>
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
