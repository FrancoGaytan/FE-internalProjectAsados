import { useState } from 'react';
import { useTranslation } from '../../stores/LocalizationContext';
import FormLayout from '../../components/macro/layout/FormLayout';
import Button from '../../components/micro/Button/Button';
import styles from './styles.module.scss';

export function CreateEvent(): JSX.Element {
	const lang = useTranslation('createEvent');
	const initialEvent = {
		name: '',
		dateAndHour: '',
		description: '',
		isCook: false,
		isBuyer: false,
		diners: 0
	};

	const [event, setEvent] = useState(initialEvent);

	const handleDinersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = parseInt(e.target.value);
		if (value >= 100) {
			setEvent({ ...event, diners: 100 });
		} else if (value <= 0) {
			setEvent({ ...event, diners: 0 });
		} else {
			setEvent({ ...event, diners: value });
		}
	};

	const handleSubmit = () => {
		console.log(event);
	};

	return (
		<FormLayout>
			<div className={styles.closeBtn}></div>
			<label className={styles.title}>{lang.createEventTitle}</label>
			<div className={styles.inputSection}>
				<section className={styles.firstColumn}>
					<label htmlFor="nombreEvento" className={styles.fieldLabel}>
						{lang.eventName}
					</label>
					<input
						id="nombreEvento"
						placeholder={lang.eventName}
						type="text"
						value={event.name}
						onChange={e => {
							setEvent({ ...event, name: e.target.value });
						}}
					/>
					<label htmlFor="fechaHora" className={styles.fieldLabel}>
						{lang.dateTime}
					</label>
					<input
						id="fechaHora"
						placeholder="Fecha y Hora"
						type="datetime-local"
						value={event.dateAndHour}
						onChange={e => {
							setEvent({ ...event, dateAndHour: e.target.value });
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
								checked={event.isCook}
								onChange={e => {
									setEvent({ ...event, isCook: e.target.checked });
								}}
							/>
							{lang.chef}
						</label>
						<label htmlFor="isEncargadoCompras" className={styles.fieldLabel}>
							<input
								id="isEncargadoCompras"
								type="checkbox"
								className={styles.checkbox}
								checked={event.isBuyer}
								onChange={e => {
									setEvent({ ...event, isBuyer: e.target.checked });
								}}
							/>
							{lang.shoppingDesignee}
						</label>
					</section>
					{event.isCook && (
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
								value={event['diners']}
								onChange={handleDinersChange}
							/>
							<input
								id="dinersQuantity"
								className={styles.dinersQuantity}
								type="number"
								value={event['diners']}
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
					)}
				</section>
				<section className={styles.buttonContainer}>
					<Button
						kind="primary"
						size="large"
						id="registerBtn"
						type="submit"
						style={{ marginBottom: '10vh' }}
						onClick={e => {
							e.preventDefault();
							handleSubmit();
						}}>
						{lang.createEventBtn}
					</Button>
				</section>
			</div>
		</FormLayout>
	);
}
