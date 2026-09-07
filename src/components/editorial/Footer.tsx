import type { Site } from '@/content/types';
import { SocialLinks } from '@/components/ui/SocialLinks';

export function Footer({ site }: { site: Site }) {
  return (
    <footer className="border-ink/10 border-t px-6 py-12 md:px-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        <p className="font-semibold">{site.name}</p>
        <p className="text-ink-muted">
          {site.role}. {site.location}.
        </p>
        <SocialLinks links={site.links} tone="light" />
      </div>
    </footer>
  );
}
