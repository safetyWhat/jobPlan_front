import { Routes, Route } from "react-router";
import Navbar from './components/navbar';
import Jobs from './pages/jobs';
import EmployeeManagement from './pages/employees';
import Customers from './pages/customers';
import DeptPositions from './pages/deptPositions';

function App() {
  return (
    <>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/employee" element={<EmployeeManagement />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/deptPositions" element={<DeptPositions />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
