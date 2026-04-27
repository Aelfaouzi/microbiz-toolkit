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
export const updateInventoryItem = (id, data) => API.put(`/inventory/${id}`, data);
export const deleteInventoryItem = (id) => API.delete(`/inventory/${id}`);

// Returns (Phase 2)
export const getReturns = () => API.get("/returns");
export const addReturn = (data) => API.post("/returns", data);
export const updateReturn = (id, data) => API.put(`/returns/${id}`, data);
export const deleteReturn = (id) => API.delete(`/returns/${id}`);

// Defects (Phase 2)
export const getDefects = () => API.get("/defects");
export const addDefect = (data) => API.post("/defects", data);
export const updateDefect = (id, data) => API.put(`/defects/${id}`, data);
export const deleteDefect = (id) => API.delete(`/defects/${id}`);

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

