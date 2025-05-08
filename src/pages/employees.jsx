import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeManagement from '../components/employeeCard';
import EmployeeFilters from '../components/employeeFilters';

function Employees() {
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);

  const fetchAllEmployees = async () => {
    try {
      setIsFiltering(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/employees`);
      setFilteredEmployees(response.data.data || []);
    } catch (error) {
      console.error('Error fetching all employees:', error);
    } finally {
      setIsFiltering(false);
    }
  };

  // Load all employees when component mounts
  useEffect(() => {
    fetchAllEmployees();
  }, []);

  const handleFilterChange = async (filters) => {
    try {
      setIsFiltering(true);
      
      // Build query string based on active filters
      const queryParams = [];
      if (filters.departmentId) queryParams.push(`departmentId=${filters.departmentId}`);
      if (filters.positionId) queryParams.push(`positionId=${filters.positionId}`);
      
      const queryString = queryParams.length > 0 
        ? `/filter?${queryParams.join('&')}` 
        : '';

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/employees${queryString}`
      );
      
      setFilteredEmployees(response.data.data || []);
    } catch (error) {
      console.error('Error filtering employees:', error);
    } finally {
      setIsFiltering(false);
    }
  };

  return (
    <div className="container">
      <EmployeeFilters 
        onFilterChange={handleFilterChange}
        onClearFilters={fetchAllEmployees} />
      <EmployeeManagement 
        employees={filteredEmployees} 
        isFiltering={isFiltering}
      />
    </div>
  );
}

export default Employees;