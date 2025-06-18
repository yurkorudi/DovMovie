import { test, expect } from '@jest/globals';
import { render } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import userEvent from '@testing-library/user-event';

test('renders Button component', () => {
	const { getByText } = render(<Button>Click me</Button>);
	const buttonElement = getByText(/Click me/i);
	expect(buttonElement).toBeInTheDocument();
});

test('handles click event', async () => {
	const handleClick = jest.fn();
	const { getByText } = render(<Button onClick={handleClick}>Click me</Button>);
	const buttonElement = getByText(/Click me/i);

	await userEvent.click(buttonElement);

	expect(handleClick).toHaveBeenCalled();
});

test('matches snapshot', () => {
	const { container } = render(<Button>Click me</Button>);
	expect(container).toMatchSnapshot();
});

// Optional: Accessibility testing
// test('has no accessibility violations', async () => {
// 	const { container } = render(<Button>Click me</Button>);
// 	const results = await axe(container);
// 	expect(results).toHaveNoViolations();
// });
