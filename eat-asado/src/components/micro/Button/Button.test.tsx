import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

describe('button component test', () => {
	test('compont being renderized', () => {
		render(<Button />);
		const btn = screen.getByRole('button');
		expect(btn).toBeInTheDocument();
	});

	test('compont text being renderized properly', () => {
		render(<Button>Login</Button>);
		const btnText = screen.getByText('Login');
		expect(btnText).toBeInTheDocument();
	});

	test('compont alternative text being renderized properly', () => {
		render(<Button>Register</Button>);
		const btnText = screen.getByText('Register');
		expect(btnText).toBeInTheDocument();
	});

	test('testing that the component have the accurate button class asignation', () => {
		render(<Button>Register</Button>);
		const btnText = screen.getByText('Register');
		expect(btnText).toHaveClass('button');
	});

	test('testing that the component have the accurate class asignation which has been given by props', () => {
		render(<Button kind="primary">Register</Button>);
		const btnText = screen.getByRole('button');
		expect(btnText).toHaveClass('primary');
	});

	test('testing that the component have the accurate class asignation which has been given by props "size"', () => {
		render(<Button size="large">Register</Button>);
		const btnText = screen.getByText('Register');
		expect(btnText).toHaveClass('size-large');
	});
  
	test('button text context proper display', () => {
		render(<Button size="large">Register</Button>);
		const btnText = screen.getByText('Register');
		expect(btnText).toHaveTextContent('Register');
	});
  
	test('button checking to be enable test', () => {
		render(<Button size="large">Register</Button>);
		const btnText = screen.getByText('Register');
		expect(btnText).toBeEnabled();
	});
	test('compont being renderized two times and selecting by its name', () => {
		render(
			<>
				<Button size="large">Register</Button>
				<Button size="large">Login</Button>
			</>
		);
		const btn = screen.getByRole('button', { name: /Login/i });
		expect(btn).toBeInTheDocument();
	});
});
