import { useMemo, useState } from 'react'
import { load, dump } from 'js-yaml'
import { EditorToolbar, TextInput, ErrorBanner, EmptyState } from '../components/EditorToolbar'
import { SplitPanel } from '../components/SplitPanel'
import { FormattedView } from '../components/FormattedView'
import { TreeView } from '../components/TreeView'
import { buildTree } from '../utils/tree'
import styles from './ToolPage.module.css'

const SAMPLE = `name: FmtKit
version: 1
features:
  - json
  - yaml
  - csv
config:
  theme: dark
  lineNumbers: true
active: true`

type YamlViewerProps = {
  onCopy: (message: string) => void
}

export function YamlViewer({ onCopy }: YamlViewerProps) {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [formatted, setFormatted] = useState<string | null>(null)
  const [parsed, setParsed] = useState<unknown>(null)

  const tree = useMemo(() => (parsed !== null ? buildTree(parsed) : null), [parsed])

  const handleFormat = () => {
    if (!input.trim()) {
      setError('Paste YAML to format')
      setFormatted(null)
      setParsed(null)
      return
    }
    try {
      const data = load(input)
      setParsed(data)
      setFormatted(dump(data, { indent: 2, lineWidth: -1, noRefs: true }))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid YAML')
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
        placeholder="Paste YAML here..."
      />
      {error && <ErrorBanner message={error} />}
      {formatted && tree ? (
        <SplitPanel
          leftTitle="Formatted"
          rightTitle="Tree view"
          left={<FormattedView content={formatted} language="yaml" />}
          right={<TreeView root={tree} onCopy={onCopy} />}
        />
      ) : (
        !error && <EmptyState message="Paste YAML and click Parse & format" />
      )}
    </div>
  )
}
