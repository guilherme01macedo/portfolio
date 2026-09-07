export type SlideKind =
  'title' | 'text' | 'diagram' | 'photo' | 'route' | 'end';

export type RouteStop = { place: string; country: string };

export type DiagramStep = { label: string; role: string };

export type Slide = {
  id: string;
  kind: SlideKind;
  title: string;
  body?: string;
  /** Slug of a photo in src/content/photos.ts */
  image?: string;
  /** Required when kind is 'diagram' */
  steps?: DiagramStep[];
  /** Required when kind is 'route' */
  stops?: RouteStop[];
  /** Optional closing line under a route slide's body */
  note?: string;
};

export type Photo = {
  slug: string;
  alt: string;
  width: number;
  height: number;
  event?: string;
};

export type PlaygroundItem = {
  name: string;
  blurb: string;
  url: string;
  repo?: string;
};

export type Site = {
  name: string;
  role: string;
  location: string;
  tagline: string;
  description: string;
  url: string;
  links: { linkedin: string; github: string; x: string };
};
