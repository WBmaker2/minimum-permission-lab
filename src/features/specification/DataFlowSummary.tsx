import type { ReactElement } from 'react'

interface DataFlowSummaryProps {
  dataFlow: readonly string[]
}

export default function DataFlowSummary({ dataFlow }: DataFlowSummaryProps): ReactElement {
  return (
    <section aria-labelledby="data-flow-title">
      <h3 id="data-flow-title">정보 흐름</h3>
      <ol>
        {dataFlow.map((step) => <li key={step}>{step}</li>)}
      </ol>
    </section>
  )
}
