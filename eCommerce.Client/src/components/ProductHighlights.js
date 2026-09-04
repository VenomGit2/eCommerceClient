import { parseDescription } from './ProductDescription';

export default function ProductHighlights({ text, limit = 6 }) {
  if (!text?.trim()) return null;

  const sections = parseDescription(text);
  const allBullets = sections.flatMap((section) => section.bullets);
  if (allBullets.length === 0) return null;

  const shown = allBullets.slice(0, limit);

  return (
    <ul className="product-highlights">
      {shown.map((bullet, index) => {
        const [label, ...rest] = bullet.split(':');
        const detail = rest.join(':').trim();
        return (
          <li key={index} className="product-highlights__item">
            <span className="product-highlights__dot" aria-hidden="true" />
            {detail
              ? <span><strong>{label.trim()}:</strong> {detail}</span>
              : <span>{bullet}</span>}
          </li>
        );
      })}
    </ul>
  );
}