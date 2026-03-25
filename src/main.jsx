import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'leaflet/dist/leaflet.css'
import { Agentation } from 'agentation'

const rootEl = document.getElementById('root')

const showBootError = (title, errorLike) => {
  const message = String(errorLike?.message || errorLike || 'unknown error')
  if (!rootEl) return
  rootEl.innerHTML = `
    <div style="min-height:100vh;padding:24px;background:#f8fafc;color:#0f172a;font-family:ui-sans-serif,system-ui,sans-serif;">
      <h1 style="margin:0;font-size:18px;font-weight:700;">${title}</h1>
      <p style="margin:8px 0 0;color:#475569;font-size:13px;">앱 시작 단계에서 오류가 발생했습니다.</p>
      <pre style="white-space:pre-wrap;margin-top:12px;padding:12px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;font-size:12px;">${message}</pre>
    </div>
  `
}

window.addEventListener('error', (e) => {
  console.error('window error:', e.error || e.message || e)
})
window.addEventListener('unhandledrejection', (e) => {
  console.error('unhandled rejection:', e.reason || e)
})

const boot = async () => {
  if (!rootEl) {
    throw new Error('#root element not found')
  }
  try {
    const mod = await import('./App.jsx')
    const App = mod?.default
    if (!App) throw new Error('App default export not found')
    createRoot(rootEl).render(
      <StrictMode>
        <App />
        {import.meta.env.DEV && <Agentation endpoint="http://localhost:4747" />}
      </StrictMode>,
    )
    window.__APP_MOUNTED__ = true
  } catch (error) {
    showBootError('앱 로딩 실패', error)
  }
}

boot().catch((error) => showBootError('초기화 실패', error))
