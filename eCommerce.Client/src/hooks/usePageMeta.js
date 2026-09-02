import { useEffect } from 'react';

const SITE_NAME = 'Circuit & Grain';
const DEFAULT_TITLE = 'Circuit & Grain | Tech, home, and everything between';
const DEFAULT_DESCRIPTION =
  'Fresh finds for your setup, your space, and your main-character era. Tech, home, and everything between.';
const DEFAULT_URL = process.env.REACT_APP_SITE_URL || 'https://ecommerceclient.insanedk46.workers.dev/';
const DEFAULT_IMAGE = `${DEFAULT_URL.replace(/\/$/, '')}/og-default.png`;

/**
 * Sets or creates a <meta> element with the given attribute key and content value.
 */
function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  if (value != null && value !== '') {
    el.setAttribute('content', String(value));
  } else if (el.parentNode) {
    el.parentNode.removeChild(el);
  }
}

/**
 * Sets or creates a <link> element with the given rel.
 */
function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Inserts or updates Schema.org JSON-LD structured data in <head>.
 * Supported by Google, Slack, Pinterest, and rich preview scrapers.
 */
function setJsonLd(data) {
  let el = document.head.querySelector('script#dynamic-jsonld');
  if (!data) {
    if (el) el.remove();
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

/**
 * Applies full OpenGraph, Twitter Card, and Schema metadata for any previewing app
 * (WhatsApp, Facebook, LinkedIn, Discord, Telegram, Slack, Apple Messages, Signal, etc.)
 */
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
  const resolvedTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const resolvedDescription = description || DEFAULT_DESCRIPTION;
  const resolvedImage = image || DEFAULT_IMAGE;
  const resolvedUrl = url || DEFAULT_URL;

  // Browser title
  document.title = resolvedTitle;

  // Standard metadata
  setMeta('name', 'description', resolvedDescription);
  setLink('canonical', resolvedUrl);

  // Universal Open Graph (WhatsApp, Facebook, LinkedIn, Telegram, Discord, Slack, Apple iMessage)
  setMeta('property', 'og:site_name', SITE_NAME);
  setMeta('property', 'og:type', type);
  setMeta('property', 'og:locale', 'en_US');
  setMeta('property', 'og:title', resolvedTitle);
  setMeta('property', 'og:description', resolvedDescription);
  setMeta('property', 'og:url', resolvedUrl);
  setMeta('property', 'og:image', resolvedImage);
  setMeta('property', 'og:image:secure_url', resolvedImage);
  setMeta('property', 'og:image:type', resolvedImage.endsWith('.png') ? 'image/png' : 'image/jpeg');
  setMeta('property', 'og:image:width', '1200');
  setMeta('property', 'og:image:height', '630');
  setMeta('property', 'og:image:alt', resolvedTitle);

  // Product-specific OpenGraph tags (for WhatsApp, Facebook Catalog, Pinterest Rich Pins)
  if (type === 'product' && price != null) {
    setMeta('property', 'product:price:amount', price);
    setMeta('property', 'product:price:currency', currency);
    setMeta('property', 'og:price:amount', price);
    setMeta('property', 'og:price:currency', currency);
    setMeta('property', 'og:availability', 'instock');
  } else {
    setMeta('property', 'product:price:amount', '');
    setMeta('property', 'product:price:currency', '');
    setMeta('property', 'og:price:amount', '');
    setMeta('property', 'og:price:currency', '');
    setMeta('property', 'og:availability', '');
  }

  // Twitter / X Card
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', resolvedTitle);
  setMeta('name', 'twitter:description', resolvedDescription);
  setMeta('name', 'twitter:image', resolvedImage);
  setMeta('name', 'twitter:image:alt', resolvedTitle);

  // Dynamic JSON-LD structured data for products
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

/**
 * usePageMeta — dynamically manages OpenGraph and social previews across all platforms.
 */
export default function usePageMeta(meta, deps = []) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!meta) return;
    applyMeta(meta);
    return () => resetMeta();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
