import React from "react";
import "./tables.css";
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
    <div className="tables-container">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Note</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {expenses.length === 0 && (
            <tr>
              <td colSpan={7} className="no-data">
                No expenses yet
              </td>
            </tr>
          )}

          {expenses.map((e, i) => (
            <tr key={e.id || i}>
              <td>{e.date}</td>
              <td>{e.itemName}</td>
              <td>{currency(e.price)}</td>
              <td>{e.quantity}</td>
              <td style={{ fontWeight: 600 }}>{currency(e.total)}</td>
              <td>{e.note}</td>
                <td>
                  <button onClick={() => onEdit && onEdit(e)} style={{ marginRight: 8 }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(e.id)} style={{ color: "#aa1a1aff" }}>
                    Delete
                  </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}