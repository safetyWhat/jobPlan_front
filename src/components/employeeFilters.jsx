import React from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import useDepartmentsData from '../hooks/useDepartmentsData';
import usePositionsData from '../hooks/usePositionsData';

const EmployeeFilters = ({ onFilterChange, onClearFilters }) => {
    const { departments } = useDepartmentsData();
    const { positions } = usePositionsData();
    const [filters, setFilters] = React.useState({
        departmentId: '',
        positionId: ''
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newFilters = {
            ...filters,
            [name]: value
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleClearFilters = () => {
        const clearedFilters = {
            departmentId: '',
            positionId: ''
        };
        setFilters(clearedFilters);
        onClearFilters();
    };

    return (
        <Card className="shadow-sm mb-4">
            <Card.Body>
                <Row>
                    <Col md={5}>
                        <Form.Group>
                            <Form.Label>Filter by Department</Form.Label>
                            <Form.Select
                                name="departmentId"
                                value={filters.departmentId}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Departments</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={5}>
                        <Form.Group>
                            <Form.Label>Filter by Position</Form.Label>
                            <Form.Select
                                name="positionId"
                                value={filters.positionId}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Positions</option>
                                {positions.map(position => (
                                    <option key={position.id} value={position.id}>
                                        {position.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={2} className="d-flex align-items-end">
                        <Button 
                            variant="secondary" 
                            onClick={handleClearFilters}
                            className="mb-3"
                        >
                            Clear Filters
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default EmployeeFilters;