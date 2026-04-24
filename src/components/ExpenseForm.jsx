import { useState } from "react";
import { addExpense } from "../services/api";

export default function ExpenseForm({ refresh }) {
  const [form, setForm] = useState({
    date: "",
    itemName: "",
    price: "",
    quantity: "",
    note: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const total = Number(form.price) * Number(form.quantity);

    await addExpense({
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
      total,
    });

    setForm({
      date: "",
      itemName: "",
      price: "",
      quantity: "",
      note: "",
    });

    refresh();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Expense</h3>

      <input type="date" name="date" onChange={handleChange} value={form.date} />
      <input type="text" name="itemName" placeholder="Item" onChange={handleChange} value={form.itemName} />
      <input type="number" name="price" placeholder="Price" onChange={handleChange} value={form.price} />
      <input type="number" name="quantity" placeholder="Qty" onChange={handleChange} value={form.quantity} />
      <input type="text" name="note" placeholder="Note" onChange={handleChange} value={form.note} />

      <button>Add Expense</button>
    </form>
  );
}