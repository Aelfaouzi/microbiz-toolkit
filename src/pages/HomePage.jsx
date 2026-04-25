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

        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-start sm:items-center mb-4">
          <div className="flex gap-2">
            <button onClick={() => setShowSalesTable((s) => !s)} className="px-3 py-2 rounded border ">{showSalesTable ? "Hide Sales" : `Show Sales (${sales.length})`}</button>
            <button onClick={() => setShowSaleForm((s) => !s)} className="px-3 py-2 rounded bg-slate-900 text-white">{showSaleForm ? "Close" : "Add Sale"}</button>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setShowExpensesTable((s) => !s)} className="px-3 py-2 rounded border ">{showExpensesTable ? "Hide Expenses" : `Show Expenses (${expenses.length})`}</button>
            <button onClick={() => setShowExpenseForm((s) => !s)} className="px-3 py-2 rounded bg-slate-900 text-white">{showExpenseForm ? "Close" : "Add Expense"}</button>
          </div>

          <div className="flex gap-6 mt-2 sm:mt-0">
            <p className="m-0">Sales: <span className="font-semibold">${totalSales}</span></p>
            <p className="m-0">Expenses: <span className="font-semibold">${totalExpenses}</span></p>
            <p className="m-0">Profit: <span className="font-semibold">${profit}</span></p>
          </div>
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
