import { useMemo, useState } from 'react'
import { EditorToolbar, TextInput, ErrorBanner, EmptyState } from '../components/EditorToolbar'
import { SplitPanel } from '../components/SplitPanel'
import { FormattedView } from '../components/FormattedView'
import { TreeView } from '../components/TreeView'
import { buildTree } from '../utils/tree'
import styles from './ToolPage.module.css'

const SAMPLE = `{
  "name": "FmtKit",
  "version": 1,
  "features": ["json", "yaml", "csv"],
  "config": {
    "theme": "dark",
    "lineNumbers": true
  },
  "active": true
}`

type JsonViewerProps = {
  onCopy: (message: string) => void
}

export function JsonViewer({ onCopy }: JsonViewerProps) {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [formatted, setFormatted] = useState<string | null>(null)
  const [parsed, setParsed] = useState<unknown>(null)

  const tree = useMemo(() => (parsed !== null ? buildTree(parsed) : null), [parsed])

  const handleFormat = () => {
    if (!input.trim()) {
      setError('Paste JSON to format')
      setFormatted(null)
      setParsed(null)
      return
    }
    try {
      const data = JSON.parse(input)
      setParsed(data)
      setFormatted(JSON.stringify(data, null, 2))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      setFormatted(null)
      setParsed(null)
    }
  }

  const handleClear = () => {
    setInput('')
    setError(null)
    setFormatted(null)
    setParsed(null)
  }

  return (
    <div className={styles.page}>
      <EditorToolbar
        onFormat={handleFormat}
        onClear={handleClear}
        onSample={() => setInput(SAMPLE)}
        formatLabel="Parse & format"
      />
      <TextInput
        value={input}
        onChange={setInput}
        placeholder='Paste JSON here, e.g. {"key": "value"}'
      />
      {error && <ErrorBanner message={error} />}
      {formatted && tree ? (
        <SplitPanel
          leftTitle="Formatted"
          rightTitle="Tree view"
          left={<FormattedView content={formatted} language="json" />}
          right={<TreeView root={tree} onCopy={onCopy} />}
        />
      ) : (
        !error && <EmptyState message="Paste JSON and click Parse & format" />
      )}
    </div>
  )
}
