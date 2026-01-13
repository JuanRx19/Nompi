import { render, screen } from '@testing-library/react';
import Input from './Input';

describe('Input', () => {
  it('renderiza hint cuando está presente', () => {
    render(<Input value="" onChange={() => {}} hint="Mensaje" error />);
    expect(screen.getByText('Mensaje')).toBeInTheDocument();
  });
});
