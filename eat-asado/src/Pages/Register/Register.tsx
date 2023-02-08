import { useTranslation } from '../../stores/LocalizationContext';
import styles from './styles.module.scss';
import Button from '../../Components/micro/Button/Button';
import FormLayout from '../../Components/macro/layout/FormLayout';

const Register = () => {
	const lang = useTranslation('register');

	return (
		//todo: meter todos los inputs y label adentro de un contenedor para manipular mejor el ancho y luego aplicar grid en desk
		<FormLayout>
			<div className={styles.closeBtn}></div>
			<label className={styles.title}>{lang.registerTitle}</label>
			<div className={styles.inputSection}>
				<section className={styles.firstColumn}>
					<label htmlFor="nombre" className={styles.registerLabel}>
						{lang.name}
					</label>
					<input id="nombre" className={styles.registerInput} placeholder={lang.name} type="text" />
					<label htmlFor="apellido" className={styles.registerLabel}>
						{lang.lastName}
					</label>
					<input id="apellido" className={styles.registerInput} placeholder={lang.lastName} type="text" />
					<label htmlFor="email" className={styles.registerLabel}>
						{lang.email}
					</label>
					<input id="email" className={styles.registerInput} placeholder={lang.emailPlaceholder} type="text" />
					<span className={styles.inputDescription}>{lang.emailDescription}</span>
				</section>
				<section className={styles.secondColumn}>
					<label htmlFor="contraseña" className={styles.registerLabel}>
						{lang.password}
					</label>
					<input id="contraseña" className={styles.registerInput} placeholder={lang.password} type="password" />
					<span className={styles.inputDescription}>{lang.passwordDescription}</span>
					<label htmlFor="confirmarContraseña" className={styles.registerLabel}>
						{lang.confirmPassword}
					</label>
					<input id="confirmarContraseña" className={styles.registerInput} placeholder={lang.password} type="password" />
					<section className={styles.checkboxesContainer}>
						<div className={styles.internalTitle}>
							<label className={styles.title}>{lang.specialDiet}</label>
							<span className={styles.extraDescription}>{lang.specialDietOptional}</span>
						</div>
						<label className={styles.registerLabel}>
							<input id="isVegan" type="checkbox" className={styles.checkbox} />
							{lang.veganDiet}
						</label>

						<label className={styles.registerLabel}>
							<input id="isVegetarian" type="checkbox" className={styles.checkbox} />
							{lang.vegetarianDiet}
						</label>

						<label className={styles.registerLabel}>
							<input id="isHypertensive" type="checkbox" className={styles.checkbox} />
							{lang.hypertensiveDiet}
						</label>
						<label className={styles.registerLabel}>
							<input id="isCeliac" type="checkbox" className={styles.checkbox} />
							{lang.celiacDiet}
						</label>
					</section>
				</section>
				<section className={styles.buttonContainer}>
					<Button kind="primary" size="large" id="registerBtn">
						{lang.registerBtn}
					</Button>
				</section>
			</div>
		</FormLayout>
	);
};

export default Register;
