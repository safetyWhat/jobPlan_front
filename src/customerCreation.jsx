import { useState, useEffect } from 'react';
import axios from 'axios';

// Move modal component outside of parent component
const CustomerFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  onChange, 
  errors, 
  loading, 
  isEditMode 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {isEditMode ? 'Edit Customer' : 'Add New Customer'}
          </h2>
        </div>
        
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={onChange}
                className={`w-full p-2 border rounded ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>
            
            <div>
              <label className="block mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={onChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            
            <div>
              <label className="block mb-1">Fax</label>
              <input
                type="text"
                name="fax"
                value={formData.fax || ''}
                onChange={onChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={onChange}
                className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
          </div>
          
          {errors.submit && (
            <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
              {errors.submit}
            </div>
          )}
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CustomerManagement = () => {
  // State for customers list
  const [customers, setCustomers] = useState([]);
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    fax: '',
    email: '',
  });
  // State for edit mode
  const [editMode, setEditMode] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState(null);
  // State for errors
  const [errors, setErrors] = useState({});
  // State for loading status
  const [loading, setLoading] = useState(false);
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Function to fetch all customers
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/customers`);
      // Handle potential undefined or incorrect response structure
      const customerData = response.data && response.data.data ? response.data.data : [];
      console.log('Fetched customers:', customerData);
      setCustomers(customerData);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch a single customer
  const fetchCustomer = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/customers/${id}`);
      setFormData(response.data.data);
      setEditMode(true);
      setCurrentCustomerId(id);
      setIsModalOpen(true); // Open modal for editing
    } catch (error) {
      console.error('Error fetching customer:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (editMode) {
        await axios.put(`${import.meta.env.VITE_API_URL}/customers/${currentCustomerId}`, formData);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/customers`, formData);
      }
      
      // Reset form, close modal and refresh customer list
      resetForm();
      setIsModalOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      if (error.response && error.response.data) {
        setErrors(prev => ({
          ...prev,
          submit: error.response.data.message || 'Failed to save customer'
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle customer deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    
    setLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/customers/${id}`);
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      fax: '',
      email: '',
    });
    setEditMode(false);
    setCurrentCustomerId(null);
    setErrors({});
  };

  // Open modal for creating a new customer
  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Close modal and reset form
  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <button 
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add New Customer
        </button>
      </div>
      
      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={handleChange}
        errors={errors}
        loading={loading}
        isEditMode={editMode}
      />
      
      {/* Customer List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Customer List</h2>
        
        {loading && <p className="text-gray-500">Loading customers...</p>}
        
        {!loading && (!customers || customers.length === 0) ? (
          <p className="text-gray-500">No customers found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers && customers.map(customer => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.phone && <div>Phone: {customer.phone}</div>}
                      {customer.fax && <div>Fax: {customer.fax}</div>}
                      {customer.email && <div>Email: {customer.email}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => fetchCustomer(customer.id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;