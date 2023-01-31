import { useTranslation } from '../../stores/LocalizationContext';
import FormLayout from '../../Components/macro/layout/FormLayout';
import styles from './styles.module.scss';
import Button from '../../Components/micro/Button/Button';
import React, { useEffect, useState } from 'react';

const CreateEvent = () => {
	const initialEvent = {
		name: '',
		dateAndHour: '',
		description: '',
		isCook: false,
		isBuyer: false,
		diners: 0
	};

	const [hidden, setHidden] = useState(true);
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

	const handleHiddenRange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEvent({ ...event, isCook: e.target.checked });
		setHidden(!e.target.checked);
	};

	const handleSubmit = () => {
		console.log(event);
	};

	return (
		<FormLayout>
			<div className={styles.closeBtn}></div>
			<label className={styles.title}>Crear Evento</label>
			<div className={styles.inputSection}>
				<section className={styles.column}>
					<label htmlFor="nombreEvento" className={styles.fieldLabel}>
						Nombre del Evento (opcional)
					</label>
					<input
						id="nombreEvento"
						placeholder="Nombre del Evento (opcional)"
						type="text"
						value={event.name}
						onChange={e => {
							setEvent({ ...event, name: e.target.value });
						}}
					/>
					<label htmlFor="fechaHora" className={styles.fieldLabel}>
						Fecha y Hora
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
						Descripción
					</label>
					<textarea
						id="descripcion"
						name="descripcion"
						className={styles.textArea}
						placeholder="Descripción"
						value={event.description}
						onChange={e => {
							setEvent({ ...event, description: e.target.value });
						}}
					/>
				</section>
				<section className={styles.column}>
					<section className={styles.checkboxesContainer}>
						<div className={styles.internalTitle}>
							<label className={styles.title}>Roles</label>
							<span className={styles.extraDescription}>(opcional)</span>
						</div>
						<label htmlFor="isAsador" className={styles.fieldLabel}>
							<input id="isAsador" type="checkbox" className={styles.checkbox} checked={event.isCook} onChange={handleHiddenRange} />
							Asador
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
							Encargado de Compras
						</label>
					</section>
					<section className={styles.rangeSelectionContainer} hidden={hidden}>
						<label htmlFor="diners" className={styles.fieldLabel}>
							Cantidad Máxima de Comensales
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
				</section>
			</div>
			<Button
				kind="primary"
				size="large"
				id="registerBtn"
				style={{ marginBottom: "10vh" }}
				onClick={e => {
					e.preventDefault();
					handleSubmit();
				}}>
				CREAR EVENTO
			</Button>
		</FormLayout>
	);
};

export default CreateEvent;
