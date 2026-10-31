function formatInline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => (
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : part
  ));
}

function cellsFromRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
}

function readTable(lines, start) {
  if (!lines[start]?.trim().startsWith('|') || !lines[start + 1]?.trim().startsWith('|')) return null;
  const headers = cellsFromRow(lines[start]);
  const separators = cellsFromRow(lines[start + 1]);
  if (headers.length < 2 || separators.length !== headers.length
    || !separators.every((cell) => /^:?-{3,}:?$/.test(cell))) return null;

  const rows = [];
  let end = start + 2;
  while (lines[end]?.trim().startsWith('|')) {
    const cells = cellsFromRow(lines[end]);
    if (cells.length !== headers.length) break;
    rows.push(cells);
    end += 1;
  }
  return rows.length ? { headers, rows, end } : null;
}

function DetailCards({ headers, rows }) {
  return (
    <div className="ai-chat__data-cards">
      {rows.map((cells, rowIndex) => (
        <section className="ai-chat__data-card" aria-label={`Details ${rowIndex + 1}`} key={rowIndex}>
          <dl>
            {headers.map((header, index) => (
              <div className="ai-chat__data-field" key={index}>
                <dt>{header}</dt>
                <dd className={/^(total|amount)$/i.test(header) ? 'ai-chat__data-value--emphasis' : ''}>
                  {formatInline(cells[index])}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

export default function AiMessageContent({ content }) {
  const blocks = [];
  const lines = content.split(/\r?\n/);
  let paragraph = [];
  let list = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push(<p key={blocks.length}>{formatInline(paragraph.join('\n'))}</p>);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list.length) {
      blocks.push(
        <ul key={blocks.length}>
          {list.map((item, index) => <li key={index}>{formatInline(item)}</li>)}
        </ul>,
      );
      list = [];
    }
  };

  for (let index = 0; index < lines.length; index += 1) {
    const table = readTable(lines, index);
    if (table) {
      flushParagraph();
      flushList();
      blocks.push(<DetailCards key={blocks.length} headers={table.headers} rows={table.rows} />);
      index = table.end - 1;
      continue;
    }

    const line = lines[index];
    const bullet = line.match(/^\s*[-*]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      list.push(bullet[1]);
    } else if (!line.trim()) {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line);
    }
  }

  flushParagraph();
  flushList();
  return blocks;
}
