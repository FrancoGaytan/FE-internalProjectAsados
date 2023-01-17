import { PropsWithChildren } from 'react';
import styles from './styles.module.scss';

export default function FormContainer(props: PropsWithChildren): JSX.Element {
    return (
        <div className={styles.formContainer}>
            {props.children}
        </div>
    )
}