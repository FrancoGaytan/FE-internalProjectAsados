import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

describe('test del componente boton', () => {
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

	test('correcto renderizado del texto del boton control alternativa', () => {
		render(<Button>Register</Button>);
		const btnText = screen.getByText('Register');
		expect(btnText).toBeInTheDocument();
	});

	test('chequeo la correcta asignacion de clases al componente', () => {
		render(<Button>Register</Button>);
		const btnText = screen.getByText('Register');
		expect(btnText).toHaveClass('button');
	});

	test('chequeo la correcta asignacion de clases al componente y que sea del tipo que se le indica por props', () => {
		render(<Button kind="primary">Register</Button>);
		const btnText = screen.getByRole('button');
		expect(btnText).toHaveClass('primary');
	});

	test('correcto renderizado del texto del boton con su prop  size', () => {
		render(<Button size="large">Register</Button>);
		const btnText = screen.getByText('Register');
		expect(btnText).toHaveClass('size-large');
	});
	test('chequeo el correcto display del Text Content dentro del boton', () => {
		render(<Button size="large">Register</Button>);
		const btnText = screen.getByText('Register');
		expect(btnText).toHaveTextContent('Register');
	});
});
