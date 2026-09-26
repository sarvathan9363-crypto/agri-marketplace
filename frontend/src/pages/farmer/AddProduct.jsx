import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Save, Send, Eye, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Input, Select, TextArea } from '../../components/ui/Input';
import { Card } from '../../components/ui/Components';
import productService from '../../services/productService';
import toast from 'react-hot-toast';
import SecureFileUpload from '../../components/common/SecureFileUpload';
import { translateCategory, translateUnit } from '../../utils/enumTranslations';

const RAW_CATEGORIES = [
  { value: 'FRUITS', labelKey: 'categories.fruits', defaultLabel: 'Fruits' },
  { value: 'VEGETABLES', labelKey: 'categories.vegetables', defaultLabel: 'Vegetables' },
  { value: 'GRAINS', labelKey: 'categories.grains', defaultLabel: 'Grains & Rice' },
  { value: 'PULSES', labelKey: 'categories.pulses', defaultLabel: 'Pulses & Lentils' },
  { value: 'SPICES', labelKey: 'categories.spices', defaultLabel: 'Spices' },
  { value: 'MILLETS', labelKey: 'categories.millets', defaultLabel: 'Millets' },
  { value: 'DAIRY', labelKey: 'categories.dairy', defaultLabel: 'Dairy Produce' },
  { value: 'OTHER', labelKey: 'categories.other', defaultLabel: 'Other Crops' },
];

const RAW_UNITS = [
  { value: 'KG', labelKey: 'units.kg', defaultLabel: 'Kilogram (KG)' },
  { value: 'QUINTAL', labelKey: 'units.quintal', defaultLabel: 'Quintal (100 KG)' },
  { value: 'TON', labelKey: 'units.ton', defaultLabel: 'Metric Ton' },
  { value: 'LITRE', labelKey: 'units.litre', defaultLabel: 'Litre' },
  { value: 'PIECE', labelKey: 'units.piece', defaultLabel: 'Piece / Bundle' },
];

