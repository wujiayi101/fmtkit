import { useState } from 'react'
import { load } from 'js-yaml'
import { EditorToolbar, TextInput, ErrorBanner, EmptyState } from '../components/EditorToolbar'
import { SplitPanel } from '../components/SplitPanel'
import { FormattedView } from '../components/FormattedView'
import { copyText } from '../utils/copy'
import styles from './ToolPage.module.css'
import toolbarStyles from '../components/EditorToolbar.module.css'

const SAMPLE = `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  LOG_LEVEL: info
  MAX_CONNECTIONS: 100`

type YamlToJsonProps = {
  onCopy: (message: string) => void
}

export function YamlToJson({ onCopy }: YamlToJsonProps) {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [output, setOutput] = useState<string | null>(null)

  const handleConvert = () => {
    if (!input.trim()) {
      setError('Paste YAML to convert')
      setOutput(null)
      return
    }
    try {
      const data = load(input)
      const result = JSON.stringify(data, null, 2)
      setOutput(result)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid YAML')
      setOutput(null)
    }
  }

  const handleCopyOutput = async () => {
    if (!output) return
    const ok = await copyText(output)
    onCopy(ok ? 'JSON copied to clipboard' : 'Copy failed')
  }

  const handleClear = () => {
    setInput('')
    setError(null)
    setOutput(null)
  }

  return (
    <div className={styles.page}>
      <EditorToolbar
        onFormat={handleConvert}
        onClear={handleClear}
        onSample={() => setInput(SAMPLE)}
        formatLabel="Convert to JSON"
      />
      {error && <ErrorBanner message={error} />}
      {output ? (
        <SplitPanel
          leftTitle="YAML input"
          rightTitle="JSON output"
          left={
            <TextInput
              value={input}
              onChange={setInput}
              placeholder="Paste YAML here..."
            />
          }
          right={
            <div className={styles.outputWrap}>
              <div className={styles.outputToolbar}>
                <button type="button" className={toolbarStyles.btnPrimary} onClick={handleCopyOutput}>
                  Copy JSON
                </button>
              </div>
              <FormattedView content={output} language="json" />
            </div>
          }
        />
      ) : (
        <>
          <TextInput
            value={input}
            onChange={setInput}
            placeholder="Paste YAML here..."
          />
          {!error && <EmptyState message="Paste YAML and click Convert to JSON" />}
        </>
      )}
    </div>
  )
}
