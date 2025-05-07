import DepartmentManagement from '../components/deptCard';
import PositionManagement from '../components/positionCard';
import { Container, Row, Col } from 'react-bootstrap';

const DeptPositions = () => {

    return (
        <Container fluid>
            <Row>
                <Col md={6}>
                    <DepartmentManagement />
                </Col>
                <Col md={6}>
                    <PositionManagement />
                </Col>
            </Row>
        </Container>
    );
};

export default DeptPositions;