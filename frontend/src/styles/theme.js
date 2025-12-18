// Small helper to wire theme toggle, mobile menu and toasts
// Usage:
// import initUI from './styles/theme'
// initUI()

export function initUI(options = {}){
  initThemeToggle(options.toggleSelector || '[data-theme-toggle]')
  initMobileMenu(options.toggleSelectorMobile || '[data-mobile-toggle]', options.mobileMenuSelector || '[data-mobile-menu]')
  initToasts()
}

export function initThemeToggle(selector){
  const btn = document.querySelector(selector)
  if(!btn) return

  const root = document.documentElement
  const saved = localStorage.getItem('fjb_theme')
  if(saved === 'dark') root.classList.add('theme-dark')

  btn.addEventListener('click', ()=>{
    const isDark = root.classList.toggle('theme-dark')
    localStorage.setItem('fjb_theme', isDark ? 'dark' : 'light')
    // small accessibility hint - change aria-pressed
    btn.setAttribute('aria-pressed', String(isDark))
  })
}

export function initMobileMenu(toggleSelector, menuSelector){
  const toggle = document.querySelector(toggleSelector)
  const menu = document.querySelector(menuSelector)
  if(!toggle || !menu) return
  toggle.addEventListener('click', ()=>{
    const open = menu.classList.toggle('open')
    menu.classList.toggle('closed', !open)
    toggle.setAttribute('aria-expanded', String(open))
  })
}

/* --- Toasts ---
   showToast(message, type = 'success', duration = 3500)
   - type: success | info | warn | error
   - duration in ms. If duration === 0, don't auto-dismiss.
*/
export function initToasts(){
  if(!document.querySelector('.toast-container')){
    const container = document.createElement('div')
    container.className = 'toast-container'
    document.body.appendChild(container)
  }
  // expose globally for convenience
  window.showToast = showToast
}

export function showToast(message, type = 'success', duration = 3500){
  const container = document.querySelector('.toast-container')
  if(!container) return

  const toast = document.createElement('div')
  toast.className = `toast ${type}`
  toast.innerHTML = `
    <div class="t-icon">${getIcon(type)}</div>
    <div class="t-body">
      <div class="t-msg">${escapeHtml(message)}</div>
    </div>
    <button class="t-close" aria-label="dismiss" style="margin-left:auto;background:transparent;border:0;color:rgba(255,255,255,0.9);cursor:pointer">&times;</button>
  `
  container.appendChild(toast)
  // show animation
  requestAnimationFrame(()=>{ toast.classList.add('show') })

  // close handler
  const closeBtn = toast.querySelector('.t-close')
  closeBtn.addEventListener('click', ()=> dismiss())

  let hideTimeout
  function dismiss(){
    toast.classList.remove('show')
    toast.classList.add('hide')
    toast.addEventListener('animationend', ()=> toast.remove())
    if(hideTimeout) clearTimeout(hideTimeout)
  }

  if(duration > 0){
    hideTimeout = setTimeout(dismiss, duration)
    // pause on hover
    toast.addEventListener('mouseenter', ()=> clearTimeout(hideTimeout))
    toast.addEventListener('mouseleave', ()=> hideTimeout = setTimeout(dismiss, 1200))
  }
}

function getIcon(type){
  switch(type){
    case 'success': return '✓'
    case 'info': return 'i'
    case 'warn': return '!'
    case 'error': return '✕'
    default: return ''
  }
}

function escapeHtml(str){
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// auto-init on DOMContentLoaded for convenience (safe to import)
if(typeof window !== 'undefined'){
  document.addEventListener('DOMContentLoaded', ()=>{
    try{ initToasts() }catch(e){}
  })
}
