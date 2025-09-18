import styles from './styles.module.scss';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createOption, deleteOption, editOption, getMembersWhoHaventVoted, toggleVoteOption } from '../../../service/optionsService';
import AddOptionInput from './AddOptionInput';
import OptionRow from './OptionRow';
import { AlertTypes } from '../../micro/AlertPopup/AlertPopup';
import { useAlert } from '../../../stores/AlertContext';
import { useTranslation } from '../../../stores/LocalizationContext';
import { IOption, ISurveyParticipant } from '../../../models/options';

type Props = {
	eventId: string;
	userId: string;
	canUserEdit: boolean;
	options: IOption[];
	participantsCount: number;
	onOptionsChange?: (opts: IOption[]) => void;
	open: boolean;
};

export default function FoodSurvey({ eventId, userId, canUserEdit, open, options = [], participantsCount = 0, onOptionsChange }: Props) {
	const lang = useTranslation('event');
	const { setAlert } = useAlert();

	const [rows, setRows] = useState<IOption[]>(options);
	const [missing, setMissing] = useState<ISurveyParticipant[]>([]);
	const [adding, setAdding] = useState(false);
	const abortRef = useRef<AbortController | null>(null);
	const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);
	const [bulkSelecting, setBulkSelecting] = useState<boolean>(false);
	const [viewOptionId, setViewOptionId] = useState<string | null>(null);
	const optionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

	useEffect(() => {
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
			.then(res => {
				setMissing(res.membersWhoHaventVoted ?? []);
			})
			.catch(() => setMissing([]));
	}

	function updateState(next: IOption[]) {
		setRows(next);
		onOptionsChange?.(next);
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
		setPendingToggleId(option._id);

		toggleVoteOption(option, userId, abortRef.current.signal)
			.then(updated => updateState(rows.map(r => (r._id === updated._id ? updated : r))))
			.catch(() => setAlert(lang.errorVoting, AlertTypes.ERROR))
			.finally(() => setPendingToggleId(null));
	}

	async function handleSelectAll() {
		if (!canUserEdit || bulkSelecting) return;

		const toUpdate = rows.filter(o => !o.participants.some(p => p._id === userId));
		if (toUpdate.length === 0) return;

		setBulkSelecting(true);

		try {
			const updates = await Promise.all(
				toUpdate.map(opt => {
					const ids = [...opt.participants.map(p => p._id), userId];
					return editOption(opt._id, { participants: ids as any });
				})
			);

			const map = new Map(updates.map(u => [u._id, u]));
			updateState(rows.map(r => map.get(r._id) ?? r));
			setAlert(lang?.allSelected, AlertTypes.SUCCESS);
		} catch {
			setAlert(lang?.errorVoting, AlertTypes.ERROR);
		} finally {
			setBulkSelecting(false);
		}
	}

	useEffect(() => {
		if (!open) {
			setViewOptionId(null);
		}
	}, [open]);

	useEffect(() => {
		if (viewOptionId && optionRefs.current[viewOptionId]) {
			optionRefs.current[viewOptionId]?.scrollIntoView({
				behavior: 'smooth',
				block: 'center'
			});
		}
	}, [viewOptionId]);

	const hasOptions = rows.length > 0;
	const participantsCountSafe = useMemo(() => Math.max(participantsCount, 1), [participantsCount]);

	return (
		<div className={styles.wrapper}>
			<div className={styles.header}>
				<div />
				<div className={styles.modalTitle}>{lang.surveyTitle}</div>
			</div>

			{!viewOptionId ? (
				<div className={styles.content}>
					{!hasOptions && canUserEdit && (
						<div className={styles.emptyState}>
							<p className={styles.helperText}>{lang.surveyEmptyText}</p>
							<AddOptionInput loading={adding} onAdd={handleAdd} />
						</div>
					)}
					{!hasOptions && !canUserEdit && (
						<div className={styles.emptyState}>
							<p className={styles.helperText}>{lang.noOptionsForSurvey}</p>
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
										peopleWhoHaventVoted={missing}
										pending={pendingToggleId === opt._id}
										onToggleVote={() => handleToggleVote(opt)}
										onEdit={title => handleEdit(opt._id, title)}
										onDelete={() => handleDelete(opt._id)}
										onView={() => setViewOptionId(opt._id)}
									/>
								))}
							</div>

							{rows.length > 1 && (
								<div className={styles.toolbar}>
									<button
										className={styles.selectAllBtn}
										onClick={handleSelectAll}
										disabled={!!pendingToggleId}
										aria-busy={bulkSelecting}
										aria-label={lang?.selectAll}>
										{bulkSelecting ? lang?.processing : lang?.selectAll}
									</button>
								</div>
							)}

							<div className={styles.footer}>
								<div className={styles.missingVotes}>
									{String(missing.length) === '0'
										? lang.everyoneHasVoted
										: String(missing.length) === '1'
										? lang.peopleWithoutVotesP1one + String(missing.length) + lang.peopleWithoutVotesP2one
										: lang.peopleWithoutVotesP1 + String(missing.length) + lang.peopleWithoutVotesP2}
								</div>
								{canUserEdit && <AddOptionInput compact loading={adding} onAdd={handleAdd} />}
							</div>
						</>
					)}
				</div>
			) : (
				<>
					<section className={styles.votesParticipantsSection}>
						{options.map(opt => (
							<div key={opt._id} className={styles.participantsListArea} ref={el => { optionRefs.current[opt._id] = el; }}>
								<h3 className={`${styles.optionTitle} ${viewOptionId === opt._id ? styles.selectedOptionTitle : ''}`}>{opt.title}</h3>
								{opt.participants.length === 0 && <p className={styles.noVotes}>{lang.noVotesYet}</p>}
								{opt.participants.length > 0 && (
									<ul className={styles.participantsList}>
										{opt.participants.map(p => (
											<li key={p._id} className={styles.participantItem}>
												{p.name + ' ' + p.lastName}
											</li>
										))}
									</ul>
								)}
							</div>
						))}
					</section>
					<div className={styles.toolbar}>
						<button
							className={styles.selectAllBtn}
							onClick={() => setViewOptionId(null)}
							disabled={!!pendingToggleId}>
							{lang.backToOptions}
						</button>
					</div>
				</>
			)}
		</div>
	);
}
