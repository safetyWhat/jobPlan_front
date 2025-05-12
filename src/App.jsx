import React, { useState } from "react";
import { Routes, Route, Outlet } from "react-router";
import {
	Container,
	Row,
	Col,
	Navbar as BootstrapNavbar,
	Button,
} from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import Navbar from "./components/navbar";
import Jobs from "./pages/jobs";
import EmployeeManagement from "./pages/employees";
import CustomerManagement from "./pages/customers";
import DeptPosition from "./pages/deptPositions";
import SearchBar from "./components/SearchBar";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
	const [showNavbar, setShowNavbar] = useState(true);
	const [searchResults, setSearchResults] = useState(null);

	const handleSearch = (results) => {
		setSearchResults(results);
	};

	return (
		<div className="app-container">
			{/* Header */}
			<BootstrapNavbar bg="dark" variant="dark" className="header p-3">
				<Container fluid>
					<div className="d-flex align-items-center">
						<Button
							variant="outline-light"
							className="me-2"
							onClick={() => setShowNavbar(!showNavbar)}
						>
							<FaBars />
						</Button>
						<SearchBar onSearchResults={handleSearch} />
						<BootstrapNavbar.Brand>Job Plan</BootstrapNavbar.Brand>
					</div>
				</Container>
			</BootstrapNavbar>

			{/* Main content area with sidebar */}
			<Container fluid className="main-container">
				<Row className="content-row">
					{/* Sidebar Navigation with toggle */}
					<Col
						md={2}
						className={`bg-light p-0 h-100 flex-shrink-0 transition-width ${showNavbar ? "d-block" : "d-none"}`}
						style={{ width: showNavbar ? "175px" : "0" }}
					>
						<Navbar />
					</Col>

					{/* Main Content Area */}
					<Col className="main-content p-4">
						<Routes>
							<Route path="/jobs" element={<Jobs />} />
							<Route
								path="/employee"
								element={<EmployeeManagement />}
							/>
							<Route
								path="/customers"
								element={<CustomerManagement />}
							/>
							<Route
								path="/deptPositions"
								element={<DeptPosition />}
							/>
						</Routes>
						<Outlet context={{ searchResults }} />
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default App;
