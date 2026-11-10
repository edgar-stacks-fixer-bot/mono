export interface RecipeTokenFixture {
  id: string;
  name: string;
  caption: string;
  amount: string;
  symbol: string;
  fiat: string;
}

export const recipeTokenFixtures: readonly RecipeTokenFixture[] = [
  {
    id: 'btc',
    name: 'Bitcoin',
    caption: 'Native SegWit',
    amount: '0.04812300',
    symbol: 'BTC',
    fiat: '$4,592.18',
  },
  {
    id: 'stx',
    name: 'Stacks',
    caption: 'Stacks',
    amount: '1,250.000000',
    symbol: 'STX',
    fiat: '$1,812.50',
  },
  {
    id: 'sbtc',
    name: 'sBTC',
    caption: 'Stacks',
    amount: '0.01000000',
    symbol: 'sBTC',
    fiat: '$954.30',
  },
];

const longListCopies = 5;

export const longRecipeTokenFixtures: readonly RecipeTokenFixture[] = Array.from(
  { length: longListCopies },
  (_, copy) =>
    recipeTokenFixtures.map(token => ({
      ...token,
      id: `${token.id}-${copy}`,
      name: copy === 0 ? token.name : `${token.name} ${copy + 1}`,
    }))
).flat();

export const recipeAddress = 'bc1q9h6tq79fzg6dn2fzvqs8ejd5pjmyv4dk7v9yfu';

export const recipeReviewRows = [
  { label: 'Network', value: 'Bitcoin' },
  { label: 'Address type', value: 'Native SegWit' },
  { label: 'Derivation path', value: "m/84'/0'/0'/0/0" },
  { label: 'Fee rate', value: '12 sats/vB', caption: 'About 30 minutes' },
] as const;

export const longRecipeReviewRows = Array.from({ length: 4 }, (_, copy) =>
  recipeReviewRows.map(row => ({ ...row, label: `${row.label} ${copy + 1}` }))
).flat();
