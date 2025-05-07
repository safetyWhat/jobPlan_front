import { Link } from "react-router";
import { Nav } from "react-bootstrap";

function Navbar() {
    return (
        <Nav className="flex-column bg-light p-0">
            <Nav.Link as={Link} to="/jobs" className="p-3 border-bottom">
                Jobs
            </Nav.Link>
            <Nav.Link as={Link} to="/employee" className="p-3 border-bottom">
                Employee Management
            </Nav.Link>
            <Nav.Link as={Link} to="/customers" className="p-3 border-bottom">
                Customer Management
            </Nav.Link>
            <Nav.Link as={Link} to="/deptPositions" className="p-3 border-bottom">
                Details
            </Nav.Link>
        </Nav>
    );
}

export default Navbar;