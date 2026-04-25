import { useEffect, useState } from "react";
import { getExpenses, getSales } from "../services/api";
import ExpenseForm from "../components/ExpenseForm";
import SaleForm from "../components/SaleForm";
import ExpenseTable from "../components/ExpenseTable";
import SaleTable from "../components/SaleTable";


export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [sales, setSales] = useState([]);
  const [showSalesTable, setShowSalesTable] = useState(true);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [showExpensesTable, setShowExpensesTable] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const loadData = async () => {
    const exp = await getExpenses();
    const sal = await getSales();

    setExpenses(exp.data);
    setSales(sal.data);
  };

  useEffect(() => {
    loadData();
  }, []);

    const totalExpenses = expenses.reduce((sum, e) => sum + e.total, 0);
    const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
    const profit = totalSales - totalExpenses;
  return (
    <>
      <div>
        <h2>Dashboard</h2>

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowSalesTable((s) => !s)}>
              {showSalesTable ? "Hide Sales" : `Show Sales (${sales.length})`}
            </button>
            <button onClick={() => setShowSaleForm((s) => !s)}>
              {showSaleForm ? "Close Add Sale" : "Add Sale"}
            </button>
          </div>

          <div style={{ display: "flex", gap: 8, marginLeft: 8 }}>
            <button onClick={() => setShowExpensesTable((s) => !s)}>
              {showExpensesTable ? "Hide Expenses" : `Show Expenses (${expenses.length})`}
            </button>
            <button onClick={() => setShowExpenseForm((s) => !s)}>
              {showExpenseForm ? "Close Add Expense" : "Add Expense"}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 24, marginBottom: 12 }}>
          <p style={{ margin: 0 }}>Sales: ${totalSales}</p>
          <p style={{ margin: 0 }}>Expenses: ${totalExpenses}</p>
          <p style={{ margin: 0 }}>Profit: ${profit}</p>
        </div>

        {/* Sales section */}
        {showSaleForm && (
          <div style={{ marginBottom: 12 }}>
            <SaleForm
              refresh={loadData}
              initialData={selectedSale}
              onClose={() => { setShowSaleForm(false); setSelectedSale(null); }}
            />
          </div>
        )}

        {showSalesTable && (
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ margin: "8px 0" }}>Sales</h3>
            <SaleTable sales={sales} refresh={loadData} onEdit={(item) => { setSelectedSale(item); setShowSaleForm(true); }} />
          </div>
        )}

        {/* Expenses section */}
        {showExpenseForm && (
          <div style={{ marginBottom: 12 }}>
            <ExpenseForm
              refresh={loadData}
              initialData={selectedExpense}
              onClose={() => { setShowExpenseForm(false); setSelectedExpense(null); }}
            />
          </div>
        )}

        {showExpensesTable && (
          <div>
            <h3 style={{ margin: "8px 0" }}>Expenses</h3>
            <ExpenseTable expenses={expenses} refresh={loadData} onEdit={(item) => { setSelectedExpense(item); setShowExpenseForm(true); }} />
          </div>
        )}
      </div>
    </>
  );
}
