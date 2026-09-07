import type { Site } from '@/content/types';

type Props = { links: Site['links']; tone: 'dark' | 'light' };

const items: { key: keyof Site['links']; label: string }[] = [
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'x', label: 'X' },
  { key: 'github', label: 'GitHub' },
];

export function SocialLinks({ links, tone }: Props) {
  const color =
    tone === 'dark'
      ? 'text-stage-fg hover:text-accent'
      : 'text-ink hover:text-ink-muted';
  return (
    <ul className="flex flex-wrap gap-6">
      {items.map(({ key, label }) => (
        <li key={key}>
          <a
            href={links[key]}
            rel="me noopener noreferrer"
            target="_blank"
            className={`focus-visible:outline-accent underline underline-offset-4 focus-visible:outline-2 ${color}`}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
