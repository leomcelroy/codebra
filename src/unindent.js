export function unindent(strings, ...values) {
  const fullString = strings.reduce((acc, str, i) => `${acc}${str}${values[i] || ''}`, '');
  const lines = fullString.split('\n');
  const indentLengths = lines.filter(line => line.trim()).map(line => line.match(/^(\s*)/)[0].length);
  const minIndent = Math.min(...indentLengths);

  return lines.map(line => line.slice(minIndent)).join('\n').trim();
}