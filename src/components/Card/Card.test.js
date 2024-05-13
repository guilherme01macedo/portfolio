import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from './index';

describe('Card Component', () => {
  test('renders with the provided title', () => {
    const title = 'Test Card';
    render(<Card title={title} />);
    const cardTitleElement = screen.getByText(title);
    expect(cardTitleElement).toBeInTheDocument();
  });
});