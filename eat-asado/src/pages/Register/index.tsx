import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../stores/LocalizationContext';
import { RegisterRequest } from '../../models/user';
import { register } from '../../service';
import Button from '../../components/micro/Button/Button';
import FormLayout from '../../components/macro/layout/FormLayout';
import styles from './styles.module.scss';
import { useAuth } from '../../stores/AuthContext';

interface ISpecialDiet {
	name: string;
	value: boolean;
}

export function Register(): JSX.Element {
	const lang = useTranslation('register');
	const navigate = useNavigate();
	const { login, isLoading, setIsLoading } = useAuth();
	const [checkboxes, setCheckboxes] = useState<ISpecialDiet[]>([
		{ name: 'vegan', value: false },
		{ name: 'vegetarian', value: false },
		{ name: 'celiac', value: false },
		{ name: 'hypertensive', value: false }
	]);

	// FIXME: El registro espera "cbu" y "alias" pero en el diseño no están esos campos.
	const [inputData, setInputData] = useState<RegisterRequest>({
		name: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
		specialDiet: [],
		cbu: '',
		alias: '',
		profilePicture: 'asd'
	});

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setInputData({
			...inputData,
			[e.target.id]: e.target.value
		});
	}

	function handleCheckbox(id: string) {
		setCheckboxes(checkboxes.map(item => (id === item.name ? { ...item, value: !item.value } : item)));
	}

	//TODO: Falta hacer las validaciones de los campos.
	function registerUser() {
		setIsLoading(true);
		register(inputData)
			.then(() => login(inputData.email, inputData.password))
			.catch(e => console.error(e))
			.finally(() => setIsLoading(false));
	}

	useEffect(() => {
		setInputData({ ...inputData, specialDiet: checkboxes.filter((checkbox: ISpecialDiet) => !!checkbox.value).map(item => item.name) });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkboxes]);

	return (
		<FormLayout>
			<div className={styles.closeBtn} onClick={() => navigate('/')}></div>

			<label className={styles.title}>{lang.registerTitle}</label>

			<div className={styles.inputSection}>
				<section className={styles.firstColumn}>
					<label htmlFor="name" className={styles.registerLabel}>
						{lang.name}
					</label>

					<input
						id="name"
						className={styles.registerInput}
						placeholder={lang.name}
						type="text"
						onChange={e => handleChange(e)}
						value={inputData.name}
					/>

					<label htmlFor="lastName" className={styles.registerLabel}>
						{lang.lastName}
					</label>

					<input
						id="lastName"
						className={styles.registerInput}
						placeholder={lang.lastName}
						type="text"
						onChange={e => handleChange(e)}
						value={inputData.lastName}
					/>

					<label htmlFor="email" className={styles.registerLabel}>
						{lang.email}
					</label>

					<input
						id="email"
						className={styles.registerInput}
						placeholder={lang.emailPlaceholder}
						type="text"
						onChange={e => handleChange(e)}
						value={inputData.email}
					/>

					<span className={styles.inputDescription}>{lang.emailDescription}</span>
				</section>

				<section className={styles.secondColumn}>
					<label htmlFor="password" className={styles.registerLabel}>
						{lang.password}
					</label>

					<input
						id="password"
						className={styles.registerInput}
						placeholder={lang.password}
						type="password"
						onChange={e => handleChange(e)}
						value={inputData.password}
					/>

					<span className={styles.inputDescription}>{lang.passwordDescription}</span>

					<label htmlFor="confirmPassword" className={styles.registerLabel}>
						{lang.confirmPassword}
					</label>

					<input
						id="confirmPassword"
						className={styles.registerInput}
						placeholder={lang.password}
						type="password"
						onChange={e => handleChange(e)}
						value={inputData.confirmPassword}
					/>

					<section className={styles.checkboxesContainer}>
						<div className={styles.internalTitle}>
							<label className={styles.title}>{lang.specialDiet}</label>

							<span className={styles.extraDescription}>{lang.specialDietOptional}</span>
						</div>

						{checkboxes.map((checkbox, i) => (
							<label className={styles.registerLabel} key={`checkbox-section-key-${i}`}>
								<input
									id={checkbox.name}
									type="checkbox"
									className={styles.checkbox}
									checked={checkbox.value}
									onChange={() => handleCheckbox(checkbox.name)}
								/>
								{lang.specialDietOptions[checkbox.name]}
							</label>
						))}
					</section>
				</section>

				<section className={styles.buttonContainer}>
					{isLoading ? (
						<span style={{ color: '#fff' }}>Cargando... (⌐■_■)</span> //FIXME: Acá va un spinner para cuando esté cargando el login.
					) : (
						<Button
							kind="primary"
							size="large"
							id="registerBtn"
							onClick={e => {
								e.preventDefault();
								registerUser();
							}}>
							{lang.registerBtn}
						</Button>
					)}
				</section>
			</div>
		</FormLayout>
	);
}
