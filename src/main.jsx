import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import JobCreationCard from './jobCreationCard'
import Jobs from './jobs'
import { AdminPage, DepartmentCreation, PositionCreation, DepartmentsList, PositionsList } from './employeeCreation'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminPage />
    <JobCreationCard />
    <Jobs />
  </StrictMode>,
)
