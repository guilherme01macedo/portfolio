# guimacedo.com

The personal site of Guilherme Macedo. The home page is a talk of seven
slides, then a body with photos and side projects.

## Run

    pnpm install
    pnpm dev

Use Node 22 or later.

## Check

    pnpm lint
    pnpm typecheck
    pnpm test
    pnpm build && pnpm e2e
    pnpm photos:check

## Add photos

1. Put JPEG or PNG originals in `photos-src/`. Git ignores that folder.
2. Run `pnpm photos`.
3. Paste the printed lines into `src/content/photos.ts`.
4. Write the `alt` text for each photo. The build fails
   if one is empty.
5. To show a photo on a slide, set `image` on that slide in
   `src/content/slides.ts` to the photo slug.

## Before you deploy

1. Add photos (see "Add photos") and set `image` on the hackathon,
   open-door, and origins slides.
2. Replace the numbers on the open-door slide in `src/content/slides.ts`.
3. Replace the two placeholder project URLs in `src/content/playground.ts`.
4. Run `pnpm build && pnpm start` and check http://localhost:3000.

## Edit copy

- Slides: `src/content/slides.ts`
- Name, tagline, links: `src/content/site.ts`
- Side projects: `src/content/playground.ts`

## Notes

The build uses the default Next.js output, not `output: 'export'`, because
the image optimizer needs the server. Every route still prerenders as
static.
