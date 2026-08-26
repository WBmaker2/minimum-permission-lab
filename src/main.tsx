/// <reference types="vite/client" />
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/tokens.css'
import './styles/global.css'
import './styles/components.css'
import './styles/print.css'
import App from './app/App'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('앱을 표시할 root 요소를 찾을 수 없습니다.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
