import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StarRating from './starRating';

describe('star Rating component test', () => {
	test('component being renderized', () => {
		render(<StarRating rating={5} />);
		const star = screen.getByTestId('star-rating-id');
		expect(star).toBeInTheDocument();
	});

	test('render a full star', () => {
		render(<StarRating rating={5} />);
		const emptyStar = screen.getByTestId('star-full-id');
		expect(emptyStar).toBeInTheDocument();
	});

	test('render an empty star', () => {
		render(<StarRating rating={5} />);
		const emptyStar = screen.getByTestId('star-empty-id');
		expect(emptyStar).toBeInTheDocument();
	});
          
	test('render an empty star only once', () => {
		render(<StarRating rating={5} />);
		const emptyStar = screen.getByTestId('star-full-id');
		expect(emptyStar).toHaveStyle('color: gold');
	});
});
