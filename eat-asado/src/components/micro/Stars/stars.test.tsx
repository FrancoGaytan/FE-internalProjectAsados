import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Stars from './stars';

describe('test del componente boton', () => {
	test('renderizado del componente', () => {
		render(<Stars iconSize={25} count={5} defaultRating={0} icon={'★'} color="rgb(240, 191, 28)" idEvent={'45454dfsdf'} />);
		const star = screen.getByTestId('star-rating-id');
		expect(star).toBeInTheDocument();
	});
});
