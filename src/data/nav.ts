export interface NavItem {
  href: string;
  label: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const nav: NavGroup[] = [
  {
    title: 'Foundations',
    items: [
      { href: '/logo', label: 'Logo' },
      { href: '/colors/primary', label: 'Colors — Primary' },
      { href: '/colors/accent-palette', label: 'Colors — Accent Palette' },
      { href: '/colors/neutrals', label: 'Colors — Neutrals' },
      { href: '/type/hero', label: 'Type — Hero' },
      { href: '/type/headings', label: 'Type — Headings' },
      { href: '/type/body', label: 'Type — Body' },
      { href: '/type/eyebrow', label: 'Type — Eyebrow' },
      { href: '/spacing/scale', label: 'Spacing — Scale' },
      { href: '/spacing/radii', label: 'Spacing — Radii' },
      { href: '/spacing/shadows', label: 'Spacing — Shadows' },
      { href: '/motion', label: 'Motion' },
    ],
  },
  {
    title: 'Components',
    items: [
      { href: '/components/buttons', label: 'Buttons' },
      { href: '/components/input', label: 'Input' },
      { href: '/components/blog-nav', label: 'Blog Nav' },
      { href: '/components/post-card', label: 'Post Card' },
      { href: '/components/service', label: 'Service' },
      { href: '/components/timeline', label: 'Timeline' },
      { href: '/components/badges', label: 'Badges' },
      { href: '/components/callouts', label: 'Callouts' },
    ],
  },
  {
    title: 'UI Kits',
    items: [
      { href: '/ui-kits/blog', label: 'Blog' },
      { href: '/ui-kits/portfolio', label: 'Portfolio' },
    ],
  },
];

export interface LandingSection {
  href: string;
  title: string;
  eyebrow: string;
  blurb: string;
  visual:
    | 'logo'
    | 'colors'
    | 'type'
    | 'spacing'
    | 'motion'
    | 'components'
    | 'ui-kits';
}

export const landing: LandingSection[] = [
  { href: '/logo',             title: 'Logo',       eyebrow: 'Foundations',  blurb: 'Primary brand mark on light and dark.',          visual: 'logo' },
  { href: '/colors/primary',   title: 'Colors',     eyebrow: 'Foundations',  blurb: 'Primary, accent, and neutral palettes.',         visual: 'colors' },
  { href: '/type/hero',        title: 'Type',       eyebrow: 'Foundations',  blurb: 'Hero, headings, body, and eyebrow specimens.',   visual: 'type' },
  { href: '/spacing/scale',    title: 'Spacing',    eyebrow: 'Foundations',  blurb: 'Scale, radii, and elevation tokens.',            visual: 'spacing' },
  { href: '/motion',           title: 'Motion',     eyebrow: 'Foundations',  blurb: 'Duration and easing tokens for transitions.',    visual: 'motion' },
  { href: '/components/buttons', title: 'Components', eyebrow: 'Library',     blurb: 'Buttons, inputs, cards, badges, and more.',      visual: 'components' },
  { href: '/ui-kits/blog',     title: 'UI Kits',    eyebrow: 'Compositions', blurb: 'Full blog and portfolio compositions.',          visual: 'ui-kits' },
];
