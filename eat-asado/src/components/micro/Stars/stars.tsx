import { useState, ReactNode, useEffect } from 'react';
import styles from './styles.module.scss';
import { getRatingFromUser, createRating } from '../../../service/rating';
import { useAuth } from '../../../stores/AuthContext';

const DEFAULT_COUNT = 5;
const DEFAULT_ICON = '★';
const DEFAULT_UNSELECTED_COLOR = 'grey';
const DEFAULT_COLOR = 'yellow';

interface IStarsProps {
	count: number;
	defaultRating: number;
	icon: ReactNode;
	color: string;
	iconSize: number;
	idEvent: string;
}

export default function Stars(props: IStarsProps) {
	const { user } = useAuth();
	const [rating, setRating] = useState(props.defaultRating);
	const [temporaryRating, setTemporaryRating] = useState(props.defaultRating);
	let stars = Array(props.count || DEFAULT_COUNT).fill(props.icon || DEFAULT_ICON);

	function handleClick(rating: number) {
		if (!user || !props.idEvent) {
			return;
		}
		setRating(rating);
		createRating(props.idEvent, user.id, { score: rating })
			.then(res => {
				setRating(res.score);
			})
			.catch(e => {
				console.error('Catch in context: ', e);
			});
	}

	useEffect(() => {
		if (!user || !props.idEvent) {
			return;
		} else {
			getRatingFromUser(props.idEvent, user.id)
				.then(res => {
					if (res.score) {
						setRating(res.score);
					}
				})
				.catch(e => {
					console.error('Catch in context: ', e);
				});
		}
	}, [props]);

	return (
		<div className={styles.starsContainer}>
			{stars.map((item, index) => {
				const isActiveColor = (rating || temporaryRating) && (index < rating || index < temporaryRating);

				let elementColor = '';

				if (isActiveColor) {
					elementColor = props.color || DEFAULT_COLOR;
				} else {
					elementColor = DEFAULT_UNSELECTED_COLOR;
				}
				return (
					<div
						className={styles.star}
						data-testid={'stars-id'}
						key={index}
						style={{
							fontSize: props.iconSize ? `${props.iconSize}px` : '14px',
							color: elementColor,
							filter: `${isActiveColor ? 'greyscale(0%)' : 'greyscale(100%)'}`
						}}
						onMouseEnter={() => setTemporaryRating(index + 1)}
						onMouseLeave={() => setTemporaryRating(0)}
						onClick={() => handleClick(index + 1)}>
						{props.icon ? props.icon : DEFAULT_ICON}
					</div>
				);
			})}
		</div>
	);
}
