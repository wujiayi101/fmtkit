import styles from './SplitPanel.module.css'

type SplitPanelProps = {
  leftTitle: string
  rightTitle: string
  left: React.ReactNode
  right: React.ReactNode
}

export function SplitPanel({ leftTitle, rightTitle, left, right }: SplitPanelProps) {
  return (
    <div className={styles.split}>
      <section className={styles.panel}>
        <header className={styles.panelHeader}>{leftTitle}</header>
        <div className={styles.panelBody}>{left}</div>
      </section>
      <section className={styles.panel}>
        <header className={styles.panelHeader}>{rightTitle}</header>
        <div className={styles.panelBody}>{right}</div>
      </section>
    </div>
  )
}
