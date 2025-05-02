import { Link, Routes, Route } from "react-router";
import Jobs from "../pages/jobs";
import Employees from "../pages/employees";
import Customers from "../pages/customers";
import DeptPositions from "../pages/deptPositions";

function Navbar() {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/jobs">Jobs</Link>
                    </li>
                    <li>
                        <Link to="/employee">Employee Management</Link>
                    </li>
                    <li>
                        <Link to="/customers">Customer Management</Link>
                    </li>
                    <li>
                        <Link to="/deptPositions">Details</Link>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/employee" element={<Employees />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/deptPositions" element={<DeptPositions />} />
            </Routes>
        </>
    )
}
export default Navbar;