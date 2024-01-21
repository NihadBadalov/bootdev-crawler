const { argv } = require('node:process');
const { crawlPage } = require('./crawl');

async function main() {
  if (argv.length < 3) throw new Error('No baseURL specified');
  if (argv.length > 3) throw new Error('Too many arguments');

  const baseURL = argv[2];

  console.log(`Started crawling: ${baseURL}`);

  /** @type {{
    [key: string]: number;
  }} */
  const pages = {};

  /** @type {Set<string>} */
  const visited = new Set();

  await crawlPage(baseURL, baseURL, pages, visited, true);
  
  console.log('\nCrawl complete. Pages and occurances:');
  for (const [page, occurances] of Object.entries(pages)) {
    console.log(`${page}: ${occurances}`);
  };
}

main()
