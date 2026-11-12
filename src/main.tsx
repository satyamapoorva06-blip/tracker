import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Remove the inline splash once React has painted its first frame.
function dismissSplash() {
  const el = document.getElementById('splash')
  if (!el) return
  el.classList.add('hide')
  window.setTimeout(() => el.remove(), 400)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App onReady={dismissSplash} />
    </BrowserRouter>
  </React.StrictMode>,
)

// Safety net: never trap the user behind the splash.
window.setTimeout(dismissSplash, 4000)
