import { useState, useEffect } from 'react';
import { addInventoryItem, updateInventoryItem } from '../services/api';

export default function InventoryForm({ initialData, onClose, refresh }) {
  const [form, setForm] = useState({
    itemName: '',
    quantity: '',
    minStockLevel: '',
    price: '',
    supplier: '',
    lastRestocked: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData && initialData.id) {
      console.log('Form initializing with data:', initialData);
      setForm(initialData);
    } else {
      console.log('Form reset to empty');
      setForm({
        itemName: '',
        quantity: '',
        minStockLevel: '',
        price: '',
        supplier: '',
        lastRestocked: new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'minStockLevel' || name === 'price'
        ? parseFloat(value) || ''
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Form submitted with data:', form);
    console.log('Is editing:', initialData && initialData.id);

    // Validation
    if (!form.itemName.trim()) {
      setError('Item name is required');
      return;
    }
    if (form.quantity === '' || isNaN(form.quantity) || form.quantity < 0) {
      setError('Valid quantity is required');
      return;
    }
    if (form.minStockLevel === '' || isNaN(form.minStockLevel) || form.minStockLevel < 0) {
      setError('Valid minimum stock level is required');
      return;
    }
    if (form.price === '' || isNaN(form.price) || form.price < 0) {
      setError('Valid price is required');
      return;
    }
    if (!form.supplier.trim()) {
      setError('Supplier is required');
      return;
    }

    try {
      setLoading(true);
      console.log('Attempting to save:', initialData && initialData.id ? 'update' : 'add');
      
      if (initialData && initialData.id) {
        // Update existing item - send only the fields we want to update (not the id)
        const updateData = { ...form };
        console.log('Updating item with ID:', initialData.id, 'Data:', updateData);
        await updateInventoryItem(initialData.id, updateData);
      } else {
        // Add new item
        console.log('Adding new item', form);
        await addInventoryItem(form);
      }

      console.log('Success! Calling refresh and onClose');
      setForm({
        itemName: '',
        quantity: '',
        minStockLevel: '',
        price: '',
        supplier: '',
        lastRestocked: new Date().toISOString().split('T')[0],
      });

      refresh?.();
      onClose?.();
    } catch (err) {
      console.error('Error saving inventory item:', err);
      setError(err.response?.data?.message || 'Error saving inventory item');
    } finally {
      setLoading(false);
    }
  };

  const isEditing = initialData && initialData.id;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm mb-6">
      <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Material' : 'Add New Material'}</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Item Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Item Name *
          </label>
          <input
            type="text"
            name="itemName"
            value={form.itemName}
            onChange={handleChange}
            placeholder="e.g., Cotton Fabric, Thread"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            disabled={loading}
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Quantity *
          </label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            disabled={loading}
          />
        </div>

        {/* Min Stock Level */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Minimum Stock Level *
          </label>
          <input
            type="number"
            name="minStockLevel"
            value={form.minStockLevel}
            onChange={handleChange}
            placeholder="e.g., 5"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            disabled={loading}
          />
        </div>

        {/* Unit Price */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Unit Price ($) *
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            disabled={loading}
          />
        </div>

        {/* Supplier */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Supplier *
          </label>
          <input
            type="text"
            name="supplier"
            value={form.supplier}
            onChange={handleChange}
            placeholder="e.g., Local Market, Fabric Store"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            disabled={loading}
          />
        </div>

        {/* Last Restocked */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Last Restocked Date
          </label>
          <input
            type="date"
            name="lastRestocked"
            value={form.lastRestocked}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 font-medium"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Material' : 'Add Material'}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={() => onClose?.()}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 text-slate-900 rounded-lg hover:bg-gray-400 disabled:opacity-50 font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
