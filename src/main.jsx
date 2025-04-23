import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import JobCreationCard from './jobCreationCard'
import Jobs from './jobs'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <JobCreationCard />
    <Jobs />
  </StrictMode>,
)
