import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

describe('UNIT - Node', () => {
	test('el componente boton, debe ser renderizado', () => {
		expect(screen.getBy('button')).not.toBeInTheDocument(); //initial state
		render(<Button />); //change
		const btn = screen.getByRole('button');
		expect(btn).toBeInTheDocument(); //verify change
	});

	test('correcto renderizado del texto del boton', () => {
		render(<Button>Login</Button>);
		const btnText = screen.getByText('Login');
		expect(btnText).toBeInTheDocument();
	});
});
