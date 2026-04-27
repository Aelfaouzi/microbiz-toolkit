import { useEffect, useState } from "react";
import { addSale, updateSale } from "../services/api";

export default function SaleForm({ refresh, initialData = null, onClose }) {
  const [form, setForm] = useState({
    date: "",
    itemName: "",
    price: "",
    quantity: "",
    size: "",
    color: "",
    note: "",
  });

  // when initialData changes, populate the form for editing
  useEffect(() => {
    if (initialData) {
      setForm({
        date: initialData.date || "",
        itemName: initialData.itemName || "",
        price: initialData.price || "",
        quantity: initialData.quantity || "",
        size: initialData.size || "",
        color: initialData.color || "",
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
        // editing
        await updateSale(initialData.id, {
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity),
          total,
        });
      } else {
        // creating
        await addSale({
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity),
          total,
        });
      }

      setForm({ date: "", itemName: "", price: "", quantity: "", size: "", color: "", note: "" });
      if (typeof refresh === "function") refresh();
      if (typeof onClose === "function") onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save sale. See console for details.");
    }
  };

  const isEditing = initialData && initialData.id;

  return (
    <form onSubmit={handleSubmit} className="bg-gray p-4 text-black rounded shadow">
      <h3 className="text-lg font-medium mb-3">{isEditing ? "Edit Sale" : "Add Sale"}</h3>

      <div className="flex flex-col gap-2 space-y-4 sale-form">
        <input className="border px-2 py-2 rounded w-full" type="date" name="date" placeholder="Date" onChange={handleChange} value={form.date} />
        <input className="border px-2 py-2 rounded w-full" type="text" name="itemName" placeholder="Item Name" onChange={handleChange} value={form.itemName} />
        <input className="border px-2 py-2 rounded w-full" type="number" name="price" placeholder="Price" onChange={handleChange} value={form.price} />
        <input className="border px-2 py-2 rounded w-full" type="number" name="quantity" placeholder="Quantity" onChange={handleChange} value={form.quantity} />
        <select className="border px-2 py-2 rounded w-full" name="size" onChange={handleChange} value={form.size}>
          <option value="">Select Size</option>
          <option value="kids">Kids</option>
          <option value="xs">XS</option>
          <option value="sm">SM</option>
          <option value="md">MD</option>
          <option value="lg">LG</option>
          <option value="xl">XL</option>
          <option value="xxl">XXL</option>
          <option value="3xl">3XL</option>
        </select>
        <input className="border px-2 py-2 rounded w-full" type="text" name="color" placeholder="Color" onChange={handleChange} value={form.color} />
        <textarea className="border px-2 py-2 rounded w-full" name="note" placeholder="Note" rows="3" onChange={handleChange} value={form.note}></textarea>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <button type="submit" className="bg-slate-900 text-white px-3 py-2 rounded">{isEditing ? "Save" : "Add Sale"}</button>
        {isEditing && (
          <button type="button" onClick={() => { setForm({ date: "", itemName: "", price: "", quantity: "", size: "", color: "", note: "" }); if (typeof onClose === "function") onClose(); }} className="px-3 py-2 rounded border">Cancel</button>
        )}
      </div>
    </form>
  );
}