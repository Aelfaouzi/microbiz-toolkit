import { useEffect, useState } from "react";
import { getExpenses, getSales } from "../services/api";

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [sales, setSales] = useState([]);

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
    <div>
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
          <p className="text-sm text-slate-600 mb-2">Total Sales</p>
          <p className="text-3xl font-semibold text-slate-900">${totalSales.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
          <p className="text-sm text-slate-600 mb-2">Total Expenses</p>
          <p className="text-3xl font-semibold text-red-600">${totalExpenses.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
          <p className="text-sm text-slate-600 mb-2">Net Profit</p>
          <p className={`text-3xl font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${profit.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-lg border border-gray-300">
        <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-slate-600">Sales Records</p>
            <p className="text-2xl font-semibold text-slate-900">{sales.length}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Expense Records</p>
            <p className="text-2xl font-semibold text-slate-900">{expenses.length}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Avg Sale</p>
            <p className="text-2xl font-semibold text-slate-900">
              ${sales.length > 0 ? (totalSales / sales.length).toFixed(2) : '0.00'}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Avg Expense</p>
            <p className="text-2xl font-semibold text-slate-900">
              ${expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
