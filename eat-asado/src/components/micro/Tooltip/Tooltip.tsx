import { useState } from 'react';
import styles from './styles.module.scss';
import { className } from '../../../utils/className';

interface TooltipProps {
	infoText: string;
	children: any;
}

export default function Tooltip(props: TooltipProps): JSX.Element {
	const [showTooltip, setShowTooltip] = useState(false);
	return (
		<div className={styles.tooltipContainer} onClick={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
			{props.children}

			<div {...className(styles.tooltip, styles[showTooltip ? 'open' : ''])}>
				{props.infoText}
				<div className={styles.arrow} />
			</div>
		</div>
	);
}