export default function AddProduct() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [form, setForm] = useState({
    productName: '', category: 'VEGETABLES', description: '', quantity: '',
    unit: 'KG', pricePerUnit: '', location: '', harvestDate: '', availableFrom: '',
    images: [''],
  });

  const categories = RAW_CATEGORIES.map(c => ({
    value: c.value,
    label: t(c.labelKey, { defaultValue: c.defaultLabel }),
  }));

  const units = RAW_UNITS.map(u => ({
    value: u.value,
    label: t(u.labelKey, { defaultValue: u.defaultLabel }),
  }));

  const update = (field, value) => setForm({ ...form, [field]: value });

  const validate = () => {
    if (!form.productName) { toast.error(t('farmerAddProduct.nameRequired', { defaultValue: 'Product name is required.' })); return false; }
    if (!form.category) { toast.error(t('farmerAddProduct.categoryRequired', { defaultValue: 'Category is required.' })); return false; }
    if (!form.quantity || Number(form.quantity) <= 0) { toast.error(t('farmerAddProduct.quantityGreaterThanZero', { defaultValue: 'Quantity must be greater than 0.' })); return false; }
    if (!form.pricePerUnit || Number(form.pricePerUnit) <= 0) { toast.error(t('farmerAddProduct.priceGreaterThanZero', { defaultValue: 'Price must be greater than 0.' })); return false; }
    if (!form.location) { toast.error(t('farmerAddProduct.locationRequired', { defaultValue: 'Location is required.' })); return false; }
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
      toast.success(status === 'DRAFT' ? t('farmerAddProduct.savedAsDraft', { defaultValue: 'Product saved as draft.' }) : t('farmerAddProduct.publishedSuccess', { defaultValue: 'Product published successfully!' }));
      navigate('/farmer/products');
    } catch (err) {
      toast.error(err.response?.data?.message || t('farmerAddProduct.failedToCreate', { defaultValue: 'Failed to create product.' }));
    } finally {
      setLoading(false);
    }
  };

  if (preview) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-[#001e2b] font-display">{t('farmerAddProduct.cropPreview')}</h1>
          <Button variant="outline" size="sm" icon={ArrowLeft} onClick={() => setPreview(false)}>
            {t('farmerAddProduct.backToEdit', { defaultValue: 'Back to Edit' })}
          </Button>
        </div>

        <Card className="max-w-2xl">
          <h2 className="text-2xl font-black text-[#001e2b] font-display">{form.productName || t('farmerAddProduct.productTitlePlaceholder', { defaultValue: 'Product Title' })}</h2>
          <span className="inline-block mt-2 px-3 py-1 bg-[#001e2b] text-[#00ed64] text-xs font-bold uppercase rounded-full font-display">{translateCategory(t, form.category)}</span>
          <p className="mt-4 text-sm text-gray-600 font-sans leading-relaxed">{form.description || t('farmerAddProduct.noDescriptionProvided', { defaultValue: 'No description provided.' })}</p>
          
          <div className="mt-6 p-4 bg-[#fafcf8] border border-[#e8eddb] rounded-2xl grid grid-cols-2 gap-4 text-xs font-sans">
            <div><span className="text-gray-500">{t('farmerAddProduct.price')}</span> <span className="font-extrabold text-[#001e2b] font-display">₹{form.pricePerUnit || 0} / {translateUnit(t, form.unit)}</span></div>
            <div><span className="text-gray-500">{t('farmerAddProduct.stock')}</span> <span className="font-bold text-[#001e2b]">{form.quantity || 0} {translateUnit(t, form.unit)}</span></div>
            <div><span className="text-gray-500">{t('farmerAddProduct.location')}</span> <span className="font-bold text-[#001e2b]">{form.location || '—'}</span></div>
            <div><span className="text-gray-500">{t('farmerAddProduct.harvest')}</span> <span className="font-bold text-[#001e2b]">{form.harvestDate || '—'}</span></div>
          </div>

          <div className="mt-8 flex gap-3">
            <Button variant="outline" size="md" icon={Save} loading={loading} onClick={() => handleSubmit('DRAFT')}>
              {t('farmerAddProduct.saveDraft', { defaultValue: 'Save Draft' })}
            </Button>
            <Button variant="primary" size="md" icon={Send} loading={loading} onClick={() => handleSubmit('ACTIVE')}>
              {t('farmerAddProduct.publishListing', { defaultValue: 'Publish Listing' })}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">{t('farmerAddProduct.newCropListing')}</span>
        <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">{t('farmerAddProduct.addNewProduct')}</h1>
        <p className="text-sm text-gray-600 mt-1 font-sans">{t('farmerAddProduct.createAVerifiedProduceListingTo')}</p>
      </div>

      <Card className="max-w-3xl">
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <Input
            label={t('farmerAddProduct.productCropNameLabel', { defaultValue: 'PRODUCT / CROP NAME *' })}
            required
            placeholder={t('farmerAddProduct.placeholderProductName', { defaultValue: 'e.g. Organic Basmati Rice' })}
            value={form.productName}
            onChange={(e) => update('productName', e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label={t('farmerAddProduct.cropCategoryLabel', { defaultValue: 'CROP CATEGORY *' })}
              required
              options={categories}
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
            />

            <Select
              label={t('farmerAddProduct.measurementUnitLabel', { defaultValue: 'MEASUREMENT UNIT *' })}
              required
              options={units}
              value={form.unit}
              onChange={(e) => update('unit', e.target.value)}
            />
          </div>

          <TextArea
            label={t('farmerAddProduct.produceDescriptionLabel', { defaultValue: 'PRODUCE DESCRIPTION' })}
            rows={3}
            placeholder={t('farmerAddProduct.placeholderDescription', { defaultValue: 'Describe farming techniques, variety, or special packaging...' })}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="number"
              label={t('farmerAddProduct.availableQuantityLabel', { defaultValue: 'AVAILABLE QUANTITY *' })}
              required
              min="1"
              placeholder={t('farmerAddProduct.placeholderQuantity', { defaultValue: 'e.g. 500' })}
              value={form.quantity}
              onChange={(e) => update('quantity', e.target.value)}
            />

            <Input
              type="number"
              label={t('farmerAddProduct.pricePerUnitLabel', { unit: translateUnit(t, form.unit), defaultValue: `PRICE PER ${form.unit} (₹) *` })}
              required
              min="1"
              placeholder={t('farmerAddProduct.placeholderPrice', { defaultValue: 'e.g. 85' })}
              value={form.pricePerUnit}
              onChange={(e) => update('pricePerUnit', e.target.value)}
            />
          </div>

          <Input
            label={t('farmerAddProduct.farmLocationLabel', { defaultValue: 'FARM LOCATION (CITY, STATE) *' })}
            required
            placeholder={t('farmerAddProduct.placeholderLocation', { defaultValue: 'e.g. Nashik, Maharashtra' })}
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="date"
              label={t('farmerAddProduct.harvestDateLabel', { defaultValue: 'HARVEST DATE' })}
              value={form.harvestDate}
              onChange={(e) => update('harvestDate', e.target.value)}
            />

            <Input
              type="date"
              label={t('farmerAddProduct.availableFromLabel', { defaultValue: 'AVAILABLE FROM' })}
              value={form.availableFrom}
              onChange={(e) => update('availableFrom', e.target.value)}
            />
          </div>

          <div className="pt-2 border-t border-gray-100">
            <SecureFileUpload
              documentType="PRODUCT_IMAGE"
              category="PRODUCT"
              subCategory="IMAGES"
              entityType="PRODUCT"
              acceptedFileTypes=".jpg,.jpeg,.png,.webp"
              label={t('farmerAddProduct.uploadImageLabel', { defaultValue: 'Upload Crop Product Image *' })}
              description={t('farmerAddProduct.uploadImageDesc', { defaultValue: 'High quality JPG, PNG, or WEBP image of agricultural produce (PDF not allowed)' })}
              onUploadSuccess={(fileData) => {
                setForm((prev) => ({
                  ...prev,
                  images: [fileData.secureUrl, ...prev.images.filter(Boolean)],
                }));
              }}
            />
          </div>

          <div className="mt-8 pt-4 border-t border-[#f0f4e8] flex flex-wrap gap-3">
            <Button variant="outline" size="md" icon={Save} loading={loading} onClick={() => handleSubmit('DRAFT')}>
              {t('farmerAddProduct.saveDraft', { defaultValue: 'Save Draft' })}
            </Button>
            <Button variant="ghost" size="md" icon={Eye} onClick={() => setPreview(true)}>
              {t('farmerAddProduct.previewListing', { defaultValue: 'Preview Listing' })}
            </Button>
            <Button variant="primary" size="md" icon={Send} loading={loading} onClick={() => handleSubmit('ACTIVE')}>
              {loading ? t('farmerAddProduct.publishing', { defaultValue: 'Publishing...' }) : t('farmerAddProduct.publishListing', { defaultValue: 'Publish Listing' })}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
