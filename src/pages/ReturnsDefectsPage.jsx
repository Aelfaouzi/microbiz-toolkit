import { useState, useEffect } from 'react';
import { getReturns, addReturn, updateReturn, deleteReturn, getDefects, addDefect, updateDefect, deleteDefect } from '../services/api';
import Notification from '../components/Notification';

const SIZES = ['kids', 'sm', 'md', 'lg', 'xl', 'xxl', '3xl'];

export default function ReturnsDefectsPage() {
  const [returns, setReturns] = useState([]);
  const [defects, setDefects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('returns');
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [showDefectForm, setShowDefectForm] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [selectedDefect, setSelectedDefect] = useState(null);

  const [returnForm, setReturnForm] = useState({
    clothingType: '',
    size: 'md',
    quantity: 1,
    originalPrice: '',
    returnDate: new Date().toISOString().split('T')[0],
    reason: '',
    condition: 'good',
    refundAmount: '',
  });

  const [defectForm, setDefectForm] = useState({
    clothingType: '',
    size: 'md',
    quantity: 1,
    defectType: '',
    originalPrice: '',
    discountedPrice: '',
    dateIdentified: new Date().toISOString().split('T')[0],
    status: 'available',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [returnsRes, defectsRes] = await Promise.all([
        getReturns(),
        getDefects()
      ]);
      setReturns(returnsRes.data);
      setDefects(defectsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
      addNotification('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedReturn?.id) {
      setReturnForm(selectedReturn);
    }
  }, [selectedReturn]);

  useEffect(() => {
    if (selectedDefect?.id) {
      setDefectForm(selectedDefect);
    }
  }, [selectedDefect]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    
    if (!returnForm.clothingType.trim()) {
      addNotification('Clothing type is required', 'error');
      return;
    }

    try {
      if (selectedReturn?.id) {
        await updateReturn(selectedReturn.id, returnForm);
        addNotification('Return updated successfully', 'success');
      } else {
        await addReturn(returnForm);
        addNotification('Return recorded successfully', 'success');
      }

      setReturnForm({
        clothingType: '',
        size: 'md',
        quantity: 1,
        originalPrice: '',
        returnDate: new Date().toISOString().split('T')[0],
        reason: '',
        condition: 'good',
        refundAmount: '',
      });
      setShowReturnForm(false);
      setSelectedReturn(null);
      loadData();
    } catch (error) {
      console.error('Error saving return:', error);
      addNotification('Error saving return', 'error');
    }
  };

  const handleDefectSubmit = async (e) => {
    e.preventDefault();
    
    if (!defectForm.clothingType.trim()) {
      addNotification('Clothing type is required', 'error');
      return;
    }

    try {
      if (selectedDefect?.id) {
        await updateDefect(selectedDefect.id, defectForm);
        addNotification('Defect updated successfully', 'success');
      } else {
        await addDefect(defectForm);
        addNotification('Defect recorded successfully', 'success');
      }

      setDefectForm({
        clothingType: '',
        size: 'md',
        quantity: 1,
        defectType: '',
        originalPrice: '',
        discountedPrice: '',
        dateIdentified: new Date().toISOString().split('T')[0],
        status: 'available',
      });
      setShowDefectForm(false);
      setSelectedDefect(null);
      loadData();
    } catch (error) {
      console.error('Error saving defect:', error);
      addNotification('Error saving defect', 'error');
    }
  };

  const handleDeleteReturn = async (id) => {
    if (window.confirm('Delete this return record?')) {
      try {
        await deleteReturn(id);
        addNotification('Return deleted', 'success');
        loadData();
      } catch (error) {
        console.error('Delete error:', error);
        addNotification('Failed to delete return', 'error');
      }
    }
  };

  const handleDeleteDefect = async (id) => {
    if (window.confirm('Delete this defect record?')) {
      try {
        await deleteDefect(id);
        addNotification('Defect deleted', 'success');
        loadData();
      } catch (error) {
        console.error('Delete error:', error);
        addNotification('Failed to delete defect', 'error');
      }
    }
  };

  const totalReturns = returns.length;
  const totalRefunds = returns.reduce((sum, r) => sum + (parseFloat(r.refundAmount) || 0), 0);
  const totalDefects = defects.reduce((sum, d) => sum + d.quantity, 0);
  const totalDefectLoss = defects.reduce((sum, d) => sum + ((d.originalPrice - d.discountedPrice) * d.quantity), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Returns & Defects Management</h2>

      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map(notif => (
          <Notification
            key={notif.id}
            message={notif.message}
            type={notif.type}
            duration={5000}
            onClose={() => removeNotification(notif.id)}
          />
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
          <p className="text-sm text-slate-600 mb-2">Total Returns</p>
          <p className="text-2xl font-semibold text-slate-900">{totalReturns}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-red-300 shadow-sm bg-red-50">
          <p className="text-sm text-red-600 mb-2">Total Refunds</p>
          <p className="text-2xl font-semibold text-red-600">${totalRefunds.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-orange-300 shadow-sm bg-orange-50">
          <p className="text-sm text-orange-600 mb-2">Defective Items</p>
          <p className="text-2xl font-semibold text-orange-600">{totalDefects}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-yellow-300 shadow-sm bg-yellow-50">
          <p className="text-sm text-yellow-600 mb-2">Defect Loss</p>
          <p className="text-2xl font-semibold text-yellow-600">${totalDefectLoss.toFixed(2)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-300">
        <button
          onClick={() => setActiveTab('returns')}
          className={`px-4 py-3 font-semibold border-b-2 ${
            activeTab === 'returns'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Returns ({totalReturns})
        </button>
        <button
          onClick={() => setActiveTab('defects')}
          className={`px-4 py-3 font-semibold border-b-2 ${
            activeTab === 'defects'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Defects ({totalDefects})
        </button>
      </div>

      {/* Returns Tab */}
      {activeTab === 'returns' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Return Records</h3>
            <button
              onClick={() => { setShowReturnForm(!showReturnForm); setSelectedReturn(null); }}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium"
            >
              {showReturnForm ? 'Close' : 'New Return'}
            </button>
          </div>

          {/* Return Form */}
          {showReturnForm && (
            <form onSubmit={handleReturnSubmit} className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm mb-6">
              <h4 className="text-lg font-semibold mb-4">{selectedReturn?.id ? 'Edit Return' : 'Record Return'}</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Clothing Type *</label>
                  <input
                    type="text"
                    value={returnForm.clothingType}
                    onChange={(e) => setReturnForm({ ...returnForm, clothingType: e.target.value })}
                    placeholder="e.g., Jellab"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Size</label>
                  <select
                    value={returnForm.size}
                    onChange={(e) => setReturnForm({ ...returnForm, size: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    {SIZES.map(size => (
                      <option key={size} value={size}>{size.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={returnForm.quantity}
                    onChange={(e) => setReturnForm({ ...returnForm, quantity: parseInt(e.target.value) || 1 })}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Original Price ($)</label>
                  <input
                    type="number"
                    value={returnForm.originalPrice}
                    onChange={(e) => setReturnForm({ ...returnForm, originalPrice: parseFloat(e.target.value) || '' })}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Refund Amount ($)</label>
                  <input
                    type="number"
                    value={returnForm.refundAmount}
                    onChange={(e) => setReturnForm({ ...returnForm, refundAmount: parseFloat(e.target.value) || '' })}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Return Date</label>
                  <input
                    type="date"
                    value={returnForm.returnDate}
                    onChange={(e) => setReturnForm({ ...returnForm, returnDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Condition</label>
                  <select
                    value={returnForm.condition}
                    onChange={(e) => setReturnForm({ ...returnForm, condition: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Reason</label>
                  <input
                    type="text"
                    value={returnForm.reason}
                    onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}
                    placeholder="Reason for return"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium">
                  {selectedReturn?.id ? 'Update Return' : 'Record Return'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowReturnForm(false); setSelectedReturn(null); }}
                  className="px-4 py-2 bg-gray-300 text-slate-900 rounded-lg hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Returns Table */}
          {loading ? (
            <p className="text-center text-slate-600">Loading...</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-300">
              <table className="w-full">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Clothing Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Size</th>
                    <th className="px-4 py-3 text-left font-semibold">Qty</th>
                    <th className="px-4 py-3 text-left font-semibold">Original Price</th>
                    <th className="px-4 py-3 text-left font-semibold">Refund</th>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Condition</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {returns.map((item, idx) => (
                    <tr key={item.id} className={`border-b border-gray-300 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                      <td className="px-4 py-3 font-medium">{item.clothingType}</td>
                      <td className="px-4 py-3">{item.size.toUpperCase()}</td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3">${item.originalPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 font-semibold text-red-600">${item.refundAmount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">{item.returnDate}</td>
                      <td className="px-4 py-3 text-sm capitalize">{item.condition}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setSelectedReturn(item); setShowReturnForm(true); }}
                            className="px-3 py-1 bg-slate-100 text-slate-900 rounded hover:bg-slate-200 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReturn(item.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {returns.length === 0 && !loading && (
            <div className="text-center py-12 text-slate-500">
              <p>No return records yet</p>
            </div>
          )}
        </>
      )}

      {/* Defects Tab */}
      {activeTab === 'defects' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Defect Records</h3>
            <button
              onClick={() => { setShowDefectForm(!showDefectForm); setSelectedDefect(null); }}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium"
            >
              {showDefectForm ? 'Close' : 'New Defect'}
            </button>
          </div>

          {/* Defect Form */}
          {showDefectForm && (
            <form onSubmit={handleDefectSubmit} className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm mb-6">
              <h4 className="text-lg font-semibold mb-4">{selectedDefect?.id ? 'Edit Defect' : 'Record Defect'}</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Clothing Type *</label>
                  <input
                    type="text"
                    value={defectForm.clothingType}
                    onChange={(e) => setDefectForm({ ...defectForm, clothingType: e.target.value })}
                    placeholder="e.g., Jellab"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Size</label>
                  <select
                    value={defectForm.size}
                    onChange={(e) => setDefectForm({ ...defectForm, size: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    {SIZES.map(size => (
                      <option key={size} value={size}>{size.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={defectForm.quantity}
                    onChange={(e) => setDefectForm({ ...defectForm, quantity: parseInt(e.target.value) || 1 })}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Defect Type *</label>
                  <input
                    type="text"
                    value={defectForm.defectType}
                    onChange={(e) => setDefectForm({ ...defectForm, defectType: e.target.value })}
                    placeholder="e.g., stitching issue, tear"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Original Price ($)</label>
                  <input
                    type="number"
                    value={defectForm.originalPrice}
                    onChange={(e) => setDefectForm({ ...defectForm, originalPrice: parseFloat(e.target.value) || '' })}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Discounted Price ($)</label>
                  <input
                    type="number"
                    value={defectForm.discountedPrice}
                    onChange={(e) => setDefectForm({ ...defectForm, discountedPrice: parseFloat(e.target.value) || '' })}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date Identified</label>
                  <input
                    type="date"
                    value={defectForm.dateIdentified}
                    onChange={(e) => setDefectForm({ ...defectForm, dateIdentified: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    value={defectForm.status}
                    onChange={(e) => setDefectForm({ ...defectForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="available">Available for Sale</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                    <option value="discarded">Discarded</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium">
                  {selectedDefect?.id ? 'Update Defect' : 'Record Defect'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowDefectForm(false); setSelectedDefect(null); }}
                  className="px-4 py-2 bg-gray-300 text-slate-900 rounded-lg hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Defects Table */}
          {loading ? (
            <p className="text-center text-slate-600">Loading...</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-300">
              <table className="w-full">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Clothing Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Size</th>
                    <th className="px-4 py-3 text-left font-semibold">Qty</th>
                    <th className="px-4 py-3 text-left font-semibold">Defect Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Original Price</th>
                    <th className="px-4 py-3 text-left font-semibold">Sale Price</th>
                    <th className="px-4 py-3 text-left font-semibold">Loss/Unit</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {defects.map((item, idx) => (
                    <tr key={item.id} className={`border-b border-gray-300 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                      <td className="px-4 py-3 font-medium">{item.clothingType}</td>
                      <td className="px-4 py-3">{item.size.toUpperCase()}</td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm">{item.defectType}</td>
                      <td className="px-4 py-3">${item.originalPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 font-semibold">${item.discountedPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-red-600 font-semibold">
                        ${(item.originalPrice - item.discountedPrice).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          item.status === 'available' ? 'bg-green-100 text-green-700' :
                          item.status === 'sold' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setSelectedDefect(item); setShowDefectForm(true); }}
                            className="px-3 py-1 bg-slate-100 text-slate-900 rounded hover:bg-slate-200 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDefect(item.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {defects.length === 0 && !loading && (
            <div className="text-center py-12 text-slate-500">
              <p>No defect records yet</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
