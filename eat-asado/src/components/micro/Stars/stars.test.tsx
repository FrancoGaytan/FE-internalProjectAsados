import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Stars from './stars';
import { BrowserRouter } from 'react-router-dom';
import { LocalizationProvider } from '../../../stores/LocalizationContext';
import { AuthProvider } from '../../../stores/AuthContext';

describe('Component Stars tests', () => {
	test('checking the correct renderized of the component and checking that if I tell that they´re five stars by props, then they will be five stars', () => {
		render(
			<BrowserRouter>
				<LocalizationProvider>
					<AuthProvider>
						<Stars iconSize={25} count={5} defaultRating={0} icon={'★'} color="rgb(240, 191, 28)" idEvent={'45454dfsdf'} />
					</AuthProvider>
				</LocalizationProvider>
			</BrowserRouter>
		);
		const stars = screen.getAllByTestId('stars-id');
		expect(stars.length).toBe(5);
	});

	/* 	test('renderizado del componente', () => {
		render(<Stars iconSize={25} count={5} defaultRating={0} icon={'★'} color="rgb(240, 191, 28)" idEvent={'45454dfsdf'} />);
		const star = screen.queryAllByTestId('star-rating-id');
		expect(star).toHaveLength(5);
	}); */
});
