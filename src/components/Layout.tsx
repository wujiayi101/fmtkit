import { useState } from 'react'
import styles from './Layout.module.css'

export type ToolId = 'json' | 'yaml' | 'json-to-yaml' | 'csv'

const TOOLS: { id: ToolId; label: string; description: string }[] = [
  { id: 'json', label: 'JSON Viewer', description: 'Pretty-print & tree view' },
  { id: 'yaml', label: 'YAML Viewer', description: 'Pretty-print & tree view' },
  { id: 'json-to-yaml', label: 'JSON → YAML', description: 'Convert formats' },
  { id: 'csv', label: 'CSV Table', description: 'Render as table' },
]

type LayoutProps = {
  active: ToolId
  onNavigate: (id: ToolId) => void
  children: React.ReactNode
}

export function Layout({ active, onNavigate, children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logo}>◈</span>
          <div>
            <h1 className={styles.title}>Format Tools</h1>
            <p className={styles.subtitle}>JSON · YAML · CSV utilities</p>
          </div>
        </div>
        <nav className={styles.nav}>
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              className={`${styles.navBtn} ${active === tool.id ? styles.navBtnActive : ''}`}
              onClick={() => onNavigate(tool.id)}
            >
              <span className={styles.navLabel}>{tool.label}</span>
              <span className={styles.navDesc}>{tool.description}</span>
            </button>
          ))}
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}

export function useToast() {
  const [message, setMessage] = useState<string | null>(null)

  const show = (msg: string) => {
    setMessage(msg)
    window.setTimeout(() => setMessage(null), 2000)
  }

  const Toast = message ? (
    <div className={styles.toast} role="status">
      {message}
    </div>
  ) : null

  return { show, Toast }
}
