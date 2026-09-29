import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import {
  TrendingUp,
  ShoppingBag,
  Info,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, StatsCard, LoadingState, StatusBadge } from '../../components/ui/Components';
import Button from '../../components/ui/Button';
import { Select } from '../../components/ui/Input';
import mlService from '../../services/mlService';
import toast from 'react-hot-toast';

export default function MarketInsights() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('price'); // 'price' | 'demand' | 'metrics'
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Options from ML backend
  const [options, setOptions] = useState({
    commodities: ['Tomato', 'Onion', 'Potato', 'Paddy', 'Wheat', 'Banana', 'Brinjal'],
    states: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Punjab', 'Gujarat', 'Uttar Pradesh'],
    markets: ['Mettupalayam', 'Coimbatore', 'Pune', 'Nashik', 'Karnal'],
    locations: ['Coimbatore', 'Pune', 'Nashik', 'Karnal', 'Bengaluru', 'Indore'],
    priceMetrics: {},
    demandMetrics: {},
    priceBaseline: {},
    demandBaseline: {},
    demandDataSource: 'Demo/Bootstrap',
    isBootstrap: true,
  });

  // Price prediction state
  const [priceForm, setPriceForm] = useState({
    commodity: 'Tomato',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    market: 'Mettupalayam',
    horizonDays: 7,
  });
  const [priceResult, setPriceResult] = useState(null);

  // Demand forecast state
  const [demandForm, setDemandForm] = useState({
    product: 'Tomato',
    location: 'Coimbatore',
    horizonDays: 7,
  });
  const [demandResult, setDemandResult] = useState(null);

  useEffect(() => {
    fetchOptionsAndInitialData();
  }, []);

  const fetchOptionsAndInitialData = async () => {
    try {
      const opts = await mlService.getMLOptions();
      if (opts.success) {
        setOptions(opts);
        if (opts.commodities?.length > 0) {
          setPriceForm((prev) => ({
            ...prev,
            commodity: opts.commodities.includes('Tomato') ? 'Tomato' : opts.commodities[0],
            state: opts.states?.[0] || 'Tamil Nadu',
            market: opts.markets?.[0] || 'Mettupalayam',
          }));
        }
        if (opts.products?.length > 0) {
          setDemandForm((prev) => ({
            ...prev,
            product: opts.products.includes('Tomato') ? 'Tomato' : opts.products[0],
            location: opts.locations?.[0] || 'Coimbatore',
          }));
        }
      }

      // Initial predictions
      const [initPrice, initDemand] = await Promise.all([
        mlService.predictPrice({
          commodity: 'Tomato',
          state: 'Tamil Nadu',
          district: 'Coimbatore',
          market: 'Mettupalayam',
          horizonDays: 7,
        }).catch(() => null),
        mlService.forecastDemand({
          product: 'Tomato',
          location: 'Coimbatore',
          horizonDays: 7,
        }).catch(() => null),
      ]);

      if (initPrice?.success) setPriceResult(initPrice);
      if (initDemand?.success) setDemandResult(initDemand);
    } catch {
      toast.error('Could not load ML service metadata.');
    } finally {
      setInitialLoading(false);
    }
  };

  const handlePredictPrice = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await mlService.predictPrice(priceForm);
      if (res.success) {
        setPriceResult(res);
        toast.success(`Price prediction updated for ${res.commodity}!`);
      } else {
        toast.error(res.message || 'Prediction failed.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Price prediction service error.');
    } finally {
      setLoading(false);
    }
  };

  const handleForecastDemand = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await mlService.forecastDemand(demandForm);
      if (res.success) {
        setDemandResult(res);
        toast.success(`Demand forecast updated for ${res.product}!`);
      } else {
        toast.error(res.message || 'Forecast failed.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Demand forecasting service error.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <LoadingState message="Connecting to AgriBazaar ML Engine..." />;

  // Chart data formatting for Price
  const priceChartData = [];
  if (priceResult) {
    (priceResult.historicalSeries || []).forEach((item) => {
      priceChartData.push({
        date: item.date,
        'Historical Mandi Price': item.price,
        'Predicted Price': null,
      });
    });
    (priceResult.forecastSeries || []).forEach((item) => {
      priceChartData.push({
        date: item.date,
        'Historical Mandi Price': null,
        'Predicted Price': item.predictedPrice,
      });
    });
  }

  // Chart data formatting for Demand
  const demandChartData = [];
  if (demandResult) {
    (demandResult.historicalSeries || []).forEach((item) => {
      demandChartData.push({
        date: item.date,
        'Historical Daily Demand': item.demand,
        'Forecast Demand': null,
      });
    });
    (demandResult.forecastSeries || []).forEach((item) => {
      demandChartData.push({
        date: item.date,
        'Historical Daily Demand': null,
        'Forecast Demand': item.predictedDemand,
      });
    });
  }

  const priceDiff = priceResult
    ? priceResult.predictedPrice - priceResult.currentPrice
    : 0;
  const pricePct = priceResult && priceResult.currentPrice
    ? ((priceDiff / priceResult.currentPrice) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">
            {t('marketInsights.aiEngineTag', 'AI & Machine Learning Engine')}
          </span>
          <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">
            {t('marketInsights.title', 'Market Price & Demand Intelligence')}
          </h1>
          <p className="text-sm text-gray-600 mt-1 font-sans">
            {t('marketInsights.subtitle', 'Data-driven price prediction and regional demand forecasting trained with XGBoost on Indian agricultural markets.')}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-[#f0f4e8] dark:bg-[#001e2b]/80 p-1.5 rounded-2xl border border-[#e8eddb] dark:border-[#00684a]/30">
          <button
            onClick={() => setActiveTab('price')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold font-display transition-all ${
              activeTab === 'price'
                ? 'bg-[#001e2b] text-[#00ed64] shadow-md'
                : 'text-gray-800 dark:text-gray-200 hover:text-[#001e2b] dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> {t('marketInsights.pricePrediction', 'Price Prediction')}
          </button>
          <button
            onClick={() => setActiveTab('demand')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold font-display transition-all ${
              activeTab === 'demand'
                ? 'bg-[#001e2b] text-[#00ed64] shadow-md'
                : 'text-gray-800 dark:text-gray-200 hover:text-[#001e2b] dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> {t('marketInsights.demandForecast', 'Demand Forecast')}
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold font-display transition-all ${
              activeTab === 'metrics'
                ? 'bg-[#001e2b] text-[#00ed64] shadow-md'
                : 'text-gray-800 dark:text-gray-200 hover:text-[#001e2b] dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> {t('marketInsights.modelValidation', 'Model Validation')}
          </button>
        </div>
      </div>

      {/* ==================== TAB 1: PRICE PREDICTION ==================== */}
      {activeTab === 'price' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Controls Card */}
          <Card title={t('marketInsights.priceConfigTitle', 'Price Forecast Configuration')} subtitle={t('marketInsights.priceConfigSubtitle', 'Select your crop, target mandi market, and time horizon.')}>
            <form onSubmit={handlePredictPrice} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <Select
                label={t('marketInsights.cropCommodity', 'Crop / Commodity')}
                value={priceForm.commodity}
                onChange={(e) => setPriceForm({ ...priceForm, commodity: e.target.value })}
                options={(options.commodities || []).map((c) => ({ value: c, label: t(`marketInsights.commodities.${c}`, t(`commodities.${c}`, c)) }))}
              />

              <Select
                label={t('marketInsights.state', 'State')}
                value={priceForm.state}
                onChange={(e) => setPriceForm({ ...priceForm, state: e.target.value })}
                options={(options.states || []).map((s) => ({ value: s, label: t(`marketInsights.states.${s}`, t(`states.${s}`, s)) }))}
              />

              <Select
                label={t('marketInsights.targetMarketMandi', 'Target Market / Mandi')}
                value={priceForm.market}
                onChange={(e) => setPriceForm({ ...priceForm, market: e.target.value })}
                options={(options.markets || []).map((m) => ({ value: m, label: t(`marketInsights.markets.${m}`, t(`markets.${m}`, m)) }))}
              />

              <Select
                label={t('marketInsights.forecastHorizon', 'Forecast Horizon')}
                value={priceForm.horizonDays}
                onChange={(e) => setPriceForm({ ...priceForm, horizonDays: Number(e.target.value) })}
                options={[
                  { value: 7, label: t('marketInsights.sevenDayRecommended', '7-Day Ahead (Recommended)') },
                  { value: 14, label: t('marketInsights.fourteenDayAhead', '14-Day Ahead') },
                  { value: 21, label: t('marketInsights.twentyOneDayAhead', '21-Day Ahead') },
                ]}
              />

              <Button
                variant="primary"
                size="md"
                icon={Sparkles}
                loading={loading}
                type="submit"
                className="w-full"
              >
                {t('marketInsights.predictPriceBtn', 'Predict Price')}
              </Button>
            </form>
          </Card>

          {/* Metrics Row */}
          {priceResult && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                icon={TrendingUp}
                label={t('marketInsights.currentReferencePrice', 'Current Reference Price')}
                value={`₹${priceResult.currentPrice.toLocaleString()}`}
                trend={`${t('marketInsights.perLabel', 'Per')} ${priceResult.unit}`}
                color="blue"
              />

              <StatsCard
                icon={Sparkles}
                label={t('marketInsights.predictedPriceLabel', '{{days}}-Day Predicted Price', { days: priceResult.horizonDays })}
                value={`₹${priceResult.predictedPrice.toLocaleString()}`}
                trend={t('marketInsights.predictedModalValue', 'Predicted Modal Value')}
                color="primary"
              />

              <StatsCard
                icon={priceDiff >= 0 ? ArrowUpRight : ArrowDownRight}
                label={t('marketInsights.expectedTrend', 'Expected Trend')}
                value={`${priceDiff >= 0 ? '+' : ''}${pricePct}%`}
                trend={priceDiff >= 0 ? t('marketInsights.favorablePriceShift', 'Favorable Price Shift') : t('marketInsights.expectedMarketSoftening', 'Expected Market Softening')}
                color={priceDiff >= 0 ? 'emerald' : 'amber'}
              />

              <StatsCard
                icon={Calendar}
                label={t('marketInsights.forecastTargetDate', 'Forecast Target Date')}
                value={priceResult.forecastDate}
                trend={t('marketInsights.xgboostRegression', 'XGBoost Regression')}
                color="purple"
              />
            </div>
          )}

          {/* Price Chart Card */}
          {priceResult && (
            <Card
              title={`${priceResult.commodity} ${t('marketInsights.priceTrajectoryTitle', 'Price Trajectory')} (${priceResult.market || priceResult.location})`}
              subtitle={t('marketInsights.priceTrajectorySubtitle', 'Solid line indicates historical mandi prices. Dashed vibrant line displays the 7-day predicted modal price path.')}
            >
              <div className="h-80 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceChartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f4e8" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#001e2b' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#001e2b' }} domain={['auto', 'auto']} unit="₹" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#001e2b',
                        borderRadius: '16px',
                        border: 'none',
                        color: '#ffffff',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      name={t('marketInsights.historicalMandiPrice', 'Historical Mandi Price')}
                      dataKey="Historical Mandi Price"
                      stroke="#00684a"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#00684a' }}
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      name={t('marketInsights.predictedPriceChart', 'Predicted Price')}
                      dataKey="Predicted Price"
                      stroke="#00ed64"
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      dot={{ r: 5, fill: '#00ed64' }}
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 p-4 bg-[#fafcf8] border border-[#e8eddb] rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-[#00684a] shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 font-sans leading-relaxed">
                  <span className="font-bold text-[#001e2b]">{t('marketInsights.predictiveGuidanceNotice', 'Predictive Guidance Notice:')}</span> {t('marketInsights.predictiveGuidanceText', 'Mandi price forecasts are computed using an XGBoost Regressor trained on chronological market arrival data with time-series lags and rolling statistics. Predictions provide advisory support and do not guarantee market settlement values.')}
                </p>
              </div>
            </Card>
          )}
        </motion.div>
      )}

      {/* ==================== TAB 2: DEMAND FORECASTING ==================== */}
      {activeTab === 'demand' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Controls Card */}
          <Card title={t('marketInsights.demandConfigTitle', 'Demand Forecast Configuration')} subtitle={t('marketInsights.demandConfigSubtitle', 'Select product and distribution hub to forecast buying demand.')}>
            <form onSubmit={handleForecastDemand} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <Select
                label={t('marketInsights.productCrop', 'Product / Crop')}
                value={demandForm.product}
                onChange={(e) => setDemandForm({ ...demandForm, product: e.target.value })}
                options={(options.products || options.commodities || []).map((p) => ({ value: p, label: t(`marketInsights.commodities.${p}`, t(`commodities.${p}`, p)) }))}
              />

              <Select
                label={t('marketInsights.regionalHubLocation', 'Regional Hub / Location')}
                value={demandForm.location}
                onChange={(e) => setDemandForm({ ...demandForm, location: e.target.value })}
                options={(options.locations || []).map((l) => ({ value: l, label: t(`marketInsights.locations.${l}`, t(`locations.${l}`, l)) }))}
              />

              <Select
                label={t('marketInsights.forecastHorizon', 'Forecast Horizon')}
                value={demandForm.horizonDays}
                onChange={(e) => setDemandForm({ ...demandForm, horizonDays: Number(e.target.value) })}
                options={[
                  { value: 7, label: t('marketInsights.sevenDayStandard', '7-Day Ahead (Standard)') },
                  { value: 14, label: t('marketInsights.fourteenDayAhead', '14-Day Ahead') },
                ]}
              />

              <Button
                variant="primary"
                size="md"
                icon={Sparkles}
                loading={loading}
                type="submit"
                className="w-full"
              >
                {t('marketInsights.forecastDemandBtn', 'Forecast Demand')}
              </Button>
            </form>
          </Card>

          {/* Metrics Row */}
          {demandResult && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                icon={ShoppingBag}
                label={t('marketInsights.currentDailyDemand', 'Current Daily Demand')}
                value={`${demandResult.currentDemand} ${demandResult.unit}`}
                trend={t('marketInsights.estimatedVolume', 'Estimated Volume')}
                color="blue"
              />

              <StatsCard
                icon={Sparkles}
                label={t('marketInsights.forecastDemandLabel', '{{days}}-Day Forecast Demand', { days: demandResult.horizonDays })}
                value={`${demandResult.predictedDemand} ${demandResult.unit}`}
                trend={t('marketInsights.predictedQuantity', 'Predicted Quantity')}
                color="primary"
              />

              <StatsCard
                icon={TrendingUp}
                label={t('marketInsights.demandCategory', 'Demand Category')}
                value={demandResult.demandLevel === 'High' ? t('marketInsights.highDemand', 'High') : demandResult.demandLevel === 'Medium' ? t('marketInsights.mediumDemand', 'Medium') : t('marketInsights.lowDemand', 'Low')}
                trend={t('marketInsights.empiricalDistributionQuantile', 'Empirical Distribution Quantile')}
                color={
                  demandResult.demandLevel === 'High'
                    ? 'emerald'
                    : demandResult.demandLevel === 'Medium'
                    ? 'blue'
                    : 'amber'
                }
              />

              <StatsCard
                icon={ShieldCheck}
                label={t('marketInsights.dataSource', 'Data Source')}
                value={demandResult.dataSource}
                trend={demandResult.isBootstrap ? t('marketInsights.bootstrapDemoMode', 'Bootstrap Demo Mode') : t('marketInsights.productionVerified', 'Production Verified')}
                color={demandResult.isBootstrap ? 'amber' : 'emerald'}
              />
            </div>
          )}

          {/* Demand Chart Card */}
          {demandResult && (
            <Card
              title={`${demandResult.product} ${t('marketInsights.demandTrajectoryTitle', 'Demand Volume Trajectory')} (${demandResult.location})`}
              subtitle={t('marketInsights.demandTrajectorySubtitle', 'Solid line indicates historical demand. Dashed line projects predicted purchasing volume for the next 7 days.')}
            >
              <div className="h-80 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={demandChartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f4e8" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#001e2b' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#001e2b' }} domain={['auto', 'auto']} unit=" KG" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#001e2b',
                        borderRadius: '16px',
                        border: 'none',
                        color: '#ffffff',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      name={t('marketInsights.historicalDailyDemand', 'Historical Daily Demand')}
                      dataKey="Historical Daily Demand"
                      stroke="#00684a"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#00684a' }}
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      name={t('marketInsights.forecastDemandChart', 'Forecast Demand')}
                      dataKey="Forecast Demand"
                      stroke="#00ed64"
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      dot={{ r: 5, fill: '#00ed64' }}
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {demandResult.isBootstrap && (
                <div className="mt-6 p-4 bg-[#fffbeb] border border-amber-300 rounded-2xl flex items-start gap-3 shadow-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-900 font-display">{t('marketInsights.bootstrapModeActive', 'Bootstrap Mode Active')}</p>
                    <p className="text-xs text-amber-700 mt-0.5 font-sans leading-relaxed">
                      {t('marketInsights.bootstrapModeText', 'AgriBazaar currently has insufficient completed order volume in MongoDB (minimum 30 days required). This pipeline is operating in clearly labelled Demo/Bootstrap mode and will automatically transition to live AgriBazaar Order data as buyer orders are completed.')}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          )}
        </motion.div>
      )}

      {/* ==================== TAB 3: MODEL METRICS & TRANSPARENCY ==================== */}
      {activeTab === 'metrics' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Price Model Card */}
            <Card title={t('marketInsights.priceModelTitle', 'Agricultural Price Prediction Model')} subtitle={t('marketInsights.priceModelSubtitle', 'XGBoost Regressor evaluated chronologically on out-of-time test data.')}>
              <div className="space-y-4 text-sm font-sans">
                <div className="flex items-center justify-between pb-3 border-b border-[#f0f4e8]">
                  <span className="text-gray-600">{t('marketInsights.modelArchitecture', 'Model Architecture')}</span>
                  <span className="font-bold text-[#001e2b] font-display">{t('marketInsights.xgboostRegressor', 'XGBoost Regressor')}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[#f0f4e8]">
                  <span className="text-gray-600">{t('marketInsights.evaluationStrategy', 'Evaluation Strategy')}</span>
                  <span className="font-bold text-[#001e2b] font-display">{t('marketInsights.chronologicalSplit', 'Chronological Split (70/15/15)')}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[#f0f4e8]">
                  <span className="text-gray-600">{t('marketInsights.forecastHorizon', 'Forecast Horizon')}</span>
                  <span className="font-bold text-[#001e2b] font-display">{t('marketInsights.sevenDayModalPrice', '7-Day Ahead Modal Price')}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[#f0f4e8]">
                  <span className="text-gray-600">{t('marketInsights.mae', 'Mean Absolute Error (MAE)')}</span>
                  <span className="font-extrabold text-[#00684a] font-display">
                    ₹{options.priceMetrics?.mae ?? '191.90'} / Quintal
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[#f0f4e8]">
                  <span className="text-gray-600">{t('marketInsights.mape', 'Mean Absolute % Error (MAPE)')}</span>
                  <span className="font-extrabold text-[#00684a] font-display">
                    {options.priceMetrics?.mape ?? '5.73'}%
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[#f0f4e8]">
                  <span className="text-gray-600">{t('marketInsights.rmse', 'Root Mean Squared Error (RMSE)')}</span>
                  <span className="font-bold text-[#001e2b] font-display">
                    ₹{options.priceMetrics?.rmse ?? '471.38'}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[#f0f4e8]">
                  <span className="text-gray-600">{t('marketInsights.r2', 'Coefficient of Determination (R²)')}</span>
                  <span className="font-extrabold text-[#00684a] font-display">
                    {options.priceMetrics?.r2 ?? '0.9862'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('marketInsights.baselineMaePrice', 'Baseline MAE (7-Day Rolling)')}</span>
                  <span className="font-bold text-gray-500 font-display">
                    ₹{options.priceBaseline?.mae ?? '238.28'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Demand Model Card */}
            <Card title={t('marketInsights.demandModelTitle', 'Agricultural Demand Forecasting Model')} subtitle={t('marketInsights.demandModelSubtitle', 'XGBoost Regressor evaluated chronologically on out-of-time test data.')}>
              <div className="space-y-4 text-sm font-sans">
                <div className="flex items-center justify-between pb-3 border-b border-[#f0f4e8]">
                  <span className="text-gray-600">{t('marketInsights.modelArchitecture', 'Model Architecture')}</span>
                  <span className="font-bold text-[#001e2b] font-display">{t('marketInsights.xgboostRegressor', 'XGBoost Regressor')}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[#f0f4e8]">
                  <span className="text-gray-600">{t('marketInsights.evaluationStrategy', 'Evaluation Strategy')}</span>
                  <span className="font-bold text-[#001e2b] font-display">{t('marketInsights.chronologicalSplit', 'Chronological Split (70/15/15)')}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[#f0f4e8]">
                  <span className="text-gray-600">{t('marketInsights.forecastHorizon', 'Forecast Horizon')}</span>
                  <span className="font-bold text-[#001e2b] font-display">{t('marketInsights.sevenDayDemandKg', '7-Day Ahead Demand (KG)')}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[#f0f4e8]">
                  <span className="text-gray-600">{t('marketInsights.mae', 'Mean Absolute Error (MAE)')}</span>
                  <span className="font-extrabold text-[#00684a] font-display">
                    {options.demandMetrics?.mae ?? '66.90'} KG
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[#f0f4e8]">
                  <span className="text-gray-600">{t('marketInsights.mape', 'Mean Absolute % Error (MAPE)')}</span>
                  <span className="font-extrabold text-[#00684a] font-display">
                    {options.demandMetrics?.mape ?? '11.79'}%
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[#f0f4e8]">
                  <span className="text-gray-600">{t('marketInsights.rmse', 'Root Mean Squared Error (RMSE)')}</span>
                  <span className="font-bold text-[#001e2b] font-display">
                    {options.demandMetrics?.rmse ?? '107.86'} KG
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[#f0f4e8]">
                  <span className="text-gray-600">{t('marketInsights.r2', 'Coefficient of Determination (R²)')}</span>
                  <span className="font-extrabold text-[#00684a] font-display">
                    {options.demandMetrics?.r2 ?? '0.9529'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{t('marketInsights.baselineMaeDemand', 'Baseline MAE (Prev Week / 7-Day Rolling)')}</span>
                  <span className="font-bold text-gray-500 font-display">
                    {options.demandBaseline?.mae ?? '96.04'} KG
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
}
