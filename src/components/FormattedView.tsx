import styles from './FormattedView.module.css'

type FormattedViewProps = {
  content: string
  language: 'json' | 'yaml'
}

export function FormattedView({ content, language }: FormattedViewProps) {
  const lines = content.split('\n')

  return (
    <pre className={styles.pre}>
      <code className={styles.code}>
        {lines.map((line, i) => (
          <div key={i} className={styles.line}>
            <span className={styles.lineNum}>{i + 1}</span>
            <span className={styles.lineContent}>
              <HighlightedLine line={line} language={language} />
            </span>
          </div>
        ))}
      </code>
    </pre>
  )
}

function HighlightedLine({ line, language }: { line: string; language: 'json' | 'yaml' }) {
  if (language === 'yaml') {
    return <YamlLine line={line} />
  }
  return <JsonLine line={line} />
}

function JsonLine({ line }: { line: string }) {
  const trimmed = line.trim()

  if (/^".*":/.test(trimmed)) {
    const match = trimmed.match(/^(".*?")(\s*:\s*)(.*)$/)
    if (match) {
      return (
        <>
          <span className={styles.key}>{match[1]}</span>
          <span className={styles.punct}>{match[2]}</span>
          <JsonValue value={match[3]} />
        </>
      )
    }
  }

  return <JsonValue value={trimmed} />
}

function JsonValue({ value }: { value: string }) {
  if (/^"/.test(value)) return <span className={styles.string}>{value}</span>
  if (/^(true|false)$/.test(value)) return <span className={styles.boolean}>{value}</span>
  if (/^null$/.test(value)) return <span className={styles.null}>{value}</span>
  if (/^-?\d/.test(value)) return <span className={styles.number}>{value}</span>
  if (/^[\[\]{}],?$/.test(value)) return <span className={styles.punct}>{value}</span>
  return <span>{value}</span>
}

function YamlLine({ line }: { line: string }) {
  if (!line.trim() || line.trim().startsWith('#')) {
    return <span className={styles.comment}>{line || ' '}</span>
  }

  const kvMatch = line.match(/^(\s*)([\w.-]+)(\s*:\s*)(.*)$/)
  if (kvMatch) {
    return (
      <>
        <span>{kvMatch[1]}</span>
        <span className={styles.key}>{kvMatch[2]}</span>
        <span className={styles.punct}>{kvMatch[3]}</span>
        <YamlValue value={kvMatch[4]} />
      </>
    )
  }

  const listMatch = line.match(/^(\s*-\s*)(.*)$/)
  if (listMatch) {
    return (
      <>
        <span className={styles.punct}>{listMatch[1]}</span>
        <YamlValue value={listMatch[2]} />
      </>
    )
  }

  return <span>{line}</span>
}

function YamlValue({ value }: { value: string }) {
  if (/^["']/.test(value)) return <span className={styles.string}>{value}</span>
  if (/^(true|false|null|~)$/i.test(value.trim())) return <span className={styles.boolean}>{value}</span>
  if (/^-?\d/.test(value.trim())) return <span className={styles.number}>{value}</span>
  return <span className={styles.string}>{value}</span>
}
