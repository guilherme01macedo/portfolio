import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './index';

describe('Header Component', () => {
  test('renders', () => {
    render(<Header  />);
    const cardTitleElement = screen.getByText('Guilherme Macedo');
    expect(cardTitleElement).toBeInTheDocument();
  });
});