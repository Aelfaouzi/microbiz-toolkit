import { useEffect, useState } from "react";
import { addExpense, updateExpense } from "../services/api";

export default function ExpenseForm({ refresh, initialData = null, onClose }) {
  const [form, setForm] = useState({
    date: "",
    itemName: "",
    price: "",
    quantity: "",
    note: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        date: initialData.date || "",
        itemName: initialData.itemName || "",
        price: initialData.price || "",
        quantity: initialData.quantity || "",
        note: initialData.note || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const total = Number(form.price) * Number(form.quantity);

    try {
      if (initialData && initialData.id) {
        await updateExpense(initialData.id, {
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity),
          total,
        });
      } else {
        await addExpense({
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity),
          total,
        });
      }

      setForm({ date: "", itemName: "", price: "", quantity: "", note: "" });
      if (typeof refresh === "function") refresh();
      if (typeof onClose === "function") onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save expense. See console for details.");
    }
  };

  const isEditing = initialData && initialData.id;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4  text-black rounded shadow">
      <h3 className="text-lg font-medium mb-3">{isEditing ? "Edit Expense" : "Add Expense"}</h3>

      <div className="flex flex-col gap-2 space-y-4 expense-form">
        <input className="border px-2 py-2 rounded w-full" type="date" name="date" placeholder="Date" onChange={handleChange} value={form.date} />
        <input className="border px-2 py-2 rounded w-full" type="text" name="itemName" placeholder="Item Name" onChange={handleChange} value={form.itemName} />
        <input className="border px-2 py-2 rounded w-full" type="number" name="price" placeholder="Price" onChange={handleChange} value={form.price} />
        <input className="border px-2 py-2 rounded w-full" type="number" name="quantity" placeholder="Quantity" onChange={handleChange} value={form.quantity} />
        <textarea className="border px-2 py-2 rounded w-full" name="note" placeholder="Note" rows="3" onChange={handleChange} value={form.note}></textarea>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <button type="submit" className="bg-slate-900 text-white px-3 py-2 rounded">{isEditing ? "Save" : "Add Expense"}</button>
        {isEditing && (
          <button type="button" onClick={() => { setForm({ date: "", itemName: "", price: "", quantity: "", note: "" }); if (typeof onClose === "function") onClose(); }} className="px-3 py-2 rounded border">Cancel</button>
        )}
      </div>
    </form>
  );
}