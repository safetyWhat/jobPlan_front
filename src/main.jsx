import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import JobCreationCard from './jobCreationCard'
import Jobs from './jobs'
import { DeptPosition, DepartmentCreation, PositionCreation, DepartmentsList, PositionsList, EmployeeManagement } from './employeeCreation'
import { FaEdit, FaTrashAlt, FaPencilAlt } from 'react-icons/fa';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DeptPosition />
    <EmployeeManagement />
    {/*<JobCreationCard />
    <Jobs /> */}
  </StrictMode>,
)
