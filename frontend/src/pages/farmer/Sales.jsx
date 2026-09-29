import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import farmerService from '../../services/farmerService';
import { StatsCard, LoadingState, Card } from '../../components/ui/Components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, ShoppingBag, Package } from 'lucide-react';

export default function FarmerSales() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    farmerService.getSalesStats().then(r => setData(r.sales)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (!data) return <div className="text-center py-16 text-gray-400">{t('farmerSales.salesAnalyticsComingSoon')}</div>;

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">{t('farmerSales.financialInsights')}</span>
        <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">{t('farmerSales.salesAnalytics')}</h1>
        <p className="text-sm text-gray-600 mt-1 font-sans">{t('farmerSales.trackYourMonthlyRevenueGrowthAverage')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard icon={DollarSign} label={t('farmerSales.totalRevenue', { defaultValue: 'Total Revenue' })} value={`₹${(data.totalRevenue || 0).toLocaleString()}`} color="primary" />
        <StatsCard icon={ShoppingBag} label={t('farmerSales.totalOrders', { defaultValue: 'Total Orders' })} value={data.totalOrders || 0} color="blue" />
        <StatsCard icon={TrendingUp} label={t('farmerSales.avgOrderValue', { defaultValue: 'Avg Order Value' })} value={`₹${(data.avgOrderValue || 0).toFixed(0)}`} color="emerald" />
        <StatsCard icon={Package} label={t('farmerSales.productsSold', { defaultValue: 'Products Sold' })} value={data.productsSold || 0} color="amber" />
      </div>

      {data.monthlySales?.length > 0 && (
        <Card title={t('farmerSales.monthlyRevenueTitle', { defaultValue: 'Monthly Revenue Growth' })} subtitle={t('farmerSales.monthlyRevenueSubtitle', { defaultValue: 'Breakdown of direct produce sales revenue by month.' })}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4e8" />
              <XAxis dataKey="_id" tick={{ fontSize: 12, fill: '#001e2b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#001e2b' }} />
              <Tooltip contentStyle={{ backgroundColor: '#001e2b', color: '#fff', borderRadius: '16px', border: 'none' }} />
              <Bar dataKey="revenue" fill="#00ed64" radius={[8, 8, 0, 0]} name={t('farmerSales.revenueChartLabel', { defaultValue: 'Revenue (₹)' })} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}
