import { render, screen } from '@testing-library/react';
import App from './App';

test('renders LoanGuard dashboard shell', () => {
  render(<App />);
  expect(screen.getByText('LoanGuard')).toBeInTheDocument();
  expect(screen.getByText('Risk Overview Dashboard')).toBeInTheDocument();
  expect(screen.getByText('Loan Prediction')).toBeInTheDocument();
});

test('renders navbar title', () => {
  render(<App />);
  expect(screen.getByText('Loan Default Prediction')).toBeInTheDocument();
});
