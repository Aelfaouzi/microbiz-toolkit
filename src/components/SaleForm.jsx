import { useState } from "react";
import { addSale} from "../services/api";

export default function SaleForm({ refresh }) {
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

    await addSale({
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
      <h3>Add Sale</h3>

      <input type="date" name="date" onChange={handleChange} value={form.date} />
      <input type="text" name="itemName" placeholder="Item" onChange={handleChange} value={form.itemName} />
      <input type="number" name="price" placeholder="Price" onChange={handleChange} value={form.price} />
      <input type="number" name="quantity" placeholder="Qty" onChange={handleChange} value={form.quantity} />
      <input type="text" name="note" placeholder="Note" onChange={handleChange} value={form.note} />

      <button>Add Expense</button>
    </form>
  );
}