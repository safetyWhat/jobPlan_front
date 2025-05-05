import { Routes, Route } from "react-router";
import Navbar from './components/navbar';
import Jobs from './pages/jobs';
import EmployeeManagement from './pages/employees';
import CustomerManagement from './pages/customers';
import DeptPosition from './pages/deptPositions';

function App() {
  return (
    <>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/employee" element={<EmployeeManagement />} />
          <Route path="/customers" element={<CustomerManagement />} />
          <Route path="/deptPositions" element={<DeptPosition />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
