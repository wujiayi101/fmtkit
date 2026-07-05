import styles from './EditorToolbar.module.css'

type EditorToolbarProps = {
  onFormat?: () => void
  onClear: () => void
  onSample?: () => void
  formatLabel?: string
  extra?: React.ReactNode
}

export function EditorToolbar({
  onFormat,
  onClear,
  onSample,
  formatLabel = 'Format',
  extra,
}: EditorToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.actions}>
        {onFormat && (
          <button type="button" className={styles.btnPrimary} onClick={onFormat}>
            {formatLabel}
          </button>
        )}
        {onSample && (
          <button type="button" className={styles.btn} onClick={onSample}>
            Load sample
          </button>
        )}
        <button type="button" className={styles.btn} onClick={onClear}>
          Clear
        </button>
      </div>
      {extra}
    </div>
  )
}

type TextInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
}

export function TextInput({ value, onChange, placeholder, label }: TextInputProps) {
  return (
    <div className={styles.inputWrap}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
      />
    </div>
  )
}

export function ErrorBanner({ message }: { message: string }) {
  return <div className={styles.error}>{message}</div>
}

export function EmptyState({ message }: { message: string }) {
  return <div className={styles.empty}>{message}</div>
}
