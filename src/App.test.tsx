import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Kleo account screen', () => {
  render(<App />);
  expect(screen.getByText(/create an account/i)).toBeInTheDocument();
});
