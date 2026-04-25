import React from "react";
import { deleteExpense } from "../services/api";

const currency = (v) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number(v) || 0
  );

export default function ExpenseTable({ expenses = [], refresh, onEdit }) {
  const handleDelete = async (id) => {
    if (!id) return;
    const ok = confirm("Delete this expense? This action cannot be undone.");
    if (!ok) return;
    try {
      await deleteExpense(id);
      if (typeof refresh === "function") refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete expense. See console for details.");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-slate-900 text-white text-sm">
          <tr>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Item</th>
            <th className="px-4 py-3 text-left">Price</th>
            <th className="px-4 py-3 text-left">Qty</th>
            <th className="px-4 py-3 text-left">Total</th>
            <th className="px-4 py-3 text-left">Note</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody className="text-sm text-slate-700">
          {expenses.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-6 text-center text-slate-500">No expenses yet</td>
            </tr>
          )}

          {expenses.map((e, i) => (
            <tr key={e.id || i} className={`border-b border-gray-300 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
              <td className="px-4 py-3">{e.date}</td>
              <td className="px-4 py-3">{e.itemName}</td>
              <td className="px-4 py-3">{currency(e.price)}</td>
              <td className="px-4 py-3">{e.quantity}</td>
              <td className="px-4 py-3 font-semibold">{currency(e.total)}</td>
              <td className="px-4 py-3">{e.note}</td>
              <td className="px-4 py-3">
                <button onClick={() => onEdit && onEdit(e)} className="px-2 py-1 text-sm rounded bg-gray hover:bg-slate-200 mr-2">Edit</button>
                <button onClick={() => handleDelete(e.id)} className="px-2 py-1 text-sm rounded text-white bg-red-600 hover:bg-red-700">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}