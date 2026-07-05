import { useState } from 'react'
import { dump } from 'js-yaml'
import { EditorToolbar, TextInput, ErrorBanner, EmptyState } from '../components/EditorToolbar'
import { SplitPanel } from '../components/SplitPanel'
import { FormattedView } from '../components/FormattedView'
import { copyText } from '../utils/copy'
import styles from './ToolPage.module.css'
import toolbarStyles from '../components/EditorToolbar.module.css'

const SAMPLE = `{
  "apiVersion": "v1",
  "kind": "ConfigMap",
  "metadata": {
    "name": "app-config"
  },
  "data": {
    "LOG_LEVEL": "info",
    "MAX_CONNECTIONS": 100
  }
}`

type JsonToYamlProps = {
  onCopy: (message: string) => void
}

export function JsonToYaml({ onCopy }: JsonToYamlProps) {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [output, setOutput] = useState<string | null>(null)

  const handleConvert = () => {
    if (!input.trim()) {
      setError('Paste JSON to convert')
      setOutput(null)
      return
    }
    try {
      const data = JSON.parse(input)
      const result = dump(data, { indent: 2, lineWidth: -1, noRefs: true })
      setOutput(result)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      setOutput(null)
    }
  }

  const handleCopyOutput = async () => {
    if (!output) return
    const ok = await copyText(output)
    onCopy(ok ? 'YAML copied to clipboard' : 'Copy failed')
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
        formatLabel="Convert to YAML"
      />
      {error && <ErrorBanner message={error} />}
      {output ? (
        <SplitPanel
          leftTitle="JSON input"
          rightTitle="YAML output"
          left={
            <TextInput
              value={input}
              onChange={setInput}
              placeholder='Paste JSON here, e.g. {"key": "value"}'
            />
          }
          right={
            <div className={styles.outputWrap}>
              <div className={styles.outputToolbar}>
                <button type="button" className={toolbarStyles.btnPrimary} onClick={handleCopyOutput}>
                  Copy YAML
                </button>
              </div>
              <FormattedView content={output} language="yaml" />
            </div>
          }
        />
      ) : (
        <>
          <TextInput
            value={input}
            onChange={setInput}
            placeholder='Paste JSON here, e.g. {"key": "value"}'
          />
          {!error && <EmptyState message="Paste JSON and click Convert to YAML" />}
        </>
      )}
    </div>
  )
}
