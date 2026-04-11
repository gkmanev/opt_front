import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

const siteUrl = 'https://putpulse.com';
const socialImageUrl = `${siteUrl}/putpulse-dot.svg`;
const lastModified = '2026-04-11';

const marketingPages = [
  {
    path: '/',
    title: 'PutPulse | Cash-Secured Put Ideas and Wheel Strategy Insights',
    description:
      'Find cash-secured put-selling opportunities on fundamentally strong stocks, track monthly ROI targets, and follow a disciplined wheel strategy workflow.',
    appHtml: `
      <main>
        <h1>Get consistent monthly income by selling PUTs</h1>
        <p>PutPulse helps investors find cash-secured put-selling opportunities on stocks they would be comfortable owning.</p>
        <p>The public guides explain cash-secured puts, covered calls, stock assignment, and the full wheel strategy workflow.</p>
        <p><a href="/cash-secured-puts">Cash-Secured Puts Guide</a> <a href="/covered-calls">Covered Calls Guide</a> <a href="/wheel-strategy">Wheel Strategy Guide</a> <a href="/methodology">Methodology</a></p>
      </main>
    `,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'PutPulse',
        url: `${siteUrl}/`,
        description:
          'Find cash-secured put-selling opportunities on fundamentally strong stocks, track monthly ROI targets, and follow a disciplined wheel strategy workflow.',
        isPartOf: `${siteUrl}/#website`,
        dateModified: lastModified,
      },
    ],
  },
  {
    path: '/about',
    title: 'About PutPulse',
    description:
      'Learn what PutPulse is built for, who it serves, and how the product approaches option income research on quality stocks.',
    appHtml: `
      <main>
        <h1>About PutPulse</h1>
        <p>PutPulse is an educational options research product focused on cash-secured puts, covered calls, and disciplined wheel strategy workflows.</p>
        <p>The product is built for investors who care about assignment quality and want a repeatable process instead of random premium chasing.</p>
      </main>
    `,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About PutPulse',
        url: `${siteUrl}/about`,
        description:
          'Learn what PutPulse is built for, who it serves, and how the product approaches option income research on quality stocks.',
        isPartOf: `${siteUrl}/#website`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'PutPulse',
        url: siteUrl,
        description:
          'PutPulse is an educational options research product focused on cash-secured puts, covered calls, and wheel strategy workflows.',
      },
    ],
  },
  {
    path: '/cash-secured-puts',
    title: 'Cash-Secured Puts Guide | PutPulse',
    description:
      'Learn how cash-secured puts work, how assignment fits the strategy, and what to check before selling puts on stocks you want to own.',
    appHtml: `
      <main>
        <h1>Cash-secured puts: collect premium at prices you want to own</h1>
        <p>Cash-secured puts let investors collect premium while waiting for an entry price on stocks they are willing to buy.</p>
        <p>PutPulse focuses on setups where assignment is acceptable and the trade can continue into the covered call side of the wheel.</p>
      </main>
    `,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Cash-Secured Puts Guide',
        description:
          'Learn how cash-secured puts work, how assignment fits the strategy, and what to check before selling puts on stocks you want to own.',
        mainEntityOfPage: `${siteUrl}/cash-secured-puts`,
        dateModified: lastModified,
        author: {
          '@type': 'Organization',
          name: 'PutPulse',
        },
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
      },
    ],
  },
  {
    path: '/contact',
    title: 'Contact PutPulse',
    description:
      'Contact PutPulse for product questions, support issues, methodology questions, and partnership inquiries.',
    appHtml: `
      <main>
        <h1>Contact PutPulse</h1>
        <p>Contact PutPulse for product questions, support issues, methodology questions, and partnership inquiries.</p>
        <p>Email: <a href="mailto:admin@putpulse.com">admin@putpulse.com</a></p>
      </main>
    `,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact PutPulse',
        description: 'Contact PutPulse via admin@putpulse.com.',
        url: `${siteUrl}/contact`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'PutPulse',
        url: siteUrl,
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: 'admin@putpulse.com',
            availableLanguage: ['en'],
          },
        ],
      },
    ],
  },
  {
    path: '/covered-calls',
    title: 'Covered Calls Guide | PutPulse',
    description:
      'Learn how covered calls work, when to sell calls against stock you own, and how the strategy fits into a disciplined income workflow.',
    appHtml: `
      <main>
        <h1>Covered calls: generate income from shares you already own</h1>
        <p>Covered calls turn stock positions into income-producing positions by selling call premium against shares already held.</p>
        <p>At PutPulse, covered calls are treated as the second half of the wheel after stock assignment from a cash-secured put.</p>
      </main>
    `,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Covered Calls Guide',
        description:
          'Learn how covered calls work, when to sell calls against stock you own, and how the strategy fits into a disciplined income workflow.',
        mainEntityOfPage: `${siteUrl}/covered-calls`,
        dateModified: lastModified,
        author: {
          '@type': 'Organization',
          name: 'PutPulse',
        },
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
      },
    ],
  },
  {
    path: '/methodology',
    title: 'Methodology | PutPulse',
    description:
      'See how PutPulse narrows option setups into a shortlist and how to use the research output inside a disciplined options workflow.',
    appHtml: `
      <main>
        <h1>Methodology: how PutPulse narrows option setups into a usable shortlist</h1>
        <p>PutPulse starts with companies worth owning, then screens for option income that is meaningful on collateral and suitable for a disciplined wheel workflow.</p>
        <p>The goal is to reduce noise and help investors focus on repeatable setups rather than random premium spikes.</p>
      </main>
    `,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'PutPulse Methodology',
        description:
          'See how PutPulse narrows option setups into a shortlist and how to use the research output inside a disciplined options workflow.',
        mainEntityOfPage: `${siteUrl}/methodology`,
        dateModified: lastModified,
        author: {
          '@type': 'Organization',
          name: 'PutPulse',
        },
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
      },
    ],
  },
  {
    path: '/wheel-strategy',
    title: 'Wheel Strategy Guide | PutPulse',
    description:
      'Understand the wheel strategy workflow: sell cash-secured puts, accept assignment on quality stocks, and sell covered calls with discipline.',
    appHtml: `
      <main>
        <h1>Wheel strategy: turn assignment into a repeatable income cycle</h1>
        <p>The wheel strategy combines cash-secured puts, stock assignment, and covered calls into a repeatable options income process.</p>
        <p>PutPulse focuses on using the wheel with screened stocks that investors would be comfortable owning through assignment.</p>
      </main>
    `,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Wheel Strategy Guide',
        description:
          'Understand the wheel strategy workflow: sell cash-secured puts, accept assignment on quality stocks, and sell covered calls with discipline.',
        mainEntityOfPage: `${siteUrl}/wheel-strategy`,
        dateModified: lastModified,
        author: {
          '@type': 'Organization',
          name: 'PutPulse',
        },
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
      },
    ],
  },
];

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const escapeAttribute = (value) => escapeHtml(value).replaceAll("'", '&#39;');

