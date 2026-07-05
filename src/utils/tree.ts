export type TreeNode = {
  key: string
  path: string
  value: unknown
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'
  children?: TreeNode[]
}

function getType(value: unknown): TreeNode['type'] {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return 'number'
  return 'boolean'
}

function buildPath(parentPath: string, key: string, isArray: boolean): string {
  if (!parentPath) return isArray ? `[${key}]` : key
  return isArray ? `${parentPath}[${key}]` : `${parentPath}.${key}`
}

export function buildTree(value: unknown, key = 'root', path = ''): TreeNode {
  const type = getType(value)
  const node: TreeNode = { key, path: path || key, value, type }

  if (type === 'object' && value !== null) {
    node.children = Object.entries(value as Record<string, unknown>).map(([k, v]) =>
      buildTree(v, k, buildPath(path || key, k, false)),
    )
  } else if (type === 'array') {
    node.children = (value as unknown[]).map((v, i) =>
      buildTree(v, String(i), buildPath(path || key, String(i), true)),
    )
  }

  return node
}

export function previewValue(value: unknown, maxLen = 48): string {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') {
    const s = `"${value}"`
    return s.length > maxLen ? s.slice(0, maxLen - 1) + '…' : s
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return `[${value.length} items]`
  if (typeof value === 'object') return `{${Object.keys(value).length} keys}`
  return String(value)
}
