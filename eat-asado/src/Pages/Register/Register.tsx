import { useTranslation } from '../../stores/LocalizationContext';
import styles from './styles.module.scss';
import Button from '../../Components/micro/Button/Button';
import FormLayout from '../../Components/macro/layout/FormLayout';
import FormContainer from '../../Components/macro/formContainer/FormContainer';

const Register = () => {
	const translation = useTranslation('login');

	return (
		//todo: meter todos los inputs y label adentro de un contenedor para manipular mejor el ancho y luego aplicar grid en desk
		<FormLayout>
			<FormContainer>
				<label className={styles.title}>REGISTER</label>
				<label htmlFor="nombre" className={styles.registerLabel}>
					Nombre
				</label>
				<input id="nombre" placeholder="Nombre" type="text" />
				<label htmlFor="apellido" className={styles.registerLabel}>
					Apellido
				</label>
				<input id="apellido" placeholder="Apellido" type="text" />
				<label htmlFor="email" className={styles.registerLabel}>
					Email
				</label>
				<input id="email" placeholder="user@endava.com" type="text" />
				<span className={styles.inputDescription}>Utilizar por favor el email de endava</span>
				<label htmlFor="contraseña" className={styles.registerLabel}>
					Contraseña
				</label>
				<input id="contraseña" placeholder="" type="password" />
				<span className={styles.inputDescription}>La clave debe ser alfanumerica y contener un minimo de 8 caracteres</span>
				<label htmlFor="confirmarContraseña" className={styles.registerLabel}>
					Comfirmar Contraseña
				</label>
				<input id="confirmarContraseña" placeholder="" type="password" />
				<section className={styles.checkboxesContainer}>
					<label className={styles.title}>Contanos de vos</label>
					<label className={styles.registerLabel}>
						<input id="isVegan" type="checkbox" className={styles.checkbox}/>
						Sos Vegano?
					</label>
					<label className={styles.registerLabel}>
						<input id="isVegetarian" type="checkbox" className={styles.checkbox}/>
						Sos Vegetariano?
					</label>
					<label className={styles.registerLabel}>
						<input id="isHypertensive" type="checkbox" className={styles.checkbox}/>
						Sos Hipertenso?
					</label>
				</section>
				<Button kind="primary" size="large">
					REGISTER
				</Button>
			</FormContainer>
		</FormLayout>
	);
};

export default Register;
