import { useState } from 'react';
import styles from './styles.module.scss';
import { useTranslation } from '../../../stores/LocalizationContext';

interface QuestionTabProps {
	question: string;
	answer: string;
	index: number;
}

export default function QuestionTab({ question, answer, index }: QuestionTabProps) {
	const [isOpen, setIsOpen] = useState(false);
	const lang = useTranslation('faq');
	const item = lang.questions[index];

	return (
		<div className={styles.questionTab}>
			<button className={styles.questionHeader} onClick={() => setIsOpen(prev => !prev)}>
				<span>
					{index + 1}- {item.question}
				</span>
				<img
					src={isOpen ? '/assets/pictures/icons-contraer.png' : '/assets/pictures/icons-extender.png'}
					alt={isOpen ? 'Cerrar' : 'Abrir'}
					width={25}
					height={25}
				/>
			</button>
			<div className={`${styles.answer} ${isOpen ? styles.open : ''}`}>{item.answer}</div>
		</div>
	);
}
