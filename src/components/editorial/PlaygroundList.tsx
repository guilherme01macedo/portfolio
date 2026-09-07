import type { PlaygroundItem } from '@/content/types';

export function PlaygroundList({ items }: { items: PlaygroundItem[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.name} className="border-ink/10 rounded-lg border p-5">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-visible:outline-accent text-lg font-semibold underline-offset-4 hover:underline focus-visible:outline-2"
          >
            {item.name}
          </a>
          <p className="text-ink-muted mt-2">{item.blurb}</p>
        </li>
      ))}
    </ul>
  );
}
