import type { CodeSample } from '../data/portfolio'

const MARKS = ['①', '②', '③', '④', '⑤']

export default function CodeBlock({ sample }: { sample: CodeSample }) {
  const lines = sample.code.split('\n')
  return (
    <figure className="code">
      <figcaption className="code__file">{sample.file}</figcaption>
      <pre className="code__body">
        {lines.map((line, i) => (
          <span key={i} className={sample.highlight.includes(i + 1) ? 'code__line code__line--hl' : 'code__line'}>
            {line || ' '}
            {'\n'}
          </span>
        ))}
      </pre>
      <ol className="code__notes">
        {sample.notes.map((note, i) => (
          <li key={i}>
            <span className="code__mark">{MARKS[i]}</span>
            {note}
          </li>
        ))}
      </ol>
      <p className="code__meta">
        <strong>시나리오</strong> {sample.scenario}
      </p>
      <p className="code__meta">
        <strong>테스트</strong> <code>{sample.test}</code>
      </p>
    </figure>
  )
}
