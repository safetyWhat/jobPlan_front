import { Routes, Route } from "react-router";
import { Container, Row, Col, Navbar as BootstrapNavbar } from 'react-bootstrap';
import Navbar from './components/navbar';
import Jobs from './pages/jobs';
import EmployeeManagement from './pages/employees';
import CustomerManagement from './pages/customers';
import DeptPosition from './pages/deptPositions';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="vh-100 d-flex flex-column">
      {/* Header */}
      <BootstrapNavbar bg="dark" variant="dark" className="p-3">
        <Container fluid>
          <BootstrapNavbar.Brand>Job Plan</BootstrapNavbar.Brand>
        </Container>
      </BootstrapNavbar>

      {/* Main content area with sidebar */}
      <Container fluid className="flex-grow-1">
        <Row className="h-100">
          {/* Sidebar Navigation */}
          <Col md={3} lg={2} className="bg-light p-0 min-vh-100">
            <Navbar />
          </Col>

          {/* Main Content Area */}
          <Col md={9} lg={10} className="p-4">
            <Routes>
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/employee" element={<EmployeeManagement />} />
              <Route path="/customers" element={<CustomerManagement />} />
              <Route path="/deptPositions" element={<DeptPosition />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;