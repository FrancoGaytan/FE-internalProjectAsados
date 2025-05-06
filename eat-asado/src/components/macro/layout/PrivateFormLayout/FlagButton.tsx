import { Locale } from '../../../../localization';
import { useLocalizationContext } from '../../../../stores/LocalizationContext';

interface FlagButtonProps {
	className: string;
	locale: Locale;
}

export default function FlagButton({ className, locale }: FlagButtonProps) {
	const { setLocale } = useLocalizationContext();
	return (
		<button
			className={className}
			onClick={e => {
				e.preventDefault();
				setLocale(locale);
			}}></button>
	);
}
