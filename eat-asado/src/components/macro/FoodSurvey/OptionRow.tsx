import { IOption } from '../../../models/options';
import styles from './styles.module.scss';
import { useState } from 'react';

type Props = {
	option: IOption;
	userId: string;
	participantsCount: number;
	canUserEdit: boolean;
	peopleWhoHaventPaid: number;
	onToggleVote: () => void;
	onEdit: (title: string) => void;
	onDelete: () => void;
};

export default function OptionRow({ option, userId, participantsCount, peopleWhoHaventPaid, canUserEdit, onToggleVote, onEdit, onDelete }: Props) {
	const [editing, setEditing] = useState(false);
	const [temp, setTemp] = useState(option.title);

	const votes = option.participants.length;
	const checked = option.participants.includes(userId);
	const totalVotes = participantsCount > 0 ? participantsCount - peopleWhoHaventPaid : 1;
	const percent = Math.round((votes / totalVotes) * 100);

	return (
		<div className={styles.gridRow}>
			{/* col 1: editable description */}
			<div
				className={styles.colDescription}
				onClick={() => !editing && canUserEdit && setEditing(true)}
				tabIndex={0}
				style={{ cursor: editing ? 'text' : 'pointer' }}>
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
					<span title={option.title}>{option.title}</span>
				)}
			</div>

			{/* col 2: progress bar (read-only) */}
			<div className={styles.colRange}>
				<div className={styles.progressBarBg}>
					<div
						className={`${styles.progressBarFill} ${checked ? styles.rangeVoted : styles.rangeMuted}`}
						style={{ width: `${percent}%` }}
					/>
				</div>
			</div>

			{/* col 3: votes number */}
			<div className={styles.colVotes}>
				<span className={styles.voteCount}>{votes}</span>
			</div>

			{/* col 4: your vote */}
			<div className={styles.colCheckbox}>
				<label className={styles.customCheckbox}>
					<input type="checkbox" checked={checked} onChange={onToggleVote} />
					<span className={styles.checkmark}></span>
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
		</div>
	);
}
