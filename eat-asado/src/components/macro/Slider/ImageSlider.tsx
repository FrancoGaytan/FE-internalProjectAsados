import { useEffect, useState, useRef } from 'react';
import styles from './styles.module.scss';

interface ImageSliderProps {
	images: string[];
	altText?: string;
}

export default function ImageSlider({ images, altText = 'slide' }: ImageSliderProps) {
	const [current, setCurrent] = useState(0);
	const [transitionEnabled, setTransitionEnabled] = useState(true);
	const total = images.length;

	const prevSlide = () => {
		setTransitionEnabled(true);
		setCurrent(prev => (prev === 0 ? total - 1 : prev - 1));
	};

	const nextSlide = () => {
		setTransitionEnabled(true);
		setCurrent(prev => (prev === total - 1 ? 0 : prev + 1));
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setTransitionEnabled(true);
			setCurrent(prev => (prev === total - 1 ? 0 : prev + 1));
		}, 8000);
		return () => clearInterval(interval);
	}, [total]);

	return (
		<div className={styles.slider}>
			<div
				className={styles.sliderTrack}
				style={{
					transform: `translateX(-${current * 100}%)`,
					transition: transitionEnabled ? 'transform 0.6s ease-in-out' : 'none'
				}}>
				{images.map((img, index) => (
					<img key={index} src={img} alt={`${altText} ${index + 1}`} className={styles.slideImage} />
				))}
			</div>
		</div>
	);
}
