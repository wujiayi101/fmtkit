import { useState } from 'react'
import { Layout, useToast, type ToolId } from './components/Layout'
import { JsonViewer } from './tools/JsonViewer'
import { YamlViewer } from './tools/YamlViewer'
import { JsonToYaml } from './tools/JsonToYaml'
import { YamlToJson } from './tools/YamlToJson'
import { CsvViewer } from './tools/CsvViewer'

function App() {
  const [active, setActive] = useState<ToolId>('json')
  const { show, Toast } = useToast()

  return (
    <>
      <Layout active={active} onNavigate={setActive}>
        {active === 'json' && <JsonViewer onCopy={show} />}
        {active === 'yaml' && <YamlViewer onCopy={show} />}
        {active === 'json-to-yaml' && <JsonToYaml onCopy={show} />}
        {active === 'yaml-to-json' && <YamlToJson onCopy={show} />}
        {active === 'csv' && <CsvViewer onCopy={show} />}
      </Layout>
      {Toast}
    </>
  )
}

export default App
