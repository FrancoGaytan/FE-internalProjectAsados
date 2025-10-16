import { useTranslation } from '../../../stores/LocalizationContext';
import styles from './styles.module.scss';
import { useState } from 'react';

type Props = { onAdd: (title: string) => void; loading?: boolean; compact?: boolean };

export default function AddOptionInput({ onAdd, loading, compact }: Props) {
  const [value, setValue] = useState('');
  	const lang = useTranslation('event');

  return (
    <div className={`${styles.addRow} ${compact ? styles.addRowCompact : ''}`}>
      <input
        className={styles.addInput}
        placeholder={lang.addOptionPlaceholder}
        value={value}
        disabled={loading}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && value.trim()) {
            onAdd(value.trim());
            setValue('');
          }
        }}
      />
      <button
        type="button"
        className={styles.iconBtn}
        aria-label={lang.addOptionAriaLabel}
        disabled={loading || !value.trim()}
        onClick={() => {
          if (!value.trim()) return;
          onAdd(value.trim());
          setValue('');
        }}
      >
        <span className={styles.iconPlus} />
      </button>
    </div>
  );
}