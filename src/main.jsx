import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ProductionEntry from './ProductionEntry.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductionEntry />
  </StrictMode>,
)
