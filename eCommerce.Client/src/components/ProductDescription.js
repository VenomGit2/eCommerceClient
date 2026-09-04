const SUBHEADING_PATTERN = /^[A-Z][A-Za-z0-9 &]{1,30}:$/;

function parseDescription(text) {
  const blocks = text.trim().split(/\n\s*\n/);
  const sections = [];
  let current = { heading: null, paragraphs: [], bullets: [] };

  const flush = () => {
    if (current.heading || current.paragraphs.length || current.bullets.length) {
      sections.push(current);
    }
    current = { heading: null, paragraphs: [], bullets: [] };
  };

  blocks.forEach((block) => {
    const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
    lines.forEach((line) => {
      if (SUBHEADING_PATTERN.test(line)) {
        flush();
        current.heading = line.replace(/:$/, '');
      } else if (line.startsWith('- ')) {
        current.bullets.push(line.slice(2).trim());
      } else {
        current.paragraphs.push(line);
      }
    });
  });
  flush();
  return sections;
}

export default function ProductDescription({ text }) {
  if (!text?.trim()) return null;
  const sections = parseDescription(text);

  return (
    <div className="product-description">
      <h2 className="product-description__title">Product details</h2>
      {sections.map((section, index) => (
        <div className="product-description__section" key={index}>
          {section.heading && <h3 className="product-description__heading">{section.heading}</h3>}
          {section.paragraphs.map((paragraph, pIndex) => (
            <p key={pIndex} className="product-description__paragraph">{paragraph}</p>
          ))}
          {section.bullets.length > 0 && (
            <ul className="product-description__bullets">
              {section.bullets.map((bullet, bIndex) => <li key={bIndex}>{bullet}</li>)}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}