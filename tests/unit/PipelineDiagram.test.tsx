import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { PipelineDiagram } from '@/components/deck/PipelineDiagram';

const steps = [
  { label: 'Proof of concept', role: 'I map the product onto Sui.' },
  { label: 'Pilot', role: 'I review the architecture.' },
  { label: 'Production', role: 'I stay close through launch.' },
];

describe('PipelineDiagram', () => {
  test('click opens a step, a second click closes it', async () => {
    render(<PipelineDiagram steps={steps} />);
    const pilot = screen.getByRole('button', { name: /Pilot/ });
    await userEvent.click(pilot);
    expect(pilot).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('I review the architecture.')).toBeVisible();
    await userEvent.click(pilot);
    expect(pilot).toHaveAttribute('aria-expanded', 'false');
  });
});
