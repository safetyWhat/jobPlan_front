import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
/* import JobCreationCard from './jobCreationCard'
import Jobs from './jobs'
import { DeptPosition, DepartmentCreation, PositionCreation, DepartmentsList, PositionsList, EmployeeManagement } from './employeeCreation'
import CustomerManagement from './customerCreation'
import { FaEdit, FaTrashAlt, FaPencilAlt } from 'react-icons/fa';
import { Nav } from 'react-bootstrap' */
import Navbar from './components/navbar'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  </StrictMode>,
)
