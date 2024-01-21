const { JSDOM } = require('jsdom');

/**
 * @param {URL|string} url 
 *  @returns {string}
 */
function normalizeURL(url) {
  let newURL = url
    .toLowerCase()
    .replace('https://', '')
    .replace('http://', '');

  return newURL.at(-1) === '/'
    ? newURL.slice(0, -1)
    : newURL;
}

/**
  * @param {string|JSDOM} html
  * @param {string} baseURL
  * @returns {Array<string>} Un-normalized array of all URLs found within the HTML
  */
function getURLsfromHTML(html, baseURL) {
  /** @type {JSDOM} */
  let dom = typeof html === 'string' ? new JSDOM(html) : jsdom;

  /** @type {Array<URL>} */
  const foundURLs = [];

  dom.window.document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    foundURLs.push(
      href.at(0) === '/'
        ? baseURL + href
        : href
    );
  });

  return foundURLs;
}

/**
 * @param {string} baseURL 
 * @param {string} url 
 * @param {{
    [key: string]: number;
  }} pages 
 * @param {Set<string>} visited
 * @returns {Promise<{
    [key: string]: number;
  }>} crawled pages
 */
async function crawlPage(baseURL, url, pages, visited) {
  try {
    const currentURLInstance = new URL(url);
    if ((visited.has(normalizeURL(url))) || baseURL !== `${currentURLInstance.protocol}//${currentURLInstance.host}`)
      return pages;
    console.log(`Visited ${url}`);
    visited.add(normalizeURL(url));


    /** @type {Response} */
    const response = await fetch(url, {
      headers: {
        'Accept': 'text/html',
      },
    });

    if (response.status >= 400) return console.log(`Got an error with status code: ${response.status}. Aborting`);

    const contentType = response.headers.get('content-type');
    if (!contentType.includes('text/html')) return console.log(`Content-Type is not text/html: ${contentType}. Aborting`);

    const html = await response.text();
    const links = getURLsfromHTML(html, baseURL);
    links.forEach(link => {
      if (pages[link]) pages[link]++;
      else pages[link] = 1;
    });
    await Promise.all(
      links
        .filter(link => !visited.has(normalizeURL(link)))
        .map(link => crawlPage(baseURL, link, pages, visited))
    );

    return pages;
  } catch (e) {
    console.error(e?.message);
  }
}

module.exports = {
  normalizeURL,
  getURLsfromHTML,
  crawlPage,
}
