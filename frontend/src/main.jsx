import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
// UI styles and helper (theme, toasts, mobile menu)
import './styles/ui.css'
import App from './App.jsx'

// AOS (Animate On Scroll)
import AOS from 'aos'
import 'aos/dist/aos.css'
import { initUI } from './styles/theme'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Initialize AOS and small UI wiring after the app has mounted
// delay slightly so React has mounted DOM nodes
setTimeout(()=>{
  try{ AOS.init({ duration: 700, once: true }) }catch(e){console.warn('AOS init failed', e)}
  try{ initUI() }catch(e){console.warn('initUI failed', e)}
}, 60)
