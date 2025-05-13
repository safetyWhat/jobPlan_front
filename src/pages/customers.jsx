import React from "react";
import CustomerManagement from "../components/customerCard";

function Customers({ searchResults }) {
	return (
		<div className="container">
			<CustomerManagement searchResults={searchResults} />
		</div>
	);
}
export default Customers;
