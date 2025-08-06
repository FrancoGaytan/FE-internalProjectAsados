import { JSX } from 'react';
import styles from './styles.module.scss';
import PrivateFormLayout from '../../components/macro/layout/PrivateFormLayout';
import QuestionTab from '../../components/macro/QuestionTab/QuestionTab';
import { useTranslation } from '../../stores/LocalizationContext';
import { useNavigate } from 'react-router-dom';

type FAQItem = { question: string; answer: string };

export function FAQ(): JSX.Element {
	const lang = useTranslation('faq');
	const navigate = useNavigate();

	function handleGoToMain(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		navigate('/');
	}
	return (
		<PrivateFormLayout>
			<div className={styles.content}>
				<section className={styles.backBtnSection}>
					<button className={styles.backBtn} onClick={handleGoToMain}></button>
					<p className={styles.backText}>{lang.backBtn}</p>
				</section>
				<h2 className={styles.title}>{lang.title}</h2>
				{lang.questions.map((item: FAQItem, index: number) => (
					<QuestionTab key={index} index={index} question={item.question} answer={item.answer} />
				))}
			</div>
		</PrivateFormLayout>
	);
}
