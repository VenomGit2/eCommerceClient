import Button from './Button';

export default function CookieBanner({ onAccept }) {
  return (
    <section className="cookie-banner" aria-label="Cookie notice">
      <div className="cookie-banner__copy">
        <p className="eyebrow">Your privacy matters</p>
        <p>We use essential cookies to keep your cart secure, protect your account, and remember your preferences.</p>
      </div>
      <Button className="cookie-banner__action" onClick={onAccept}>Accept essential cookies</Button>
    </section>
  );
}
