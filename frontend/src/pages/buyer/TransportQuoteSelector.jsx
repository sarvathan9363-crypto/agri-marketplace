import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, Star, ShieldCheck, CheckCircle, ArrowRight, Clock, Award } from 'lucide-react';
import transportService from '../../services/transportService';
import toast from 'react-hot-toast';

export default function TransportQuoteSelector({ requestId, onSelectQuote, onClose }) {
  const { t } = useTranslation();
  const [request, setRequest] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(null);

  useEffect(() => {
    if (requestId) fetchQuotes();
  }, [requestId]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const data = await transportService.getRequestById(requestId);
      setRequest(data.request);
      setQuotations(data.quotations || []);
    } catch {
      toast.error(t('transport.failedToLoadQuotes', { defaultValue: 'Failed to load transport quotations.' }));
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (quote) => {
    try {
      setSelecting(quote._id);
      const res = await transportService.selectQuotation(requestId, quote._id);
      toast.success(t('transport.transporterSelectedSuccess', { defaultValue: 'Transporter quotation selected successfully!' }));
      if (onSelectQuote) onSelectQuote(res.selectedQuotation || quote);
    } catch (err) {
      toast.error(err.response?.data?.message || t('transport.selectFailed', { defaultValue: 'Failed to select quotation.' }));
    } finally {
      setSelecting(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-[#e8eddb]">
        <p className="text-sm font-bold text-gray-500">{t('transport.loadingQuotations', { defaultValue: 'Loading transporter quotations...' })}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-[#e8eddb] p-6 shadow-xl space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between border-b border-[#f0f4e8] pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#00684a] bg-[#00ed64]/20 px-3 py-1 rounded-full font-display">
            {t('transport.quotationComparison', { defaultValue: 'Transporter Quotation Comparison' })}
          </span>
          <h2 className="text-xl font-black text-[#001e2b] font-display mt-2">
            {t('transport.selectTransporter', { defaultValue: 'Select Transporter & Freight Quote' })}
          </h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-xs font-bold text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-xl border border-gray-200">
            ✕ {t('common.close', { defaultValue: 'Close' })}
          </button>
        )}
      </div>

      {quotations.length === 0 ? (
        <div className="text-center py-10 bg-[#fafcf8] rounded-2xl border border-[#e8eddb] p-6">
          <Truck className="w-12 h-12 text-[#00684a] mx-auto mb-3 opacity-60" />
          <p className="text-sm font-bold text-[#001e2b]">{t('transport.noQuotesYet', { defaultValue: 'No transporter quotations received yet.' })}</p>
          <p className="text-xs text-gray-500 mt-1">{t('transport.transportersNotified', { defaultValue: 'Registered transporters in your region have been notified to submit quotes.' })}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quotations.map((q) => {
            const isSelected = request?.selectedQuotationId?._id === q._id || request?.selectedQuotationId === q._id;
            return (
              <div
                key={q._id}
                className={`p-5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-emerald-50/60 border-[#00684a] ring-2 ring-[#00684a]/20'
                    : 'bg-[#fafcf8] border-[#e8eddb] hover:border-[#00684a]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-extrabold text-[#001e2b] font-display">{q.transporterCompany || q.transporterName}</h3>
                      <span className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                        {q.rating || 4.8} ({q.totalDeliveries || 12} {t('transport.deliveries', { defaultValue: 'deliveries' })})
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 font-sans">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-[#00684a]" /> {q.vehicleType} ({q.vehicleNumber})
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-600" /> {t('transport.pickup', { defaultValue: 'Pickup' })}: {q.estimatedPickup}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" /> {t('transport.delivery', { defaultValue: 'Delivery' })}: {q.estimatedDelivery}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-2xl font-black text-[#001e2b] font-display">₹{q.totalQuote}</p>
                    <p className="text-[11px] text-gray-500 font-mono">
                      {t('transport.baseCharge', { defaultValue: 'Base' })}: ₹{q.transportCharge}
                      {(q.loadingCharge + q.unloadingCharge + q.handlingCharge) > 0 && ` + ${t('transport.handling', { defaultValue: 'handling' })} ₹${q.loadingCharge + q.unloadingCharge + q.handlingCharge}`}
                    </p>
                    <button
                      disabled={selecting === q._id || isSelected}
                      onClick={() => handleSelect(q)}
                      className={`mt-2 px-5 py-2 rounded-xl text-xs font-bold font-display transition shadow-sm ${
                        isSelected
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-[#00684a] hover:bg-[#00523a] text-white'
                      }`}
                    >
                      {isSelected
                        ? t('transport.selected', { defaultValue: '✓ Selected' })
                        : selecting === q._id
                        ? t('common.processing', { defaultValue: 'Selecting...' })
                        : t('transport.selectThisQuote', { defaultValue: 'Select Quotation' })}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
