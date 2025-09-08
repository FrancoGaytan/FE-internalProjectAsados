import styles from './styles.module.scss';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createOption, deleteOption, editOption, getMembersWhoHaventVoted, toggleVoteOption } from '../../../service/optionsService';
import AddOptionInput from './AddOptionInput';
import OptionRow from './OptionRow';
import { AlertTypes } from '../../micro/AlertPopup/AlertPopup';
import { useAlert } from '../../../stores/AlertContext';
import { useTranslation } from '../../../stores/LocalizationContext';
import { IOption } from '../../../models/options';

type Props = {
	eventId: string;
	userId: string;
	canUserEdit: boolean;
	options: IOption[]; // viene de getEventById().options
	participantsCount: number; // total de miembros del evento
	onOptionsChange?: (opts: IOption[]) => void; // callback al padre
};

export default function FoodSurvey({ eventId, userId, canUserEdit, options = [], participantsCount = 0, onOptionsChange }: Props) {
	const lang = useTranslation('event');
	const { setAlert } = useAlert();

	const [rows, setRows] = useState<IOption[]>(options);
	const [missing, setMissing] = useState<number>(0);
	const [adding, setAdding] = useState(false);
	const abortRef = useRef<AbortController | null>(null);

	useEffect(() => {
		// Solo actualiza si las opciones realmente cambiaron
		if (JSON.stringify(rows) !== JSON.stringify(options ?? [])) {
			setRows(options ?? []);
		}
	}, [options]);

	useEffect(() => {
		refreshMissing();
	}, []);

	function refreshMissing() {
		abortRef.current?.abort();
		abortRef.current = new AbortController();
		getMembersWhoHaventVoted(eventId, abortRef.current.signal)
			.then(setMissing)
			.catch(() => setMissing(0));
	}

	function updateState(next: IOption[]) {
		setRows(next);
		onOptionsChange?.(next);
		// refrescamos “quedan sin votar”
		refreshMissing();
	}

	function handleAdd(title: string) {
		if (!title.trim()) return;
		setAdding(true);
		abortRef.current?.abort();
		abortRef.current = new AbortController();

		createOption(eventId, title.trim(), abortRef.current.signal)
			.then(newOpt => {
				updateState([...rows, newOpt]);
				setAlert(lang.optionAdded, AlertTypes.SUCCESS);
			})
			.catch(() => setAlert(lang.errorAddingOption, AlertTypes.ERROR))
			.finally(() => setAdding(false));
	}

	function handleDelete(id: string) {
		abortRef.current?.abort();
		abortRef.current = new AbortController();

		deleteOption(id, abortRef.current.signal)
			.then(() => {
				updateState(rows.filter(r => r._id !== id));
				setAlert(lang.optionDeleted, AlertTypes.SUCCESS);
			})
			.catch(() => setAlert(lang.errorDeletingOption, AlertTypes.ERROR));
	}

	function handleEdit(id: string, title: string) {
		abortRef.current?.abort();
		abortRef.current = new AbortController();

		editOption(id, { title: title.trim() }, abortRef.current.signal)
			.then(updated => {
				updateState(rows.map(r => (r._id === id ? { ...r, title: updated.title } : r)));
				setAlert(lang.optionUpdated, AlertTypes.SUCCESS);
			})
			.catch(() => setAlert(lang.errorUpdatingOption, AlertTypes.ERROR));
	}

	function handleToggleVote(option: IOption) {
		abortRef.current?.abort();
		abortRef.current = new AbortController();

		toggleVoteOption(option, userId, abortRef.current.signal)
			.then(updated => updateState(rows.map(r => (r._id === updated._id ? updated : r))))
			.catch(() => setAlert(lang.errorVoting, AlertTypes.ERROR));
	}

	const hasOptions = rows.length > 0;

	// (opcional) cálculo local del % por si lo querés usar en tooltips
	const participantsCountSafe = useMemo(() => Math.max(participantsCount, 1), [participantsCount]);

	return (
		<div className={styles.wrapper}>
			{/* título arriba a la derecha */}
			<div className={styles.header}>
				<div />
				<div className={styles.modalTitle}>{lang.surveyTitle ?? 'Encuesta'}</div>
			</div>

			<div className={styles.content}>
				{!hasOptions && (
					<div className={styles.emptyState}>
						<p className={styles.helperText}>
							{lang.surveyEmptyText ?? 'Agregá opciones de comidas para que los comensales puedan votar'}
						</p>
						<AddOptionInput loading={adding} onAdd={handleAdd} />
					</div>
				)}

				{hasOptions && (
					<>
						<div className={styles.gridBody}>
							{rows.map(opt => (
								<OptionRow
									key={opt._id}
									option={opt}
									userId={userId}
									canUserEdit={canUserEdit}
									participantsCount={participantsCountSafe}
									onToggleVote={() => handleToggleVote(opt)}
									onEdit={title => handleEdit(opt._id, title)}
									onDelete={() => handleDelete(opt._id)}
								/>
							))}
						</div>

						<div className={styles.footer}>
							<div className={styles.missingVotes}>
								{(lang.peopleWithoutVote ?? 'Quedan {n} personas sin votar').replace('{n}', String(missing))}
							</div>
							{canUserEdit && <AddOptionInput compact loading={adding} onAdd={handleAdd} />}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
