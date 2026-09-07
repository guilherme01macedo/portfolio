import { ImageResponse } from 'next/og';
import { site } from '@/content/site';

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 64,
        background: '#151515',
        color: '#f3f3f3',
        fontSize: 30,
      }}
    >
      <div style={{ display: 'flex', color: '#ffc857' }}>guimacedo.com</div>
      <div
        style={{
          display: 'flex',
          fontSize: 60,
          lineHeight: 1.1,
          fontWeight: 600,
        }}
      >
        {site.tagline}
      </div>
      <div style={{ display: 'flex', opacity: 0.8 }}>
        {site.name} · {site.role} · {site.location}
      </div>
    </div>,
    { ...size },
  );
}
