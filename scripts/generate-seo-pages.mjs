import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

const isProTraidSite = String(process.env.VITE_LANDING ?? '').trim().toLowerCase() === 'protraid';
const landingBrand = isProTraidSite ? 'ProTraid Band' : 'PutPulse';
const landingEmail = isProTraidSite ? 'office@protraidband.com' : 'office@putpulse.com';
const siteUrl = String(process.env.VITE_SITE_URL ?? '').trim().replace(/\/+$/, '') || 'https://putpulse.com';
const socialImageUrl = `${siteUrl}/putpulse-dot.svg`;
const lastModified = '2026-04-11';

const marketingPages = [
  {
    path: '/',
    lang: 'bg',
    title: `${landingBrand} | Сигнална гривна с бутон SOS за възрастни хора`,
    description:
      'Гривна с бутон SOS, която следи пулса, кръвното и температурата и показва къде е вашият близък. 422 € с включен 1 год. абонамент.',
    appHtml: `
      <main>
        <h1>Спокойствие за вас. Сигурност за тях.</h1>
        <p>Сигнално устройство за възрастни хора: гривна с бутон SOS, която следи пулса, кръвното и температурата и показва къде е вашият близък — от всяка точка на света.</p>
        <h2>Какво прави гривната</h2>
        <ul>
          <li><strong>Бутон SOS</strong> — едно натискане и вие получавате сигнал и обаждане.</li>
          <li><strong>Пулс и кръвно</strong> — автоматично измерване всеки ден, без нужда от действие.</li>
          <li><strong>Температура</strong> — следите показателите в уеб платформата по всяко време.</li>
          <li><strong>Местоположение</strong> — виждате на картата къде е вашият близък.</li>
        </ul>
        <h2>Как работи</h2>
        <ol>
          <li><strong>Гривната</strong> — носи се като часовник. Измерва показателите и изпраща сигнал при нужда.</li>
          <li><strong>Уеб платформата</strong> — от телефон или компютър виждате данните и получавате известия.</li>
          <li><strong>Социален асистент</strong> — по желание, редовни посещения у дома от наш асистент.</li>
        </ol>
        <h2>Бъдете до тях, дори когато не сте</h2>
        <p>Цена: 422 € с включен 1 год. абонамент.</p>
        <p>Контакти: <a href="mailto:${landingEmail}">${landingEmail}</a></p>
      </main>
    `,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `${landingBrand} сигнална гривна с бутон SOS`,
        description:
          'Гривна с бутон SOS за възрастни хора, която следи пулса, кръвното и температурата и показва местоположението.',
        brand: {
          '@id': `${siteUrl}/#organization`,
        },
        offers: {
          '@type': 'Offer',
          price: '422',
          priceCurrency: 'EUR',
          url: `${siteUrl}/`,
        },
      },
    ],
  },
  {
    path: '/opt',
    title: 'Sign in | PutPulse',
    description: 'Sign in with your PutPulse username and password.',
    robots: 'noindex,follow',
    appHtml: '<main><p>Sign in to access PutPulse.</p><a href="/login">Sign in</a></main>',
    structuredData: [],
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
    path: '/vs-chatgpt',
    title: 'PutPulse vs ChatGPT | Live Options Data for Investors',
    description:
      'See how PutPulse combines AI with live options chains, current market data, and company fundamentals for options investors.',
    appHtml: `
      <main>
        <h1>PutPulse vs ChatGPT</h1>
        <p>ChatGPT is a general-purpose AI assistant. PutPulse is built specifically for options investors.</p>
        <p>PutPulse combines AI with live options chains, current market data, and current company fundamentals to screen and analyze options opportunities.</p>
        <p>PutPulse = AI + live options data + current fundamentals + purpose-built screening.</p>
      </main>
    `,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'PutPulse vs ChatGPT',
        url: `${siteUrl}/vs-chatgpt`,
        description:
          'See how PutPulse combines AI with live options chains, current market data, and company fundamentals for options investors.',
        isPartOf: `${siteUrl}/#website`,
        dateModified: lastModified,
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

  if (page.lang) html = html.replace(/<html lang="[^"]*">/i, `<html lang="${page.lang}">`);
  html = replaceTitle(html, page.title);
  html = replaceMetaTag(html, 'name', 'description', page.description);
  html = replaceMetaTag(html, 'name', 'robots', page.robots ?? 'index,follow');
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

// Retain page definitions for future use without publishing these routes.
const disabledRoutes = new Set([
  '/about',
  '/pricing',
  '/vs-chatgpt',
  '/contact',
  '/methodology',
  '/cash-secured-puts',
  '/covered-calls',
  '/wheel-strategy',
  '/terms',
  '/privacy',
  '/refund-policy',
]);

const main = async () => {
  const template = await readFile(indexHtmlPath, 'utf8');
  await Promise.all(marketingPages.filter((page) => !disabledRoutes.has(page.path)).map((page) => writeMarketingPage(template, page)));
};

await main();
