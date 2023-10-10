import styles from './styles.module.scss';
import { className } from '../../../utils/className';
import { EventResponse } from '../../../models/event';
import { IUser } from '../../../models/user';
import { transferReceipt } from '../../../models/transfer';
import Button from '../../micro/Button/Button';
import { useState, useEffect } from 'react';

interface PayCheckProps {
	event: EventResponse;
	shoppingDesignee: IUser;
}

const PayCheckForm = ({ event, shoppingDesignee }: PayCheckProps) => {
	const [priceToPay, setPriceToPay] = useState(0);

	function gettingPriceToPay(): number {
		event.transferReceipts.forEach((tr: transferReceipt) => {
			setPriceToPay(priceToPay + tr.amount);
		});
		return priceToPay;
	}

	useEffect(() => {
		gettingPriceToPay();
	}, [event]);

	console.log(event);

	return (
		<div className={styles.payCheck}>
			<h4>Pago</h4>
			<div className={styles.payCheckContent}>
				<h5>Encargado de compras: {event?.shoppingDesignee?.name}</h5>
				<h5>Alias: {event?.shoppingDesignee?.alias}</h5>
				<h5>CBU: {event?.shoppingDesignee?.cbu}</h5>
				<h5>Total a abonar: {priceToPay}</h5>

				<h4>Opciones de Pago</h4>
				<form action="">
					{/* <label>Pregunta 1</label> */}
					<input type="radio" name="preg1" value="foo" />
					Efectivo
					{/* <label>Pregunta 1</label> */}
					<input type="radio" name="preg1" value="foo" /> Transferencia
				</form>
			</div>
			<Button className={styles.btnEvent} kind="primary" size="short" onClick={() => console.log('hola')}>
				Confirmar Pago
			</Button>
		</div>
	);
};

export default PayCheckForm;
