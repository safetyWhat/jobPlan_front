import { Link } from "react-router";

function Navbar() {
    return (
        <nav>
            <ul>
                <li><Link to="/jobs">Jobs</Link></li>
                <li><Link to="/employee">Employee Management</Link></li>
                <li><Link to="/customers">Customer Management</Link></li>
                <li><Link to="/deptPositions">Details</Link></li>
            </ul>
        </nav>
    );
}
export default Navbar;