const buildCanonicalUrl = (routePath) => `${siteUrl}${routePath === '/' ? '/' : routePath}`;

const replaceTitle = (html, title) => html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

const replaceMetaTag = (html, key, name, content) => {
  const tag = `<meta ${key}="${name}" content="${escapeAttribute(content)}" />`;
  const pattern = new RegExp(`<meta[^>]+${key}=["']${name}["'][^>]*>`, 'i');
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n</head>`);
};

const replaceCanonical = (html, href) => {
  const tag = `<link rel="canonical" href="${escapeAttribute(href)}" />`;
  const pattern = /<link[^>]+rel=["']canonical["'][^>]*>/i;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n</head>`);
};

const stripPrerenderedJsonLd = (html) =>
  html.replace(/\s*<script type="application\/ld\+json" data-prerender-route-jsonld="true">[\s\S]*?<\/script>/gi, '');

const injectStructuredData = (html, items) => {
  const scripts = items
    .map(
      (item) =>
        `  <script type="application/ld+json" data-prerender-route-jsonld="true">${JSON.stringify(item)}</script>`,
    )
    .join('\n');
  return html.replace('</head>', `${scripts}\n</head>`);
};

const replaceAppMarkup = (html, appHtml) =>
  html.replace(/<div id="app"><\/div>/i, `<div id="app" data-seo-prerender="true">${appHtml.trim()}</div>`);

const buildPageHtml = (template, page) => {
  const canonicalUrl = buildCanonicalUrl(page.path);
  let html = template;

  html = replaceTitle(html, page.title);
  html = replaceMetaTag(html, 'name', 'description', page.description);
  html = replaceMetaTag(html, 'name', 'robots', 'index,follow');
  html = replaceMetaTag(html, 'property', 'og:type', 'website');
  html = replaceMetaTag(html, 'property', 'og:site_name', 'PutPulse');
  html = replaceMetaTag(html, 'property', 'og:title', page.title);
  html = replaceMetaTag(html, 'property', 'og:description', page.description);
  html = replaceMetaTag(html, 'property', 'og:url', canonicalUrl);
  html = replaceMetaTag(html, 'property', 'og:image', socialImageUrl);
  html = replaceMetaTag(html, 'name', 'twitter:card', 'summary');
  html = replaceMetaTag(html, 'name', 'twitter:title', page.title);
  html = replaceMetaTag(html, 'name', 'twitter:description', page.description);
  html = replaceMetaTag(html, 'name', 'twitter:image', socialImageUrl);
  html = replaceCanonical(html, canonicalUrl);
  html = stripPrerenderedJsonLd(html);
  html = injectStructuredData(html, page.structuredData);
  html = replaceAppMarkup(html, page.appHtml);

  return html;
};

const writeMarketingPage = async (template, page) => {
  const html = buildPageHtml(template, page);

  if (page.path === '/') {
    await writeFile(indexHtmlPath, html, 'utf8');
    return;
  }

  const outputDir = path.join(distDir, page.path.slice(1));
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, 'index.html'), html, 'utf8');
};

const main = async () => {
  const template = await readFile(indexHtmlPath, 'utf8');
  await Promise.all(marketingPages.map((page) => writeMarketingPage(template, page)));
};

await main();
