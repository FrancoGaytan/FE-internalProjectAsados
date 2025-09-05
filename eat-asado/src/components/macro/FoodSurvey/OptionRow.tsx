import { IOption } from '../../../models/options';
import styles from './styles.module.scss';
import { useState } from 'react';

type Props = {
  option: IOption;
  userId: string;
  participantsCount: number;
  onToggleVote: () => void;
  onEdit: (title: string) => void;
  onDelete: () => void;
};

export default function OptionRow({ option, userId, participantsCount, onToggleVote, onEdit, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(option.title);

  const votes = option.participants.length;
  const checked = option.participants.includes(userId);

  return (
    <div className={styles.gridRow}>
      {/* col 1: descripción editable */}
      <div
        className={styles.colDescription}
        onClick={() => !editing && setEditing(true)}
        tabIndex={0}
        style={{ cursor: editing ? 'text' : 'pointer' }}
      >
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

      {/* col 2: barra range proporcional (read-only) */}
      <div className={styles.colRange}>
        <input
          type="range"
          min={0}
          max={participantsCount}
          value={votes}
          readOnly
          disabled
          className={`${styles.range} ${checked ? styles.rangeVoted : styles.rangeMuted}`}
        />
      </div>

      {/* col 3: numerito de votos */}
      <div className={styles.colVotes}>
        <span className={styles.voteCount}>{votes}</span>
      </div>

      {/* col 4: tu voto */}
      <div className={styles.colCheckbox}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggleVote}
          className={`${styles.checkbox} ${checked ? styles.checkboxOn : styles.checkboxOff}`}
        />
      </div>

      {/* col 5: acciones */}
      <div className={styles.colActions}>
        <button className={styles.iconBtn} aria-label="Eliminar opción" onClick={onDelete}>
          <span className={styles.iconTrash} />
        </button>
      </div>
    </div>
  );
}