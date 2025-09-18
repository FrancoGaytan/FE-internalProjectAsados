import { IOption, ISurveyParticipant } from '../../../models/options';
import styles from './styles.module.scss';
import { useEffect, useMemo, useState } from 'react';

type Props = {
	option: IOption;
	userId: string;
	participantsCount: number;
	canUserEdit: boolean;
	peopleWhoHaventVoted: Array<ISurveyParticipant>;
	forceChecked?: boolean;
	onToggleVote: () => void;
	onEdit: (title: string) => void;
	onDelete: () => void;
	onView: () => void;
	pending?: boolean;
};

export default function OptionRow({
	option,
	userId,
	participantsCount,
	peopleWhoHaventVoted,
	canUserEdit,
	onToggleVote,
	onEdit,
	onView,
	onDelete,
	pending = false
}: Props) {
	const [editing, setEditing] = useState(false);
	const [temp, setTemp] = useState(option.title);
	const checkedReal = useMemo(() => option.participants.some(p => p._id === userId), [option.participants, userId]);
	const [localChecked, setLocalChecked] = useState<boolean | null>(null);

	useEffect(() => {
		setLocalChecked(null);
	}, [checkedReal]);

	const uiChecked = localChecked ?? checkedReal;

	const votes = option.participants.length;
	const votersTotal = Math.max(participantsCount - peopleWhoHaventVoted.length, 0);
	const percent = votersTotal === 0 ? 0 : Math.round((votes / votersTotal) * 100);

	return (
		<div className={`${styles.gridRow} ${!canUserEdit ? styles.noEdit : ''} ${pending ? styles.pending : ''}`}>
			{/* col 1: editable description */}
			<div
				className={styles.colDescription}
				onClick={() => !editing && canUserEdit && setEditing(true)}
				tabIndex={0}
				style={{ cursor: editing ? 'text' : canUserEdit ? 'pointer' : 'default' }}
				title={option.title}>
				{editing ? (
					<input
						autoFocus
						className={styles.editInput}
						value={temp}
						onChange={e => setTemp(e.target.value)}
						onKeyDown={e => {
							if (e.key === 'Enter') {
								onEdit(temp.trim() || option.title);
								setEditing(false);
							} else if (e.key === 'Escape') {
								setTemp(option.title);
								setEditing(false);
							}
						}}
						onBlur={() => {
							if (temp.trim() && temp.trim() !== option.title) onEdit(temp.trim());
							setEditing(false);
						}}
					/>
				) : (
					<span>{option.title}</span>
				)}
			</div>

			{/* col 2: progress bar (read-only) */}
			<div className={styles.colRange} aria-label={`Progreso: ${percent}%`}>
				<div className={styles.progressBarBg}>
					<div
						className={`${styles.progressBarFill} ${uiChecked ? styles.fillVoted : styles.fillMuted}`}
						style={{ width: `${percent}%` }}
					/>
				</div>
			</div>

			{/* col 3: votes number */}
			<div className={styles.colVotes}>
				<span className={styles.voteCount} title={`${votes} voto(s)`}>
					{votes}
				</span>
			</div>

			{/* col 4: your vote */}
			<div className={styles.colCheckbox}>
				<label className={`${styles.customCheckbox} ${pending ? styles.blockClicks : ''}`} aria-busy={pending} aria-disabled={pending}>
					<input
						type="checkbox"
						checked={uiChecked}
						onChangeCapture={e => {
							if (pending) {
								e.preventDefault();
								e.stopPropagation();
								return;
							}
							setLocalChecked(e.currentTarget.checked);
						}}
						onChange={() => {
							if (pending) return;
							onToggleVote();
						}}
						aria-checked={uiChecked}
					/>
					<span className={styles.checkmark} />
				</label>
			</div>

			{/* col 5: actions */}
			{canUserEdit && (
				<div className={styles.colActions}>
					<button className={styles.iconBtn} aria-label="Eliminar opción" onClick={onDelete}>
						<span className={styles.iconTrash} />
					</button>
				</div>
			)}

			{/* col 6: view */}
			<div className={styles.colActions}>
				<button className={styles.iconBtn} aria-label="view participants" onClick={onView}>
					<span style={canUserEdit ? { transform: 'translateX(-6px)' } : undefined} className={styles.iconView} />
				</button>
			</div>
		</div>
	);
}
