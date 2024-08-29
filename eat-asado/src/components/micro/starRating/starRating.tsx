interface IStarsProps {
	rating: number;
}

const StarRating = (props: IStarsProps) => {
	// Asegurarse de que el rating está entre 0 y 5
	const clampedRating = Math.max(0, Math.min(5, props.rating));
	const percentage = (clampedRating / 5) * 100;

	return (
		<div style={{ fontSize: '30px', position: 'relative', display: 'inline-block' }}>
			<span style={{ color: '#ccc' }}>★</span> {/* Estrella vacía */}
			<span
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: `${percentage}%`,
					overflow: 'hidden',
					whiteSpace: 'nowrap',
					color: 'gold'
				}}>
				★ {/* Estrella llena según el porcentaje */}
			</span>
		</div>
	);
};

export default StarRating;