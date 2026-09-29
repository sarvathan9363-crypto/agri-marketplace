import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Users, Tractor, Package, ShoppingBag, CreditCard, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StatsCard, StatusBadge, LoadingState, Card } from '../../components/ui/Components';
import DataTable from '../../components/ui/DataTable';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const COLORS = ['#00ed64', '#00684a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard().then(r => setData(r.dashboard)).catch(() => toast.error('Failed to load dashboard.')).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (!data) return null;

  const orderColumns = [
    { header: t('adminDashboard.colProductName', { defaultValue: 'PRODUCT NAME' }), key: 'productName', render: (o) => <span className="font-extrabold text-[#001e2b] font-display">{o.productName}</span> },
    { header: t('adminDashboard.colBuyer', { defaultValue: 'BUYER' }), key: 'buyerName' },
    { header: t('adminDashboard.colFarmerFpo', { defaultValue: 'FARMER / FPO' }), key: 'farmerName' },
    { header: t('adminDashboard.colAmount', { defaultValue: 'AMOUNT' }), key: 'totalAmount', type: 'currency' },
    { header: t('adminDashboard.colStatus', { defaultValue: 'STATUS' }), key: 'orderStatus', type: 'status' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">{t('common.executiveControls')}</span>
        <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">{t('common.adminDashboard')}</h1>
        <p className="text-sm text-gray-600 mt-1 font-sans">{t('common.agribazaarPlatformMetricsFarmerVerificationPipeline')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard icon={Users} label={t('adminDashboard.totalUsers', { defaultValue: 'Total Users' })} value={data.totalUsers} color="blue" />
        <StatsCard icon={Tractor} label={t('adminDashboard.farmersFpos', { defaultValue: 'Farmers / FPOs' })} value={data.totalFarmers} color="primary" />
        <StatsCard icon={Clock} label={t('adminDashboard.pendingVerifications', { defaultValue: 'Pending Verifications' })} value={data.pendingVerifications} color="amber" />
        <StatsCard icon={Package} label={t('adminDashboard.activeProducts', { defaultValue: 'Active Products' })} value={data.activeProducts} color="emerald" />
        <StatsCard icon={ShoppingBag} label={t('adminDashboard.totalOrders', { defaultValue: 'Total Orders' })} value={data.totalOrders} color="purple" />
        <StatsCard icon={TrendingUp} label={t('adminDashboard.completedOrders', { defaultValue: 'Completed Orders' })} value={data.completedOrders} color="emerald" />
        <StatsCard icon={CreditCard} label={t('adminDashboard.totalRevenue', { defaultValue: 'Total Revenue' })} value={`₹${(data.totalRevenue || 0).toLocaleString()}`} color="blue" />
        <StatsCard icon={Users} label={t('adminDashboard.totalBuyers', { defaultValue: 'Total Buyers' })} value={data.totalBuyers} color="rose" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card title={t('adminDashboard.monthlyOrderVolumeTitle', { defaultValue: 'Monthly Order Volume' })} subtitle={t('adminDashboard.monthlyOrderVolumeDesc', { defaultValue: 'Number of fulfilled orders by month.' })}>
          {data.monthlyOrders?.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.monthlyOrders}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4e8" />
                <XAxis dataKey="_id" tick={{ fontSize: 12, fill: '#001e2b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#001e2b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#001e2b', color: '#fff', borderRadius: '16px', border: 'none' }} />
                <Bar dataKey="count" fill="#00ed64" radius={[8, 8, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-gray-400 text-center py-16">{t('common.noOrderVolumeDataYet')}</p>}
        </Card>

        <Card title={t('adminDashboard.categoryDistributionTitle', { defaultValue: 'Product Category Distribution' })} subtitle={t('adminDashboard.categoryDistributionDesc', { defaultValue: 'Active crop listings across categories.' })}>
          {data.categoryDistribution?.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={data.categoryDistribution} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label={({ _id, count }) => `${_id} (${count})`}>
                  {data.categoryDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-gray-400 text-center py-16">{t('common.noCategoryDistributionDataYet')}</p>}
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-[#001e2b] font-display">{t('common.recentPlatformOrders')}</h2>
        <DataTable
          columns={orderColumns}
          data={data.recentOrders || []}
          emptyTitle={t('adminDashboard.noPlatformOrders', { defaultValue: 'No platform orders' })}
        />
      </div>
    </div>
  );
}
