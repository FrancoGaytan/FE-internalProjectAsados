import { useState } from 'react';
import { useTranslation } from '../../stores/LocalizationContext';
import FormLayout from '../../components/macro/layout/FormLayout';
import Button from '../../components/micro/Button/Button';
import styles from './styles.module.scss';
import { createEvent } from '../../service';
import { useAuth } from '../../stores/AuthContext';
import { IEvent } from '../../models/event';
import { EventStatesEnum } from '../../enums/EventState.enum';
import { IUser } from '../../models/user';
import { useAlert } from '../../stores/AlertContext';
import { AlertTypes } from '../../components/micro/AlertPopup/AlertPopup';

export function CreateEvent(): JSX.Element {
	const lang = useTranslation('createEvent');
	const { user } = useAuth();
	const { setAlert } = useAlert();

	const initialEvent: IEvent = {
		title: '',
		datetime: new Date(),
		description: '',
		memberLimit: 0,
		members: [Number(user?.id)],
		state: EventStatesEnum.AVAILABLE,
		organizer: Number(user?.id),
		isChef: false,
		isShoppingDesignee: false
	};

	console.log(initialEvent);
	console.log(user);

	const [event, setEvent] = useState<IEvent>(initialEvent);

	const handleDinersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = parseInt(e.target.value);
		if (value >= 100) {
			setEvent({ ...event, memberLimit: 100 });
		} else if (value <= 0) {
			setEvent({ ...event, memberLimit: 0 });
		} else {
			setEvent({ ...event, memberLimit: value });
		}
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		createEvent(event)
			.then(e => {
				console.log(e);
				setAlert(`${lang.eventRegisteredConfirmation}!`, AlertTypes.SUCCESS);
			})
			.catch(() => setAlert(`${lang.eventRegistrationFailure}`, AlertTypes.ERROR));
	};

	return (
		<FormLayout>
			<div className={styles.closeBtn}></div>
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
						value={event.datetime.toDateString()}
						onChange={e => {
							setEvent({ ...event, datetime: new Date(e.target.value) });
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
								checked={event.isChef}
								onChange={e => {
									setEvent({ ...event, isChef: e.target.checked });
								}}
							/>
							{lang.chef}
						</label>
						<label htmlFor="isEncargadoCompras" className={styles.fieldLabel}>
							<input
								id="isEncargadoCompras"
								type="checkbox"
								className={styles.checkbox}
								checked={event.isShoppingDesignee}
								onChange={e => {
									setEvent({ ...event, isShoppingDesignee: e.target.checked });
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
