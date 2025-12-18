import { useEffect, useCallback } from 'react'
import { initToasts, showToast } from '../styles/theme'

// ToastBridge ensures the toast container is present and theme helper is initialized.
export default function ToastBridge(){
  useEffect(()=>{
    try{ initToasts() }catch(e){ console.warn('initToasts failed', e) }
  },[])
  return null
}

// Hook for components to show toasts easily
export function useToast(){
  const toast = useCallback((message, type = 'success', duration = 3500) => {
    try{ showToast(message, type, duration) }catch(e){ console.warn('showToast failed', e) }
  }, [])
  return toast
}
