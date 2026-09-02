import { useEffect } from 'react';

const SITE_NAME = 'Circuit & Grain';

const DEFAULT_TITLE =
'Circuit & Grain | Tech, home, and everything between';

const DEFAULT_DESCRIPTION =
'Fresh finds for your setup, your space, and your main-character era. Tech, home, and everything between.';

const DEFAULT_URL =
process.env.REACT_APP_SITE_URL ||
'https://ecommerceclient.insanedk46.workers.dev/';

const DEFAULT_IMAGE = `${DEFAULT_URL.replace(/\/$/, '')}/og-default.png`;

function setMeta(attr, key, value) {
let el = document.head.querySelector(`meta[${attr}="${key}"]`);

if (!el) {
el = document.createElement('meta');
el.setAttribute(attr, key);
document.head.appendChild(el);
}

if (value != null && value !== '') {
el.setAttribute('content', String(value));
} else {
el.remove();
}
}

function setLink(rel, href) {
let el = document.head.querySelector(`link[rel="${rel}"]`);

if (!el) {
el = document.createElement('link');
el.setAttribute('rel', rel);
document.head.appendChild(el);
}

el.setAttribute('href', href);
}

function setJsonLd(data) {
let el = document.head.querySelector('#dynamic-jsonld');

if (!data) {
el?.remove();
return;
}

if (!el) {
el = document.createElement('script');
el.id = 'dynamic-jsonld';
el.type = 'application/ld+json';
document.head.appendChild(el);
}

el.textContent = JSON.stringify(data);
}

function applyMeta({
title,
description,
image,
url,
type = 'website',
price,
currency = 'USD',
availability = 'https://schema.org/InStock',
}) {
const resolvedTitle = title
? `${title} | ${SITE_NAME}`
: DEFAULT_TITLE;
const resolvedDescription = description || DEFAULT_DESCRIPTION;
const resolvedImage = image || DEFAULT_IMAGE;
const resolvedUrl = url || DEFAULT_URL;

document.title = resolvedTitle;

setMeta('name', 'description', resolvedDescription);
setLink('canonical', resolvedUrl);

setMeta('property', 'og', SITE_NAME);
setMeta('property', 'og', type);
setMeta('property', 'og', 'en_US');
setMeta('property', 'og', resolvedTitle);
setMeta('property', 'og', resolvedDescription);
setMeta('property', 'og', resolvedUrl);
setMeta('property', 'og', resolvedImage);
setMeta('property', 'og:image', resolvedImage);
setMeta(
'property',
'og:image',
resolvedImage.endsWith('.png') ? 'image/png' : 'image/jpeg'
);
setMeta('property', 'og:image', '1200');
setMeta('property', 'og:image', '630');
setMeta('property', 'og:image', resolvedTitle);

if (type === 'product' && price != null) {
setMeta('property', 'product:price', price);
setMeta('property', 'product:price', currency);
setMeta('property', 'og:price', price);
setMeta('property', 'og:price', currency);
setMeta('property', 'og', 'instock');
} else {
setMeta('property', 'product:price', '');
setMeta('property', 'product:price', '');
setMeta('property', 'og:price', '');
setMeta('property', 'og:price', '');
setMeta('property', 'og', '');
}

setMeta('name', 'twitter', 'summary_large_image');
setMeta('name', 'twitter', resolvedTitle);
setMeta('name', 'twitter', resolvedDescription);
setMeta('name', 'twitter', resolvedImage);
setMeta('name', 'twitter:image', resolvedTitle);

if (type === 'product') {
setJsonLd({
'@context': 'https://schema.org',
'@type': 'Product',
name: title,
description: resolvedDescription,
image: resolvedImage,
offers: {
'@type': 'Offer',
price: price != null ? price : '0.00',
priceCurrency: currency,
availability,
url: resolvedUrl,
},
});
} else {
setJsonLd(null);
}
}

function resetMeta() {
applyMeta({});
}

export default function usePageMeta(meta, deps = []) {
useEffect(() => {
if (!meta) {
resetMeta();
return undefined;
}

applyMeta(meta);

return () => {
  resetMeta();
};

}, deps);
}
