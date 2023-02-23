import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

test('renderizado del componente', () => {
	render(<Button />);
	const btn = screen.getByRole('button');
	expect(btn).toBeInTheDocument();
});

test('correcto renderizado del texto del boton', () => {
	render(<Button>Login</Button>);
	const btnText = screen.getByText('Login');
	expect(btnText).toBeInTheDocument();
});
