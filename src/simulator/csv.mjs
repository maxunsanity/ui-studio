/** Strict CSV reader shared by the simulator host and its build command. */
export function parseCsv(text, name = 'simulator') {
 const records = []; let cells = [], value = '', quoted = false;
 text = text.replace(/^\uFEFF/, '');
 for (let i = 0; i < text.length; i++) {
  const c = text[i];
  if (c === '"') { if (quoted && text[i + 1] === '"') { value += '"'; i++; } else quoted = !quoted; }
  else if (c === ',' && !quoted) { cells.push(value); value = ''; }
  else if ((c === '\n' || c === '\r') && !quoted) { if (c === '\r' && text[i + 1] === '\n') i++; cells.push(value); if (cells.some(v => v.length)) records.push(cells); cells = []; value = ''; }
  else value += c;
 }
 if (quoted) throw Error(name + ': unclosed CSV quote');
 cells.push(value); if (cells.some(v => v.length)) records.push(cells);
 const headers = records.shift(); if (!headers) throw Error(name + ': missing headers');
 if (new Set(headers).size !== headers.length || headers.some(h => !h)) throw Error(name + ': duplicate or empty headers');
 return records.map((row, i) => { if (row.length !== headers.length) throw Error(name + ': invalid columns at record ' + (i + 2)); return Object.fromEntries(headers.map((h, j) => [h, row[j]])); });
}
