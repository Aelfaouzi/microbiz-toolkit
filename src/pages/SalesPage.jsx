import { useState, useEffect } from "react";
import { getExpenses, getSales } from "../services/api";
import SaleForm from "../components/SaleForm";
import SaleTable from "../components/SaleTable";

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const loadData = async () => {
    const sal = await getSales();
    setSales(sal.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Sales</h2>
      
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm mr-2"><span className="font-semibold">Total:</span> ${totalSales.toFixed(2)}</p>
        <button
          onClick={() => { setShowForm(!showForm); setSelectedSale(null); }}
          className="px-4 py-2 rounded bg-slate-900 text-white"
        >
          {showForm ? 'Close' : 'Add Sale'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <SaleForm
            refresh={loadData}
            initialData={selectedSale}
            onClose={() => { setShowForm(false); setSelectedSale(null); }}
          />
        </div>
      )}

      <SaleTable
        sales={sales}
        refresh={loadData}
        onEdit={(item) => { setSelectedSale(item); setShowForm(true); }}
      />
    </div>
  );
}
