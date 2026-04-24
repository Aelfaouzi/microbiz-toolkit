import React from "react";
import "./tables.css";
import { deleteSale } from "../services/api";

const currency = (v) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number(v) || 0
  );

export default function SaleTable({ sales = [], refresh } ) {
  const totalQty = sales.reduce((s, it) => s + (Number(it.quantity) || 0), 0);
  const totalAmount = sales.reduce((s, it) => s + (Number(it.total) || 0), 0);

  const handleDelete = async (id) => {
    if (!id) return;
    const ok = confirm("Delete this sale? This action cannot be undone.");
    if (!ok) return;
    try {
      await deleteSale(id);
      if (typeof refresh === "function") refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete sale. See console for details.");
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
          {sales.length === 0 && (
            <tr>
              <td colSpan={6} className="no-data">
                No sales yet
              </td>
            </tr>
          )}

          {sales.map((s, i) => (
            <tr key={s.id || i}>
              <td>{s.date}</td>
              <td>{s.itemName}</td>
              <td>{currency(s.price)}</td>
              <td>{s.quantity}</td>
              <td style={{ fontWeight: 600 }}>{currency(s.total)}</td>
              <td>{s.note}</td>
              <td>
                <button onClick={() => handleDelete(s.id)} style={{ color: "#b91c1c" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <td>Totals</td>
            <td />
            <td />
            <td>{totalQty}</td>
            <td>{currency(totalAmount)}</td>
            <td />
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
