import type { Slide } from './types';

export const slides: Slide[] = [
  {
    id: 'title',
    kind: 'title',
    title:
      'I like building things, and I like helping other people build great things.',
    body: 'Guilherme Macedo. Solutions Engineer at Mysten Labs. Athens, Greece.',
  },
  {
    id: 'thesis',
    kind: 'text',
    title: 'Getting people excited is what gets me excited.',
    body: 'Developer relations, to me, is the gap between reading the docs and landing your first transaction. My job is to make that gap shorter.',
  },
  {
    id: 'now',
    kind: 'diagram',
    title: 'How a builder finds Sui.',
    body: 'Three steps, and where I come in. Hover or tap.',
    steps: [
      {
        label: 'First hello',
        role: 'A talk, a meetup, a SuiHub open night. My job is to make someone curious enough to open a terminal.',
      },
      {
        label: 'First contract',
        role: 'A workshop or a 1:1 session. My job is to get them from an empty folder to a package published on testnet, faucet and all.',
      },
      {
        label: 'First ship',
        role: 'A hackathon weekend or a launch. My job is to unblock them and make sure the demo works.',
      },
    ],
  },
  {
    id: 'hackathon',
    kind: 'photo',
    title: 'A hackathon weekend.',
    image: 'ethglobal-lisbon-fist-bump',
    body: 'Forty-eight hours. I run the kickoff, then spend the weekend at the tables: unblocking teams, reviewing Move code, and keeping the energy up until demos.',
  },
  {
    id: 'open-door',
    kind: 'photo',
    title: 'The open door.',
    image: 'suihub-athens-workshop',
    body: 'Anyone can walk into SuiHub Athens, and a lot of them have never touched a blockchain. I run the workshops and the 1:1 sessions, and I start from wherever they are.',
  },
  {
    id: 'origins',
    kind: 'route',
    title: 'Lived in',
    body: 'Portuguese, English, Spanish. Italian and Greek on a good day.',
    note: 'Four cities, four fresh starts, zero context. You learn to listen first and make yourself helpful second.',
    stops: [
      { place: 'Belo Horizonte', country: 'Brazil' },
      { place: 'Coimbra', country: 'Portugal' },
      { place: 'Castelfranco Veneto', country: 'Italy' },
      { place: 'Athens', country: 'Greece' },
    ],
  },
  {
    id: 'end',
    kind: 'end',
    title: 'Now you know a bit more about me.',
    body: 'The fastest way to reach me is LinkedIn.',
  },
];
