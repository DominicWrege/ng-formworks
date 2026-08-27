export interface PlaygroundExample {
  name: string;
  file: string;
}

/**
 * Curated mixed-control examples for eyeballing the Tailwind widget styling.
 * Each example deliberately mixes many control types and framework features.
 */
export const PLAYGROUND_EXAMPLES: PlaygroundExample[] = [
  { name: 'Controls — inputs, selects, checks & radios', file: 'playground-controls' },
  { name: 'Layout — flex, tabs, sections & conditionals', file: 'playground-layout' },
  { name: 'Arrays — simple, object lists & nested', file: 'playground-arrays' },
];
