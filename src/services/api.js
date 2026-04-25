import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001",
});

// Expenses
export const getExpenses = () => API.get("/expenses");
export const addExpense = (data) => API.post("/expenses", data);

// Sales
export const getSales = () => API.get("/sales");
export const addSale = (data) => API.post("/sales", data);
export const deleteSale = (id) => API.delete(`/sales/${id}`);
export const updateSale = (id, data) => API.put(`/sales/${id}`, data);

// Inventory
export const getInventory = () => API.get("/inventory");
export const addInventoryItem = (data) => API.post("/inventory", data);

// Customers
export const getCustomers = () => API.get("/customers");
export const addCustomer = (data) => API.post("/customers", data);

// Suppliers
export const getSuppliers = () => API.get("/suppliers");
export const addSupplier = (data) => API.post("/suppliers", data);

// Employees
export const getEmployees = () => API.get("/employees");
export const addEmployee = (data) => API.post("/employees", data);

// Delete endpoints
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);
export const updateExpense = (id, data) => API.put(`/expenses/${id}`, data);

