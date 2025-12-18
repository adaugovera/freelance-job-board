import React from 'react'

export default function Pagination({ total = 0, page = 1, pageSize = 10, onPageChange = () => {} }){
  const pages = Math.max(1, Math.ceil(total / pageSize))
  if(pages <= 1) return null

  const go = (p) => {
    if(p < 1 || p > pages || p === page) return
    onPageChange(p)
  }

  // Simple windowed pagination (show up to 5 pages with current centered)
  const windowSize = 5
  let start = Math.max(1, page - Math.floor(windowSize/2))
  let end = Math.min(pages, start + windowSize - 1)
  if(end - start + 1 < windowSize){ start = Math.max(1, end - windowSize + 1) }

  const items = []
  items.push(
    <li key="prev" onClick={()=>go(page-1)} aria-label="Previous" className={page===1? 'disabled': ''}>
      ‹
    </li>
  )

  for(let i = start; i <= end; i++){
    items.push(
      <li key={i} onClick={()=>go(i)} className={i===page? 'active': ''} aria-current={i===page? 'page': undefined}>
        {i}
      </li>
    )
  }

  items.push(
    <li key="next" onClick={()=>go(page+1)} aria-label="Next" className={page===pages? 'disabled': ''}>
      ›
    </li>
  )

  return (
    <nav aria-label="Pagination" style={{marginTop: '1rem'}}>
      <ul className="pagination">
        {items}
      </ul>
    </nav>
  )
}
