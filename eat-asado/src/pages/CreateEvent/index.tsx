import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../stores/LocalizationContext';
import FormLayout from '../../components/macro/layout/FormLayout';
import Button from '../../components/micro/Button/Button';
import { createEvent, editEvent, getEventById } from '../../service';
import { useAuth } from '../../stores/AuthContext';
import { IEvent } from '../../models/event';
import { IUser } from '../../models/user';
import { EventStatesEnum } from '../../enums/EventState.enum';
import { useAlert } from '../../stores/AlertContext';
import { AlertTypes } from '../../components/micro/AlertPopup/AlertPopup';
import { getUserById } from '../../service';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './styles.module.scss';

export function CreateEvent(): JSX.Element {
	const navigate = useNavigate();
	const { eventIdParam } = useParams();
	const lang = useTranslation('createEvent');
	const { user } = useAuth();
	const { setAlert } = useAlert();
	const { setIsLoading } = useAuth();
	const [fullUser, setFullUser] = useState<IUser>();
	const [penalizationSection, setPenalizationSection] = useState<boolean>(false);
	const dateTimeRef = useRef<HTMLInputElement>(null);
	const [calendarState, setCalendarState] = useState<boolean>(false);

	const [event, setEvent] = useState<IEvent>({
		title: '',
		datetime: new Date(),
		description: '',
		memberLimit: 1,
		members: [],
		state: EventStatesEnum.AVAILABLE,
		organizer: user?.id || '',
		isChef: undefined,
		isShoppingDesignee: undefined,
		isPrivate: false,
		penalization: 0,
		penalizationStartDate: new Date()
	});

	function handleDinersChange(e: React.ChangeEvent<HTMLInputElement>) {
		let value = parseInt(e.target.value);
		let memberLimit = value;

		if (value >= 100) {
			memberLimit = 100;
		} else if (value <= 1) {
			memberLimit = 1;
		}
		setEvent({ ...event, memberLimit });
	}

	function handleGoBack(): void {
		navigate('/');
	}

	function handleCalendarVisibility(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		e.preventDefault();
		if (dateTimeRef.current) {
			setCalendarState(!calendarState);
			if (calendarState) {
				dateTimeRef.current.blur();
			} else {
				dateTimeRef.current.click();
			}
		}
	}

	function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		e.preventDefault();
		if (!event.description || !event.title) {
			setAlert(lang.completeAllInputs, AlertTypes.ERROR);
			return;
		}
		if (!fullUser?.alias && !fullUser?.cbu && !!event.isShoppingDesignee) {
			setAlert(lang.needToHaveCbu, AlertTypes.ERROR);
			return;
		}
		if (event.penalization && event.penalizationStartDate <= event.datetime) {
			setAlert(lang.wrongPenalizationDate, AlertTypes.ERROR);
			return;
		}
		if (event.penalization && Number(event.penalization) === 0) {
			console.log(event.penalization);
			setAlert(lang.wrongPenalizationDate, AlertTypes.ERROR);
			return;
		}
		setIsLoading(true);

		setEvent({ ...event, members: [fullUser as IUser], organizer: user?.id as string });

		if (eventIdParam === 'new') {
			createEvent(event)
				.then(res => {
					setAlert(`${lang.eventRegisteredConfirmation}!`, AlertTypes.SUCCESS);
					handleGoBack();
				})
				.catch(e => setAlert(`${e}`, AlertTypes.ERROR))
				.finally(() => setIsLoading(false));
		} else {
			editEvent(eventIdParam, event)
				.then(res => {
					setAlert(`${lang.eventUpdateConfirmation}!`, AlertTypes.SUCCESS);
				})
				.catch(e => setAlert(`${e}`, AlertTypes.ERROR))
				.finally(() => setIsLoading(false));
			setTimeout(() => {
				navigate(`/event/${eventIdParam}`);
			}, 1000);
		}
	}

	useEffect(() => {
		const abortController = new AbortController();

		getUserById(user?.id, abortController.signal)
			.then(setFullUser)
			.catch(e => {
				console.error('Catch in context: ', e);
				//setAlert(`${e}`, AlertTypes.ERROR);
			});

		return () => abortController.abort();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	useEffect(() => {
		setEvent({ ...event, members: [fullUser as IUser], organizer: user?.id as string });
		setPenalizationSection(!!event.penalization);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, fullUser]);

	useEffect(() => {
		if (eventIdParam === 'new') {
			return;
		}
		getEventById(eventIdParam)
			.then(({ title, datetime, description, memberLimit, isPrivate, penalization, penalizationStartDate, state }) => {
				setEvent({
					...event,
					title,
					datetime: new Date(datetime),
					description,
					memberLimit,
					isPrivate,
					penalization,
					penalizationStartDate: new Date(penalizationStartDate),
					state
				});
				setPenalizationSection(!!penalization);
			})
			.catch(e => {
				console.error('Catch in context: ', e);
			});
		setPenalizationSection(!!event.penalization);
	}, [eventIdParam]);

	return (
		<FormLayout>
			<button className={styles.closeBtn} onClick={handleGoBack}></button>

			<label className={styles.title}>{eventIdParam === 'new' ? lang.createEventTitle : lang.editEventTitle}</label>

			{/* TODO: Cambiar esto, no debe ser label un título */}

			<div className={styles.inputSection}>
				<section className={styles.firstColumn}>
					<label htmlFor="titleEvent" className={styles.fieldLabel}>
						{lang.eventName}
					</label>

					<input
						id="titleEvent"
						placeholder={lang.eventName}
						type="text"
						value={event.title}
						onChange={e => {
							setEvent({ ...event, title: e.target.value });
						}}
					/>

					<label htmlFor="fechaHora" className={styles.fieldLabel}>
						{lang.dateTime}
					</label>

					<div className={styles.calendarPicker}>
						<input
							id="fechaHora"
							placeholder="Fecha y Hora"
							type="datetime-local"
							value={event.datetime.toISOString().slice(0, -8)}
							onChange={e => {
								const inputValue = e.target.value;
								if (!inputValue) {
									return;
								}

								const localDate = new Date(inputValue);

								// Verifica si el valor se ha convertido en una fecha válida
								if (!isNaN(localDate.getTime())) {
									const utcOffset = localDate.getTimezoneOffset();
									const adjustedDate = new Date(localDate.getTime() - utcOffset * 60000);
									setEvent({ ...event, datetime: adjustedDate });
								} else {
									console.error('Invalid Date:', inputValue);
								}
							}}
						/>
						<span className={styles.calendarLogo}></span>
					</div>

					<label htmlFor="descripcion" className={styles.fieldLabel}>
						{lang.eventDescription}
					</label>

					<textarea
						id="descripcion"
						name="descripcion"
						className={styles.textArea}
						placeholder={lang.eventDescription}
						value={event.description}
						onChange={({ target: { value } }) => {
							setEvent({ ...event, description: value });
						}}
					/>
				</section>

				<section className={styles.secondColumn}>
					{eventIdParam === 'new' && (
						<section className={styles.checkboxesContainer}>
							<div className={styles.internalTitle}>
								<label className={styles.title}>{lang.rolesTitle}</label>
								<span className={styles.extraDescription}>{lang.optionalDescription}</span>
							</div>

							<label htmlFor="isAsador" className={styles.fieldLabel}>
								<input
									id="isAsador"
									type="checkbox"
									className={styles.checkbox}
									checked={event.isChef !== undefined}
									onChange={({ target: { checked } }) => {
										setEvent({ ...event, isChef: checked ? (user?.id as string) : undefined });
									}}
								/>
								{lang.chef}
							</label>

							<label htmlFor="isEncargadoCompras" className={styles.fieldLabel}>
								<input
									id="isEncargadoCompras"
									type="checkbox"
									className={styles.checkbox}
									checked={event.isShoppingDesignee !== undefined ? true : false}
									onChange={({ target: { checked } }) => {
										setEvent({ ...event, isShoppingDesignee: checked ? (user?.id as string) : undefined });
									}}
								/>
								{lang.shoppingDesignee}
							</label>
						</section>
					)}

					<section className={styles.rangeSelectionContainer}>
						<label htmlFor="diners" className={styles.fieldLabel}>
							{lang.memberLimit}
						</label>

						<input
							id="dinersRange"
							type="range"
							min={1}
							max={100}
							list="dinersMarkers"
							step={1}
							value={event.memberLimit}
							onChange={handleDinersChange}
						/>

						<input
							id="dinersQuantity"
							className={styles.dinersQuantity}
							type="number"
							value={event.memberLimit}
							max={100}
							min={0}
							onChange={handleDinersChange}
						/>

						<datalist id="dinersMarkers">
							<option value="0" label="0" />
							<option value="25" label="25" />
							<option value="50" label="50" />
							<option value="75" label="75" />
							<option value="100" label="100" />
						</datalist>
					</section>
					<section className={styles.checkboxesContainer}>
						<label htmlFor="isPrivate" className={styles.fieldLabel}>
							<input
								id="isPrivate"
								type="checkbox"
								className={styles.checkbox}
								checked={event.isPrivate}
								onChange={({ target: { checked } }) => {
									setEvent({ ...event, isPrivate: checked });
								}}
							/>
							{lang.isPrivate}
						</label>
						<label htmlFor="hasPenalization" className={styles.fieldLabel}>
							<input
								id="hasPenalization"
								type="checkbox"
								className={styles.checkbox}
								checked={penalizationSection}
								onChange={e => {
									penalizationSection && setEvent({ ...event, penalization: 0 });
									setPenalizationSection(!penalizationSection);
								}}
							/>
							{lang.hasPenalization}
						</label>
						{penalizationSection && (
							<div className={styles.hiddenPenalizationOptions}>
								<div className={styles.penalizationAmount}>
									<p className={styles.penalizationInputText}>{lang.amountPenalization}</p>
									<input
										id="dinersQuantity"
										className={styles.penalizationAmountInput}
										type="number"
										value={event.penalization}
										min={1}
										max={10000}
										onChange={({ target: { value } }) => setEvent({ ...event, penalization: Number(value) })}
									/>
								</div>
								<div className={styles.calendarPicker}>
									<p className={styles.penalizationInputText}>{lang.penalizationStartingDate}</p>
									<button className={styles.calendarLogo} onClick={handleCalendarVisibility}></button>
									<input
										id="fechaHora"
										placeholder="Fecha y Hora"
										type="datetime-local"
										ref={dateTimeRef}
										className={styles.calendarInput}
										value={event.penalizationStartDate.toISOString().slice(0, -8)}
										onChange={({ target: { value } }) => {
											const inputValue = value;
											if (inputValue) {
												const localDate = new Date(inputValue);
												// Verifica si el valor se ha convertido en una fecha válida
												if (!isNaN(localDate.getTime())) {
													const utcOffset = localDate.getTimezoneOffset();
													const adjustedDate = new Date(localDate.getTime() - utcOffset * 60000);
													setEvent({ ...event, penalizationStartDate: adjustedDate });
												} else {
													console.error('Invalid Date:', inputValue);
												}
											}
										}}
									/>
								</div>
							</div>
						)}
					</section>
				</section>

				<section className={styles.buttonContainer}>
					{eventIdParam === 'new' ? (
						<Button kind="primary" size="large" id="registerBtn" type="submit" style={{ marginBottom: '10vh' }} onClick={handleSubmit}>
							{lang.createEventBtn}
						</Button>
					) : (
						<Button kind="primary" size="large" id="registerBtn" type="submit" style={{ marginBottom: '10vh' }} onClick={handleSubmit}>
							{lang.editEventBtn}
						</Button>
					)}
				</section>
			</div>
		</FormLayout>
	);
}
