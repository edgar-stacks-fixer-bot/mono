import { filterIndexPosts, filterNewsPosts, searchPosts } from './posts-index.utils';

const posts = [
  {
    slug: 'what-is-stacks',
    title: 'What is Stacks?',
    summary: 'Bitcoin layer',
    category: 'Stacks',
  },
  { slug: 'brotocol', title: 'Brotocol', summary: null, category: 'Apps' },
  { slug: 'privacy-policy', title: 'Privacy Policy', summary: null, category: 'Legal' },
  { slug: 'tokens-stx', title: 'STX', summary: null, category: 'Tokens' },
  { slug: 'install-leather', title: 'Install Leather', summary: null, category: 'Guides' },
  { slug: 'send-ordinals', title: 'Send Ordinals', summary: null, category: 'Guides' },
  { slug: 'bitcoin-runes', title: 'Bitcoin Runes', summary: null, category: 'News' },
  { slug: 'grow-your-bitcoin', title: 'Grow your Bitcoin', summary: 'Mobile', category: 'News' },
  { slug: 'uncategorised', title: 'Uncategorised', summary: null, category: null },
];

describe('filterIndexPosts', () => {
  const slugs = filterIndexPosts(posts, new Set(['install-leather'])).map(post => post.slug);

  it('leaves out the Apps, Legal and Tokens categories', () => {
    expect(slugs).not.toContain('brotocol');
    expect(slugs).not.toContain('privacy-policy');
    expect(slugs).not.toContain('tokens-stx');
  });

  it('leaves out posts whose slug is also a guide', () => {
    expect(slugs).not.toContain('install-leather');
  });

  it('leaves out retired Ordinals, Runes and Stamps posts', () => {
    expect(slugs).not.toContain('send-ordinals');
    expect(slugs).not.toContain('bitcoin-runes');
  });

  it('keeps everything else in order', () => {
    expect(slugs).toEqual(['what-is-stacks', 'grow-your-bitcoin', 'uncategorised']);
  });
});

describe('filterNewsPosts', () => {
  it('keeps only News posts that are not retired', () => {
    expect(filterNewsPosts(posts).map(post => post.slug)).toEqual(['grow-your-bitcoin']);
  });
});

describe('searchPosts', () => {
  it('returns every post for an empty query', () => {
    expect(searchPosts(posts, '')).toEqual(posts);
    expect(searchPosts(posts, null)).toEqual(posts);
    expect(searchPosts(posts, '   ')).toEqual(posts);
  });

  it('matches the title, summary and category case-insensitively', () => {
    expect(searchPosts(posts, 'STACKS').map(post => post.slug)).toEqual(['what-is-stacks']);
    expect(searchPosts(posts, 'mobile').map(post => post.slug)).toEqual(['grow-your-bitcoin']);
    expect(searchPosts(posts, 'legal').map(post => post.slug)).toEqual(['privacy-policy']);
  });
});
