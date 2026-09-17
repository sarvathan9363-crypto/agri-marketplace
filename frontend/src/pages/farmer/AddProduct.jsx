import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Save, Send, Eye, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Input, Select, TextArea } from '../../components/ui/Input';
import { Card } from '../../components/ui/Components';
import productService from '../../services/productService';
import toast from 'react-hot-toast';

const categories = [
  { value: 'FRUITS', label: 'Fruits' },
  { value: 'VEGETABLES', label: 'Vegetables' },
  { value: 'GRAINS', label: 'Grains & Rice' },
  { value: 'PULSES', label: 'Pulses & Lentils' },
  { value: 'SPICES', label: 'Spices' },
  { value: 'MILLETS', label: 'Millets' },
  { value: 'DAIRY', label: 'Dairy Produce' },
  { value: 'OTHER', label: 'Other Crops' },
];

const units = [
  { value: 'KG', label: 'Kilogram (KG)' },
  { value: 'QUINTAL', label: 'Quintal (100 KG)' },
  { value: 'TON', label: 'Metric Ton' },
  { value: 'LITRE', label: 'Litre' },
  { value: 'PIECE', label: 'Piece / Bundle' },
];

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [form, setForm] = useState({
    productName: '', category: 'VEGETABLES', description: '', quantity: '',
    unit: 'KG', pricePerUnit: '', location: '', harvestDate: '', availableFrom: '',
    images: [''],
  });

  const update = (field, value) => setForm({ ...form, [field]: value });

  const validate = () => {
    if (!form.productName) { toast.error('Product name is required.'); return false; }
    if (!form.category) { toast.error('Category is required.'); return false; }
    if (!form.quantity || Number(form.quantity) <= 0) { toast.error('Quantity must be greater than 0.'); return false; }
    if (!form.pricePerUnit || Number(form.pricePerUnit) <= 0) { toast.error('Price must be greater than 0.'); return false; }
    if (!form.location) { toast.error('Location is required.'); return false; }
    return true;
  };

  const handleSubmit = async (status) => {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = {
        ...form,
        quantity: Number(form.quantity),
        pricePerUnit: Number(form.pricePerUnit),
        images: form.images.filter(Boolean),
        status,
      };
      await productService.createProduct(data);
      toast.success(status === 'DRAFT' ? 'Product saved as draft.' : 'Product published successfully!');
      navigate('/farmer/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  if (preview) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-[#001e2b] font-display">Crop Preview</h1>
          <Button variant="outline" size="sm" icon={ArrowLeft} onClick={() => setPreview(false)}>
            Back to Edit
          </Button>
        </div>

        <Card className="max-w-2xl">
          <h2 className="text-2xl font-black text-[#001e2b] font-display">{form.productName || 'Product Title'}</h2>
          <span className="inline-block mt-2 px-3 py-1 bg-[#001e2b] text-[#00ed64] text-xs font-bold uppercase rounded-full font-display">{form.category}</span>
          <p className="mt-4 text-sm text-gray-600 font-sans leading-relaxed">{form.description || 'No description provided.'}</p>
          
          <div className="mt-6 p-4 bg-[#fafcf8] border border-[#e8eddb] rounded-2xl grid grid-cols-2 gap-4 text-xs font-sans">
            <div><span className="text-gray-500">Price:</span> <span className="font-extrabold text-[#001e2b] font-display">₹{form.pricePerUnit || 0} / {form.unit}</span></div>
            <div><span className="text-gray-500">Stock:</span> <span className="font-bold text-[#001e2b]">{form.quantity || 0} {form.unit}</span></div>
            <div><span className="text-gray-500">Location:</span> <span className="font-bold text-[#001e2b]">{form.location || '—'}</span></div>
            <div><span className="text-gray-500">Harvest:</span> <span className="font-bold text-[#001e2b]">{form.harvestDate || '—'}</span></div>
          </div>

          <div className="mt-8 flex gap-3">
            <Button variant="outline" size="md" icon={Save} loading={loading} onClick={() => handleSubmit('DRAFT')}>
              Save Draft
            </Button>
            <Button variant="primary" size="md" icon={Send} loading={loading} onClick={() => handleSubmit('ACTIVE')}>
              Publish Listing
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">New Crop Listing</span>
        <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">Add New Product</h1>
        <p className="text-sm text-gray-600 mt-1 font-sans">Create a verified produce listing to sell directly to buyers.</p>
      </div>

      <Card className="max-w-3xl">
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <Input
            label="Product / Crop Name *"
            required
            placeholder="e.g. Organic Basmati Rice"
            value={form.productName}
            onChange={(e) => update('productName', e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Crop Category *"
              required
              options={categories}
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
            />

            <Select
              label="Measurement Unit *"
              required
              options={units}
              value={form.unit}
              onChange={(e) => update('unit', e.target.value)}
            />
          </div>

          <TextArea
            label="Produce Description"
            rows={3}
            placeholder="Describe farming techniques, variety, or special packaging..."
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Available Quantity *"
              required
              min="1"
              placeholder="e.g. 500"
              value={form.quantity}
              onChange={(e) => update('quantity', e.target.value)}
            />

            <Input
              type="number"
              label={`Price per ${form.unit} (₹) *`}
              required
              min="1"
              placeholder="e.g. 85"
              value={form.pricePerUnit}
              onChange={(e) => update('pricePerUnit', e.target.value)}
            />
          </div>

          <Input
            label="Farm Location (City, State) *"
            required
            placeholder="e.g. Nashik, Maharashtra"
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Harvest Date"
              value={form.harvestDate}
              onChange={(e) => update('harvestDate', e.target.value)}
            />

            <Input
              type="date"
              label="Available From"
              value={form.availableFrom}
              onChange={(e) => update('availableFrom', e.target.value)}
            />
          </div>

          <Input
            label="Image URL"
            placeholder="https://images.unsplash.com/photo-..."
            value={form.images[0]}
            onChange={(e) => setForm({ ...form, images: [e.target.value] })}
          />

          <div className="mt-8 pt-4 border-t border-[#f0f4e8] flex flex-wrap gap-3">
            <Button variant="outline" size="md" icon={Save} loading={loading} onClick={() => handleSubmit('DRAFT')}>
              Save Draft
            </Button>
            <Button variant="ghost" size="md" icon={Eye} onClick={() => setPreview(true)}>
              Preview Listing
            </Button>
            <Button variant="primary" size="md" icon={Send} loading={loading} onClick={() => handleSubmit('ACTIVE')}>
              {loading ? 'Publishing...' : 'Publish Listing'}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
