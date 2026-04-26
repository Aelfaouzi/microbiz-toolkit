import { useState, useEffect } from "react";
import { getExpenses } from "../services/api";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseTable from "../components/ExpenseTable";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const loadData = async () => {
    const exp = await getExpenses();
    setExpenses(exp.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.total, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Expenses</h2>
      
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm mr-2"><span className="font-semibold">Total:</span> ${totalExpenses.toFixed(2)}</p>
        <button
          onClick={() => { setShowForm(!showForm); setSelectedExpense(null); }}
          className="px-4 py-2 rounded bg-slate-900 text-white"
        >
          {showForm ? 'Close' : 'Add Expense'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <ExpenseForm
            refresh={loadData}
            initialData={selectedExpense}
            onClose={() => { setShowForm(false); setSelectedExpense(null); }}
          />
        </div>
      )}

      <ExpenseTable
        expenses={expenses}
        refresh={loadData}
        onEdit={(item) => { setSelectedExpense(item); setShowForm(true); }}
      />
    </div>
  );
}
