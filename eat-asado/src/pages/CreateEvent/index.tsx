import { useEffect, useState } from 'react';
import { useTranslation } from '../../stores/LocalizationContext';
import FormLayout from '../../components/macro/layout/FormLayout';
import Button from '../../components/micro/Button/Button';
import { createEvent } from '../../service';
import { useAuth } from '../../stores/AuthContext';
import { IEvent } from '../../models/event';
import { IUser } from '../../models/user';
import { EventStatesEnum } from '../../enums/EventState.enum';
import { useAlert } from '../../stores/AlertContext';
import { AlertTypes } from '../../components/micro/AlertPopup/AlertPopup';
import { getUserById } from '../../service';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';

export function CreateEvent(): JSX.Element {
	const navigate = useNavigate();
	const lang = useTranslation('createEvent');
	const { user } = useAuth();
	const { setAlert } = useAlert();
	const { setIsLoading } = useAuth();
	const [fullUser, setFullUser] = useState<IUser>();

	/* Acá habia una variable `initialEvent`. Esas variables están buenas cuando necesitas reiniciar el estado de un componente, pero en este caso no es necesario.
	Asi que moví la inicializaciond el estado event al useState directamente. */
	const [event, setEvent] = useState<IEvent>({
		title: '',
		datetime: new Date(),
		description: '',
		memberLimit: 0,
		members: [],
		state: EventStatesEnum.AVAILABLE,
		organizer: user ? user.id : '',
		isChef: undefined,
		isShoppingDesignee: undefined
	});

	function handleDinersChange(e: React.ChangeEvent<HTMLInputElement>) {
		let value = parseInt(e.target.value);
		if (value >= 100) {
			setEvent({ ...event, memberLimit: 100 });
		} else if (value <= 0) {
			setEvent({ ...event, memberLimit: 0 });
		} else {
			setEvent({ ...event, memberLimit: value });
		}
	}

	function handleGoBack(): void {
		navigate('/');
	}

	function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		e.preventDefault();
		setIsLoading(true);

		setEvent({ ...event, members: [fullUser as IUser], organizer: user?.id as string });

		createEvent(event)
			.then(res => {
				setAlert(`${lang.eventRegisteredConfirmation}!`, AlertTypes.SUCCESS);
				handleGoBack();
			})
			.catch(e => setAlert(`${e}`, AlertTypes.ERROR))
			.finally(() => setIsLoading(false));
	}

	useEffect(() => {
		const abortController = new AbortController();

		getUserById(user?.id, abortController.signal)
			.then(res => {
				setFullUser(res);
			})
			.catch(e => {
				console.error('Catch in context: ', e);
				//setAlert(`${e}`, AlertTypes.ERROR);
			});

		return () => abortController.abort();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	useEffect(() => {
		setEvent({ ...event, members: [fullUser as IUser], organizer: user?.id as string });

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, fullUser]);


	return (
		<FormLayout>
			<button className={styles.closeBtn} onClick={handleGoBack}></button>

			{/* TODO: Esto está semánitcamente mal. Los labels no deberian ser titulos. */}
			<label className={styles.title}>{lang.createEventTitle}</label>

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

					<input
						id="fechaHora"
						placeholder="Fecha y Hora"
						type="datetime-local"
						value={event.datetime.toISOString().slice(0, -8)}
						onChange={e => {
							const inputValue = e.target.value;
							if (inputValue) {
								const localDate = new Date(inputValue);

								// Verifica si el valor se ha convertido en una fecha válida
								if (!isNaN(localDate.getTime())) {
									// Comprobar si localDate es válido
									const utcOffset = localDate.getTimezoneOffset();
									const adjustedDate = new Date(localDate.getTime() - utcOffset * 60000);
									setEvent({ ...event, datetime: adjustedDate });
								} else {
									// Manejo de errores opcional
									console.error('Fecha no válida:', inputValue);
								}
							}
						}}
					/>

					<label htmlFor="descripcion" className={styles.fieldLabel}>
						{lang.eventDescription}
					</label>

					<textarea
						id="descripcion"
						name="descripcion"
						className={styles.textArea}
						placeholder={lang.eventDescription}
						value={event.description}
						onChange={e => {
							setEvent({ ...event, description: e.target.value });
						}}
					/>
				</section>

				<section className={styles.secondColumn}>
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
								checked={event.isChef !== undefined ? true : false}
								onChange={e => {
									setEvent({ ...event, isChef: e.target.checked ? (user?.id as string) : undefined });
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
								onChange={e => {
									setEvent({ ...event, isShoppingDesignee: e.target.checked ? (user?.id as string) : undefined });
								}}
							/>
							{lang.shoppingDesignee}
						</label>
					</section>

					<section className={styles.rangeSelectionContainer}>
						<label htmlFor="diners" className={styles.fieldLabel}>
							{lang.memberLimit}
						</label>

						<input
							id="dinersRange"
							type="range"
							min={0}
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
				</section>

				<section className={styles.buttonContainer}>
					<Button
						kind="primary"
						size="large"
						id="registerBtn"
						type="submit"
						style={{ marginBottom: '10vh' }}
						onClick={e => {
							handleSubmit(e);
						}}>
						{lang.createEventBtn}
					</Button>
				</section>
			</div>
		</FormLayout>
	);
}
