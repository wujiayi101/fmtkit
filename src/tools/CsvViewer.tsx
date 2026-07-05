import { useMemo, useState } from 'react'
import Papa from 'papaparse'
import { EditorToolbar, TextInput, ErrorBanner, EmptyState } from '../components/EditorToolbar'
import { copyText } from '../utils/copy'
import styles from './ToolPage.module.css'
import tableStyles from '../components/CsvTable.module.css'

const SAMPLE = `name,role,score,active
Alice,Engineer,95,true
Bob,Designer,88,true
Carol,Manager,92,false
Dave,Analyst,87,true`

type CsvViewerProps = {
  onCopy: (message: string) => void
}

export function CsvViewer({ onCopy }: CsvViewerProps) {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<string[][]>([])

  const rowCount = rows.length
  const colCount = headers.length

  const handleParse = () => {
    if (!input.trim()) {
      setError('Paste CSV to render')
      setHeaders([])
      setRows([])
      return
    }

    const result = Papa.parse<string[]>(input.trim(), {
      skipEmptyLines: true,
    })

    if (result.errors.length > 0) {
      setError(result.errors[0]?.message ?? 'Invalid CSV')
      setHeaders([])
      setRows([])
      return
    }

    const data = result.data
    if (data.length === 0) {
      setError('CSV is empty')
      setHeaders([])
      setRows([])
      return
    }

    const [headerRow, ...bodyRows] = data
    setHeaders(headerRow.map((h, i) => h || `Column ${i + 1}`))
    setRows(bodyRows)
    setError(null)
  }

  const handleClear = () => {
    setInput('')
    setError(null)
    setHeaders([])
    setRows([])
  }

  const handleCopyCell = async (value: string) => {
    const ok = await copyText(value)
    onCopy(ok ? 'Cell copied' : 'Copy failed')
  }

  const handleCopyColumn = async (colIndex: number) => {
    const values = rows.map((row) => row[colIndex] ?? '')
    const ok = await copyText(values.join('\n'))
    onCopy(ok ? `Copied column "${headers[colIndex]}"` : 'Copy failed')
  }

  const stats = useMemo(() => {
    if (!headers.length) return null
    return `${rowCount} rows · ${colCount} columns`
  }, [rowCount, colCount, headers.length])

  return (
    <div className={styles.page}>
      <EditorToolbar
        onFormat={handleParse}
        onClear={handleClear}
        onSample={() => setInput(SAMPLE)}
        formatLabel="Render table"
        extra={stats ? <span className={styles.stats}>{stats}</span> : undefined}
      />
      {!headers.length && (
        <TextInput
          value={input}
          onChange={setInput}
          placeholder="Paste CSV here (comma-separated)..."
        />
      )}
      {error && <ErrorBanner message={error} />}
      {headers.length > 0 ? (
        <div className={styles.tableSection}>
          <div className={tableStyles.tableWrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th className={tableStyles.rowNum}>#</th>
                  {headers.map((header, i) => (
                    <th key={i}>
                      <span className={tableStyles.headerCell}>
                        {header}
                        <button
                          type="button"
                          className={tableStyles.colCopy}
                          title="Copy column"
                          onClick={() => handleCopyColumn(i)}
                        >
                          ⎘
                        </button>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className={tableStyles.rowNum}>{rowIndex + 1}</td>
                    {headers.map((_, colIndex) => {
                      const cell = row[colIndex] ?? ''
                      return (
                        <td key={colIndex}>
                          <button
                            type="button"
                            className={tableStyles.cellBtn}
                            title="Click to copy"
                            onClick={() => handleCopyCell(cell)}
                          >
                            {cell || '—'}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !error && <EmptyState message="Paste CSV and click Render table" />
      )}
    </div>
  )
}
