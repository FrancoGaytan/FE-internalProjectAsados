import { useTranslation } from '../../stores/LocalizationContext';
import styles from './styles.module.scss';
import Button from '../../Components/micro/Button/Button';
import FormLayout from '../../Components/macro/layout/FormLayout';

const Register = () => {
	const translation = useTranslation('login');

	return (
		//todo: meter todos los inputs y label adentro de un contenedor para manipular mejor el ancho y luego aplicar grid en desk
		<FormLayout>
			<div className={styles.closeBtn}></div>
			<label className={styles.title}>REGISTER</label>
			<div className={styles.inputSection}>
				<section className={styles.firstColumn}>
					<label htmlFor="nombre" className={styles.registerLabel}>
						Nombre
					</label>
					<input id="nombre" className={styles.registerInput} placeholder="Nombre" type="text" />
					<label htmlFor="apellido" className={styles.registerLabel}>
						Apellido
					</label>
					<input id="apellido" className={styles.registerInput} placeholder="Apellido" type="text" />
					<label htmlFor="email" className={styles.registerLabel}>
						Email
					</label>
					<input id="email" className={styles.registerInput} placeholder="user@endava.com" type="text" />
					<span className={styles.inputDescription}>Utilizar por favor el email de endava</span>
				</section>
				<section className={styles.secondColumn}>
					<label htmlFor="contraseña" className={styles.registerLabel}>
						Contraseña
					</label>
					<input id="contraseña" className={styles.registerInput} placeholder="" type="password" />
					<span className={styles.inputDescription}>La clave debe ser alfanumerica y contener un minimo de 8 caracteres</span>
					<label htmlFor="confirmarContraseña" className={styles.registerLabel}>
						Comfirmar Contraseña
					</label>
					<input id="confirmarContraseña" className={styles.registerInput} placeholder="" type="password" />
					<section className={styles.checkboxesContainer}>
						<div className={styles.internalTitle}>
							<label className={styles.title}>CONTANOS DE VOS</label>
							<span className={styles.extraDescription}>(opcional)</span>
						</div>
						<label className={styles.registerLabel}>
							<input id="isVegan" type="checkbox" className={styles.checkbox} />
							Sos Vegano?
						</label>

						<label className={styles.registerLabel}>
							<input id="isVegetarian" type="checkbox" className={styles.checkbox} />
							Sos Vegetariano?
						</label>

						<label className={styles.registerLabel}>
							<input id="isHypertensive" type="checkbox" className={styles.checkbox} />
							Sos Hipertenso?
						</label>
						<label className={styles.registerLabel}>
							<input id="isCeliac" type="checkbox" className={styles.checkbox} />
							Sos Celíaco?
						</label>
					</section>
				</section>
				<Button kind="primary" size="large" id="registerBtn" style={{ marginBottom: '15vh' }}>
					REGISTER
				</Button>
			</div>
		</FormLayout>
	);
};

export default Register;
