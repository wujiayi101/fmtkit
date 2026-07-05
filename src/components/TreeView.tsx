import { useState } from 'react'
import type { TreeNode } from '../utils/tree'
import { previewValue } from '../utils/tree'
import { copyText, valueToCopyString } from '../utils/copy'
import styles from './TreeView.module.css'

type TreeViewProps = {
  root: TreeNode
  onCopy?: (message: string) => void
}

export function TreeView({ root, onCopy }: TreeViewProps) {
  return (
    <div className={styles.tree}>
      {root.children?.length ? (
        root.children.map((child) => (
          <TreeNodeRow key={child.path} node={child} depth={0} onCopy={onCopy} />
        ))
      ) : (
        <TreeNodeRow node={root} depth={0} onCopy={onCopy} hideKey />
      )}
    </div>
  )
}

type TreeNodeRowProps = {
  node: TreeNode
  depth: number
  onCopy?: (message: string) => void
  hideKey?: boolean
}

function TreeNodeRow({ node, depth, onCopy, hideKey }: TreeNodeRowProps) {
  const hasChildren = Boolean(node.children?.length)
  const [expanded, setExpanded] = useState(depth < 2)

  const handleCopyValue = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const text = valueToCopyString(node.value)
    const ok = await copyText(text)
    onCopy?.(ok ? `Copied value at ${node.path}` : 'Copy failed')
  }

  const handleCopyPath = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const ok = await copyText(node.path)
    onCopy?.(ok ? `Copied path: ${node.path}` : 'Copy failed')
  }

  return (
    <div className={styles.node}>
      <div
        className={`${styles.row} ${hasChildren ? styles.expandable : ''}`}
        style={{ paddingLeft: `${depth + 0.5}rem` }}
        onClick={() => hasChildren && setExpanded((v) => !v)}
      >
        {hasChildren && (
          <span className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}>▸</span>
        )}
        {!hasChildren && <span className={styles.chevronSpacer} />}

        {!hideKey && (
          <span className={styles.key}>
            {node.key}
            <span className={styles.typeBadge}>{node.type}</span>
          </span>
        )}

        <span className={`${styles.value} ${styles[`type_${node.type}`]}`}>
          {hasChildren ? previewValue(node.value) : previewValue(node.value, 80)}
        </span>

        <span className={styles.actions}>
          <button
            type="button"
            className={styles.copyBtn}
            title="Copy value"
            onClick={handleCopyValue}
          >
            value
          </button>
          <button
            type="button"
            className={styles.copyBtn}
            title="Copy path"
            onClick={handleCopyPath}
          >
            path
          </button>
        </span>
      </div>

      {hasChildren && expanded && (
        <div className={styles.children}>
          {node.children!.map((child) => (
            <TreeNodeRow key={child.path} node={child} depth={depth + 1} onCopy={onCopy} />
          ))}
        </div>
      )}
    </div>
  )
}
