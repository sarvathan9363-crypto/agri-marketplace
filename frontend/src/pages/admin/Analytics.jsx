import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { LoadingState, Card } from '../../components/ui/Components';
import { translateCategory } from '../../utils/enumTranslations';
import adminService from '../../services/adminService';

const COLORS = ['#00ed64', '#00684a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminAnalytics() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getAnalytics().then(r => setData(r.analytics)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (!data) return <div className="text-center py-16 text-gray-400 font-sans">{t('admin.noAnalyticsDataRecordedYet')}</div>;

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">{t('admin.platformIntelligence')}</span>
        <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">{t('admin.platformAnalytics')}</h1>
        <p className="text-sm text-gray-600 mt-1 font-sans">{t('admin.deepDiveIntoTradeRevenuesSeller')}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card title={t('adminAnalytics.monthlyRevenueTrend', { defaultValue: 'Monthly Revenue Trend' })} subtitle={t('adminAnalytics.grossVolumeDesc', { defaultValue: 'Gross merchandise volume by month.' })}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.monthlyOrders || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4e8" />
              <XAxis dataKey="_id" tick={{ fontSize: 12, fill: '#001e2b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#001e2b' }} />
              <Tooltip contentStyle={{ backgroundColor: '#001e2b', color: '#fff', borderRadius: '16px', border: 'none' }} />
              <Bar dataKey="revenue" fill="#00ed64" radius={[8, 8, 0, 0]} name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title={t('adminAnalytics.orderStatusBreakdown', { defaultValue: 'Order Status Breakdown' })} subtitle={t('adminAnalytics.orderRatioDesc', { defaultValue: 'Ratio of pending, active, and completed orders.' })}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.orderStatusDistribution || []} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label>
                {(data.orderStatusDistribution || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title={t('adminAnalytics.farmerRegistrations', { defaultValue: 'Farmer & FPO Registrations' })} subtitle={t('adminAnalytics.registrationVelocityDesc', { defaultValue: 'Registration velocity over time.' })}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.farmerRegistrations || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4e8" />
              <XAxis dataKey="_id" tick={{ fontSize: 12, fill: '#001e2b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#001e2b' }} />
              <Tooltip contentStyle={{ backgroundColor: '#001e2b', color: '#fff', borderRadius: '16px', border: 'none' }} />
              <Line type="monotone" dataKey="count" stroke="#00ed64" strokeWidth={3} name="Registrations" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title={t('adminAnalytics.categoryListingVolume', { defaultValue: 'Category Listing Volume' })} subtitle={t('adminAnalytics.categoryListingsDesc', { defaultValue: 'Number of active listings per produce category.' })}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.categoryStats || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4e8" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#001e2b' }} />
              <YAxis type="category" dataKey="_id" tickFormatter={(v) => translateCategory(t, v)} tick={{ fontSize: 12, fill: '#001e2b' }} width={90} />
              <Tooltip contentStyle={{ backgroundColor: '#001e2b', color: '#fff', borderRadius: '16px', border: 'none' }} />
              <Bar dataKey="count" fill="#00684a" radius={[0, 8, 8, 0]} name="Listings" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
