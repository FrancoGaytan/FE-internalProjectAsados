import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StarRating from './starRating';

describe('test del componente boton', () => {
	test('renderizado del componente', () => {
		render(<StarRating rating={5} />);
		const star = screen.getByTestId('star-rating-id');
		expect(star).toBeInTheDocument();
	});
	test('renderizado de la estrella llena', () => {
		render(<StarRating rating={5} />);
		const emptyStar = screen.getByTestId('star-full-id');
		expect(emptyStar).toBeInTheDocument();
	});
	test('renderizado de la estrella vacía', () => {
		render(<StarRating rating={5} />);
		const emptyStar = screen.getByTestId('star-empty-id');
		expect(emptyStar).toBeInTheDocument();
	});
	test('renderizado de la estrella vacía solo una vez', () => {
		render(<StarRating rating={5} />);
		const emptyStar = screen.getByTestId('star-full-id');
		expect(emptyStar).toHaveStyle('color: gold');
	});
});
