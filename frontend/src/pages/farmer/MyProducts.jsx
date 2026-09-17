import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Components';
import farmerService from '../../services/farmerService';
import productService from '../../services/productService';
import toast from 'react-hot-toast';

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => { fetchProducts(); }, [statusFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (search) params.search = search;
      const res = await farmerService.getMyProducts(params);
      setProducts(res.products || []);
    } catch {
      toast.error('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product listing?')) return;
    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted.');
      setProducts(p => p.filter(x => x._id !== id));
    } catch { toast.error('Failed to delete.'); }
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await productService.updateProduct(id, { status: newStatus });
      toast.success(`Product ${newStatus === 'ACTIVE' ? 'activated' : 'paused'}.`);
      setProducts(p => p.map(x => x._id === id ? { ...x, status: newStatus } : x));
    } catch { toast.error('Failed to update.'); }
  };

  const statuses = ['ALL', 'ACTIVE', 'DRAFT', 'INACTIVE', 'OUT_OF_STOCK'];

  const columns = [
    {
      header: 'Product',
      key: 'productName',
      render: (p) => (
        <div className="flex items-center gap-3">
          <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=80'} alt="" className="w-10 h-10 rounded-xl object-cover border border-[#e8eddb]" />
          <span className="font-extrabold text-[#001e2b] font-display">{p.productName}</span>
        </div>
      )
    },
    { header: 'Category', key: 'category' },
    {
      header: 'Available Stock',
      key: 'quantity',
      render: (p) => <span className="font-semibold text-gray-700">{p.quantity} {p.unit}</span>
    },
    { header: 'Price / Unit', key: 'pricePerUnit', type: 'currency' },
    { header: 'Status', key: 'status', type: 'status' },
    {
      header: 'Actions',
      key: 'actions',
      headerClassName: 'text-right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <Link to={`/marketplace/${p._id}`} className="p-2 hover:bg-[#00684a]/10 rounded-xl text-gray-600 hover:text-[#00684a]">
            <Eye className="w-4 h-4" />
          </Link>
          <button onClick={() => handleToggle(p._id, p.status)} className="px-2.5 py-1 hover:bg-[#00ed64]/20 rounded-xl text-xs font-bold text-[#00684a]">
            {p.status === 'ACTIVE' ? 'Pause' : 'Activate'}
          </button>
          <button onClick={() => handleDelete(p._id)} className="p-2 hover:bg-red-50 rounded-xl text-red-500">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">Crop Inventory</span>
          <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">My Products</h1>
          <p className="text-sm text-gray-600 mt-1 font-sans">Manage your active, draft, and out of stock produce listings ({products.length} total).</p>
        </div>
        <Link to="/farmer/products/add">
          <Button variant="primary" size="md" icon={Plus}>
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-[#e8eddb] shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Search crop listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#d0d7de] rounded-xl text-xs font-medium text-[#001e2b] focus:outline-none focus:border-[#00684a]"
          />
        </div>
        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all font-display ${
                statusFilter === s ? 'bg-[#001e2b] text-[#00ed64]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'ALL' ? 'All Status' : s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        emptyTitle="No products listed"
        emptyDescription="Get started by creating your first crop listing on AgriBazaar."
      />
    </div>
  );
}
