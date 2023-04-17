import { useTranslation } from '../../stores/LocalizationContext';
import styles from './styles.module.scss';
import Button from '../../components/micro/Button/Button';
import FormLayout from '../../components/macro/layout/FormLayout';
import { useState } from 'react';

export function Register(): JSX.Element {
	const lang = useTranslation('register');
	const initialState = {
		name: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
		isVegan: false,
		isVegetarian: false,
		isHypertensive: false,
		isCeliac: false
	};

	const [register, setRegister] = useState(initialState);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRegister({
			...register,
			[e.target.id]: e.target.value
		});
	};

	const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRegister({
			...register,
			[e.target.id]: e.target.checked
		});
	};

	return (
		//todo: meter todos los inputs y label adentro de un contenedor para manipular mejor el ancho y luego aplicar grid en desk
		<FormLayout>
			<div className={styles.closeBtn}></div>
			<label className={styles.title}>{lang.registerTitle}</label>
			<div className={styles.inputSection}>
				<section className={styles.firstColumn}>
					<label htmlFor="name" className={styles.registerLabel}>
						{lang.name}
					</label>
					<input id="name" className={styles.registerInput} placeholder={lang.name} type="text" onChange={handleChange} />
					<label htmlFor="lastName" className={styles.registerLabel}>
						{lang.lastName}
					</label>
					<input id="lastName" className={styles.registerInput} placeholder={lang.lastName} type="text" onChange={handleChange} />
					<label htmlFor="email" className={styles.registerLabel}>
						{lang.email}
					</label>
					<input id="email" className={styles.registerInput} placeholder={lang.emailPlaceholder} type="text" onChange={handleChange} />
					<span className={styles.inputDescription}>{lang.emailDescription}</span>
				</section>
				<section className={styles.secondColumn}>
					<label htmlFor="password" className={styles.registerLabel}>
						{lang.password}
					</label>
					<input id="password" className={styles.registerInput} placeholder={lang.password} type="password" onChange={handleChange} />
					<span className={styles.inputDescription}>{lang.passwordDescription}</span>
					<label htmlFor="confirmPassword" className={styles.registerLabel}>
						{lang.confirmPassword}
					</label>
					<input
						id="confirmPassword"
						className={styles.registerInput}
						placeholder={lang.password}
						type="password"
						onChange={handleChange}
					/>
					<section className={styles.checkboxesContainer}>
						<div className={styles.internalTitle}>
							<label className={styles.title}>{lang.specialDiet}</label>
							<span className={styles.extraDescription}>{lang.specialDietOptional}</span>
						</div>
						<label className={styles.registerLabel}>
							<input id="isVegan" type="checkbox" className={styles.checkbox} checked={register.isVegan} onChange={handleCheckbox} />
							{lang.veganDiet}
						</label>

						<label className={styles.registerLabel}>
							<input
								id="isVegetarian"
								type="checkbox"
								className={styles.checkbox}
								checked={register.isVegetarian}
								onChange={handleCheckbox}
							/>
							{lang.vegetarianDiet}
						</label>

						<label className={styles.registerLabel}>
							<input
								id="isHypertensive"
								type="checkbox"
								className={styles.checkbox}
								checked={register.isHypertensive}
								onChange={handleCheckbox}
							/>
							{lang.hypertensiveDiet}
						</label>
						<label className={styles.registerLabel}>
							<input id="isCeliac" type="checkbox" className={styles.checkbox} checked={register.isCeliac} onChange={handleCheckbox} />
							{lang.celiacDiet}
						</label>
					</section>
				</section>
				<section className={styles.buttonContainer}>
					<Button
						kind="primary"
						size="large"
						id="registerBtn"
						onClick={e => {
							e.preventDefault();
							console.log(register);
						}}>
						{lang.registerBtn}
					</Button>
				</section>
			</div>
		</FormLayout>
	);
}
