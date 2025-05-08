import { Link } from "react-router";
import { Nav } from "react-bootstrap";
import { useLocation } from "react-router";

function Navbar() {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <Nav className="flex-column bg-light p-0">
            <Nav.Link 
                as={Link} 
                to="/jobs" 
                className={`p-3 border-bottom ${isActive('/jobs') ? 'active' : ''}`}
            >
                Jobs
            </Nav.Link>
            <Nav.Link 
                as={Link} 
                to="/employee" 
                className={`p-3 border-bottom ${isActive('/employee') ? 'active' : ''}`}
            >
                Employees
            </Nav.Link>
            <Nav.Link 
                as={Link} 
                to="/customers" 
                className={`p-3 border-bottom ${isActive('/customers') ? 'active' : ''}`}
            >
                Customers
            </Nav.Link>
            <Nav.Link 
                as={Link} 
                to="/deptPositions" 
                className={`p-3 border-bottom ${isActive('/deptPositions') ? 'active' : ''}`}
            >
                Details
            </Nav.Link>
        </Nav>
    );
}

export default Navbar;