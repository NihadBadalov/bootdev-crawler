const { test, expect } = require('@jest/globals')
const { normalizeURL, getURLsfromHTML } = require('./crawl.js')

test('normalizeURL HTTPS with slash at the end', () => {
  expect(normalizeURL('https://blog.boot.dev/path/')).toBe('blog.boot.dev/path');
});

test('normalizeURL HTTPS without slash at the end', () => {
  expect(normalizeURL('https://blog.boot.dev/path')).toBe('blog.boot.dev/path');
});

test('normalizeURL HTTP with slash at the end', () => {
  expect(normalizeURL('http://blog.boot.dev/path/')).toBe('blog.boot.dev/path');
});

test('normalizeURL HTTP without slash at the end', () => {
  expect(normalizeURL('http://blog.boot.dev/path')).toBe('blog.boot.dev/path');
});

test('normalizeURL HTTP without slash at the end capitals', () => {
  expect(normalizeURL('http://BLOG.BOOT.dev/PATH')).toBe('blog.boot.dev/path');
});

test('getURLsfromHTML relative', () => {
  const input = '<html><body><a href="/learn">Learn Backend Development</a></body></html>';
  const inputURL = 'https://blog.boot.dev'
  const actual = getURLsfromHTML(input, inputURL);
  const expected = ['https://blog.boot.dev/learn'];
  expect(actual).toEqual(expected);
});

test('getURLsfromHTML absolute', () => {
  const input = '<html><body><a href="https://blog.boot.dev/new">Blog</a></body></html>';
  const inputURL = 'https://blog.boot.dev'
  const actual = getURLsfromHTML(input, inputURL);
  const expected = ['https://blog.boot.dev/new'];
  expect(actual).toEqual(expected);
});

test('getURLsfromHTML both', () => {
  const input = '<html><body><a href="https://blog.boot.dev/welcome">Blog</a><a href="/path">Other</a></body></html>';
  const inputURL = 'https://blog.boot.dev'
  const actual = getURLsfromHTML(input, inputURL);
  const expected = ['https://blog.boot.dev/welcome', 'https://blog.boot.dev/path'];
  expect(actual).toEqual(expected);
});

