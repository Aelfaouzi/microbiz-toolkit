import { useState, useEffect } from 'react';
import { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } from '../services/api';
import InventoryForm from '../components/InventoryForm';
import Notification from '../components/Notification';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const response = await getInventory();
      const items = response.data;
      console.log('Inventory loaded:', items);
      setInventory(items);
      
      // Check for low stock items
      checkLowStock(items);
    } catch (error) {
      console.error('Failed to load inventory:', error);
      addNotification('Failed to load inventory', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkLowStock = (items) => {
    const lowStockItems = items.filter(item => item.quantity <= item.minStockLevel);
    
    if (lowStockItems.length > 0) {
      lowStockItems.forEach(item => {
        addNotification(
          `⚠️ Low Stock: "${item.itemName}" has only ${item.quantity} units left (minimum: ${item.minStockLevel})`,
          'warning'
        );
      });
    }
  };

  const addNotification = (message, type = 'warning') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleDelete = async (id, itemName) => {
    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      try {
        await deleteInventoryItem(id);
        addNotification(`"${itemName}" has been deleted`, 'success');
        loadInventory();
      } catch (error) {
        console.error('Delete error:', error);
        addNotification('Failed to delete item', 'error');
      }
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const lowStockCount = inventory.filter(item => item.quantity <= item.minStockLevel).length;
  const criticalStockCount = inventory.filter(item => item.quantity === 0).length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Materials Inventory</h2>
        <button
          onClick={() => { setShowForm(!showForm); setSelectedItem(null); }}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium"
        >
          {showForm ? 'Close' : 'Add Material'}
        </button>
      </div>

      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map(notif => (
          <Notification
            key={notif.id}
            message={notif.message}
            type={notif.type}
            duration={6000}
            onClose={() => removeNotification(notif.id)}
          />
        ))}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <InventoryForm
          initialData={selectedItem}
          onClose={() => { setShowForm(false); setSelectedItem(null); }}
          refresh={loadInventory}
        />
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
          <p className="text-sm text-slate-600 mb-2">Total Items</p>
          <p className="text-2xl font-semibold text-slate-900">{inventory.length}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
          <p className="text-sm text-slate-600 mb-2">Inventory Value</p>
          <p className="text-2xl font-semibold text-slate-900">${totalValue.toFixed(2)}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-orange-300 shadow-sm bg-orange-50">
          <p className="text-sm text-orange-600 mb-2">Low Stock Items</p>
          <p className="text-2xl font-semibold text-orange-600">{lowStockCount}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-red-300 shadow-sm bg-red-50">
          <p className="text-sm text-red-600 mb-2">Out of Stock</p>
          <p className="text-2xl font-semibold text-red-600">{criticalStockCount}</p>
        </div>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <p className="text-center text-slate-600">Loading inventory...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Item Name</th>
                <th className="px-4 py-3 text-left font-semibold">Quantity</th>
                <th className="px-4 py-3 text-left font-semibold">Min Stock Level</th>
                <th className="px-4 py-3 text-left font-semibold">Unit Price</th>
                <th className="px-4 py-3 text-left font-semibold">Total Value</th>
                <th className="px-4 py-3 text-left font-semibold">Supplier</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, idx) => {
                const isLowStock = item.quantity <= item.minStockLevel;
                const isOutOfStock = item.quantity === 0;
                const totalValue = item.quantity * item.price;

                return (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-300 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                    } ${isOutOfStock ? 'bg-red-50' : isLowStock ? 'bg-yellow-50' : ''}`}
                  >
                    <td className="px-4 py-3 font-medium">{item.itemName}</td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">{item.minStockLevel}</td>
                    <td className="px-4 py-3">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 font-semibold">${totalValue.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.supplier}</td>
                    <td className="px-4 py-3">
                      {isOutOfStock && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-semibold">
                          Out of Stock
                        </span>
                      )}
                      {isLowStock && !isOutOfStock && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm font-semibold">
                          Low Stock ⚠️
                        </span>
                      )}
                      {!isLowStock && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-semibold">
                          In Stock ✓
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setSelectedItem(item); setShowForm(true); }}
                          className="px-3 py-1 bg-slate-100 text-slate-900 rounded hover:bg-slate-200 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.itemName)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {inventory.length === 0 && !loading && (
        <div className="text-center py-12 text-slate-500">
          <p>No inventory items found. Add materials/fabric to get started!</p>
        </div>
      )}
    </div>
  );
}
