import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Database, RefreshCw, ExternalLink, ShieldCheck, CheckCircle2, XCircle, Search, Layers, Coins, UserCheck, User, Tractor, Mail, Phone, X } from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

export default function AdminBlockchainAudit() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    network: 'Kava EVM Testnet',
    chainId: 2221,
    contractAddress: '0xa6fc0D929B7AefBE8A290bC5baCFbD499CA0DdB5',
    explorerBaseUrl: 'https://explorer.testnet.kava.io',
    paymentEvents: [],
    settlementEvents: [],
    totalPaymentEvents: 0,
    totalSettlementEvents: 0,
  });

  const [activeTab, setActiveTab] = useState('payments'); // 'payments' | 'settlements'
  const [verifyHashInput, setVerifyHashInput] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // Account Hash Lookup Modal State
  const [accountModal, setAccountModal] = useState({ open: false, loading: false, data: null });
  const [accountSearchInput, setAccountSearchInput] = useState('');

  const fetchBlockchainData = async () => {
    setLoading(true);
    try {
      const res = await adminService.getBlockchainAuditEvents();
      if (res && res.success) {
        setData(res);
        toast.success(`Fetched ${res.paymentEvents?.length || 0} payment and ${res.settlementEvents?.length || 0} settlement events from Kava EVM!`);
      } else {
        toast.error('Failed to query smart contract audit events.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error communicating with blockchain RPC node.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockchainData();
  }, []);

  const handleVerifyHash = async (e) => {
    e.preventDefault();
    if (!verifyHashInput.trim()) return;
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await adminService.verifyBlockchainHash(verifyHashInput.trim());
      setVerifyResult(res);
    } catch (err) {
      setVerifyResult({ verified: false, message: err.response?.data?.message || 'Verification check failed.' });
    } finally {
      setVerifying(false);
    }
  };

  const handleLookupAccount = async (targetHash) => {
    const hashToQuery = targetHash || accountSearchInput;
    if (!hashToQuery || hashToQuery.trim().length < 5) {
      toast.error('Please enter a valid Account Hash.');
      return;
    }
    setAccountModal({ open: true, loading: true, data: null });
    try {
      const res = await adminService.lookupAccountByHash(hashToQuery.trim());
      setAccountModal({ open: true, loading: false, data: res });
    } catch (err) {
      setAccountModal({
        open: true,
        loading: false,
        data: { matched: false, message: err.response?.data?.message || 'Account lookup failed.' },
      });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00684a]" /> {t('blockchain.directSmartContractRpcQuery', { defaultValue: 'Direct Smart Contract RPC Query' })}
          </span>
          <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2 flex items-center gap-3">
            {t('blockchain.blockchainAuditTrail', { defaultValue: 'Blockchain Audit Trail' })}
          </h1>
          <p className="text-sm text-gray-600 mt-1 font-sans">
            {t('blockchain.immutableAuditRecordsDesc', { defaultValue: 'Immutable, append-only payment & settlement audit records fetched directly from Kava EVM Testnet smart contract without database dependency.' })}
          </p>
        </div>

        <button
          onClick={fetchBlockchainData}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-[#00684a] text-white hover:bg-[#004f38] transition-all shadow-md hover:shadow-lg disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? t('blockchain.fetchingOnChainData', { defaultValue: 'Fetching On-Chain Data...' }) : t('blockchain.fetchOnChainData', { defaultValue: 'Fetch On-Chain Data' })}
        </button>
      </div>

      {/* Contract & Network Info Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('blockchain.blockchainNetwork')}</span>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900 font-display">{data.network}</span>
            <span className="text-xs font-mono font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">ID: {data.chainId}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('blockchain.smartContractAddress')}</span>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-gray-800" title={data.contractAddress}>
              {data.contractAddress ? `${data.contractAddress.slice(0, 8)}...${data.contractAddress.slice(-6)}` : 'N/A'}
            </span>
            <a
              href={`${data.explorerBaseUrl || 'https://explorer.testnet.kava.io'}/address/${data.contractAddress}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#00684a] hover:text-[#004f38] p-1 rounded-md hover:bg-emerald-50 transition-colors"
              title="Open in Kava Explorer"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('blockchain.onchainPaymentAudits')}</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-emerald-700 font-display">{data.totalPaymentEvents}</span>
            <Coins className="w-6 h-6 text-emerald-500 opacity-60" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('blockchain.onchainSettlementAudits')}</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-purple-700 font-display">{data.totalSettlementEvents}</span>
            <Layers className="w-6 h-6 text-purple-500 opacity-60" />
          </div>
        </div>
      </div>

      {/* Account Hash Lookup Tool & Verification Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tool 1: Live Event ID Hash Verification */}
        <div className="bg-gradient-to-r from-[#001e2b] to-[#003846] p-6 rounded-2xl text-white shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest font-display">
            <Search className="w-4 h-4" /> {t('blockchain.verifyEventIdHashOnChain', { defaultValue: 'VERIFY EVENT ID HASH ON-CHAIN' })}
          </div>
          <h3 className="text-lg font-bold">{t('blockchain.smartContractEventVerifier')}</h3>
          <form onSubmit={handleVerifyHash} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder={t('blockchain.placeholderEventHash', { defaultValue: 'Paste Event ID Hash (e.g. 0xd8273e6f...)' })}
              value={verifyHashInput}
              onChange={(e) => setVerifyHashInput(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00ed64]"
            />
            <button
              type="submit"
              disabled={verifying || !verifyHashInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#00ed64] hover:bg-[#00c954] text-[#001e2b] font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
            >
              {verifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : t('common.verify', { defaultValue: 'Verify' })}
            </button>
          </form>

          {verifyResult && (
            <div className={`p-4 rounded-xl border text-sm flex items-start gap-3 mt-3 ${
              verifyResult.verified ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200' : 'bg-red-950/60 border-red-500/50 text-red-200'
            }`}>
              {verifyResult.verified ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 font-sans w-full">
                <div className="font-bold flex items-center justify-between">
                  <span>Status: {verifyResult.status || (verifyResult.verified ? 'CONFIRMED' : 'UNRECORDED')}</span>
                </div>
                {verifyResult.event ? (
                  <div className="font-mono text-xs space-y-3 mt-3 bg-black/60 p-4 rounded-xl border border-white/10 overflow-hidden shadow-inner">
                    {/* Items Purchased Header */}
                    <div className="text-emerald-300 font-bold font-sans text-sm pb-2.5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">📦</span>
                        <div>
                          <span className="text-gray-400 text-xs block">{t('blockchain.itemsPurchased')}</span>
                          <span className="text-white font-bold">{verifyResult.event.itemsSummary || 'Agricultural Produce'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400 text-xs block font-sans">{t('blockchain.totalAmount')}</span>
                        <span className="text-emerald-400 font-display font-extrabold text-lg">₹{verifyResult.event.amountRupees || (verifyResult.event.amountPaise / 100).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-1 text-gray-300">
                      {/* Payment ID Hash */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-white/5 p-2.5 rounded-lg border border-white/5">
                        <span className="text-gray-400 font-sans text-xs font-semibold shrink-0">{t('blockchain.paymentIdHash')}</span>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-mono text-[11px] text-gray-200 truncate" title={verifyResult.event.paymentIdHash}>
                            {verifyResult.event.paymentIdHash}
                          </span>
                          <button
                            onClick={() => copyToClipboard(verifyResult.event.paymentIdHash)}
                            className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 shrink-0"
                            title="Copy Hash"
                          >
                            📋
                          </button>
                        </div>
                      </div>

                      {/* Order ID Hash */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-white/5 p-2.5 rounded-lg border border-white/5">
                        <span className="text-gray-400 font-sans text-xs font-semibold shrink-0">{t('blockchain.orderIdHash')}</span>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-mono text-[11px] text-gray-200 truncate" title={verifyResult.event.orderIdHash}>
                            {verifyResult.event.orderIdHash}
                          </span>
                          <button
                            onClick={() => copyToClipboard(verifyResult.event.orderIdHash)}
                            className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 shrink-0"
                            title="Copy Hash"
                          >
                            📋
                          </button>
                        </div>
                      </div>

                      {/* Buyer ID Hash Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-blue-950/50 border border-blue-500/30 p-3 rounded-xl">
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <span className="text-blue-300 font-sans font-bold text-xs block">👤 Buyer Cryptographic Account Hash:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[11px] text-blue-100 truncate block max-w-[220px] sm:max-w-xs" title={verifyResult.event.buyerIdHash}>
                              {verifyResult.event.buyerIdHash}
                            </span>
                            <button
                              onClick={() => copyToClipboard(verifyResult.event.buyerIdHash)}
                              className="text-blue-300 hover:text-white p-0.5 shrink-0"
                              title="Copy Buyer Hash"
                            >
                              📋
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => handleLookupAccount(verifyResult.event.buyerIdHash)}
                          className="px-3.5 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-sans font-bold shadow-md transition-all shrink-0 flex items-center justify-center gap-1.5 mt-1 sm:mt-0"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          Lookup Buyer Identity
                        </button>
                      </div>

                      {/* Seller ID Hashes & Split Breakdown Card */}
                      <div className="flex flex-col gap-2.5 bg-amber-950/50 border border-amber-500/30 p-3 rounded-xl">
                        <span className="text-amber-300 font-sans font-bold text-xs block">🌾 Per-Seller Items & Payout Splits:</span>
                        {verifyResult.event.sellerSplits && verifyResult.event.sellerSplits.length > 0 ? (
                          verifyResult.event.sellerSplits.map((split, sIdx) => (
                            <div key={sIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-black/50 p-3 rounded-xl border border-amber-500/20">
                              <div className="space-y-1 min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-[11px] text-amber-100 truncate block max-w-[200px] sm:max-w-xs" title={split.sellerIdHash}>
                                    {split.sellerIdHash}
                                  </span>
                                  <button
                                    onClick={() => copyToClipboard(split.sellerIdHash)}
                                    className="text-amber-300 hover:text-white p-0.5 shrink-0"
                                    title="Copy Seller Hash"
                                  >
                                    📋
                                  </button>
                                </div>
                                {split.sellerItemsSummary && (
                                  <div className="text-[11px] font-sans text-amber-200/90 font-medium">
                                    📦 {split.sellerItemsSummary}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                                <span className="text-amber-400 font-display font-extrabold text-sm">
                                  ₹{split.sellerAmountRupees || (split.sellerAmountPaise / 100).toFixed(2)}
                                </span>
                                <button
                                  onClick={() => handleLookupAccount(split.sellerIdHash)}
                                  className="px-3 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-sans font-bold shadow-md transition-all flex items-center gap-1"
                                >
                                  <Tractor className="w-3.5 h-3.5" />
                                  Lookup Seller
                                </button>
                              </div>
                            </div>
                          ))
                        ) : verifyResult.event.sellerIdHashes && verifyResult.event.sellerIdHashes.length > 0 ? (
                          verifyResult.event.sellerIdHashes.map((sHash, sIdx) => (
                            <div key={sIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-black/40 p-2.5 rounded-lg border border-amber-500/20">
                              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                <span className="font-mono text-[11px] text-amber-100 truncate max-w-[200px] sm:max-w-xs" title={sHash}>
                                  {sHash}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(sHash)}
                                  className="text-amber-300 hover:text-white p-0.5 shrink-0"
                                  title="Copy Seller Hash"
                                >
                                  📋
                                </button>
                              </div>
                              <button
                                onClick={() => handleLookupAccount(sHash)}
                                className="px-3 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-sans font-bold shadow-md transition-all shrink-0 flex items-center justify-center gap-1 mt-1 sm:mt-0"
                              >
                                <Tractor className="w-3.5 h-3.5" />
                                Lookup Seller Identity
                              </button>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-amber-200/60 font-sans italic">{t('blockchain.noSellerSplitHashesRecordedFor')}</span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-400 pt-1 font-sans border-t border-white/10 gap-2">
                        <span>{t('blockchain.amountInPaise')}<strong className="text-gray-200">{verifyResult.event.amountPaise}</strong></span>
                        <span>{t('blockchain.recordedAt')}<strong className="text-gray-200">{new Date(verifyResult.event.recordedAt).toLocaleString()}</strong></span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs opacity-90">{verifyResult.message || 'No audit record found for this hash.'}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tool 2: Buyer & Seller Account Hash Identity Lookup */}
        <div className="bg-gradient-to-r from-[#002b36] to-[#004859] p-6 rounded-2xl text-white shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-widest font-display">
            <UserCheck className="w-4 h-4" /> {t('blockchain.buyerSellerHashLookup', { defaultValue: 'Buyer & Seller Hash Lookup' })}
          </div>
          <h3 className="text-lg font-bold">{t('blockchain.lookupUserIdentityByAccountHash')}</h3>
          <p className="text-xs text-gray-300 font-sans">
            {t('blockchain.pasteHashSubtitle', { defaultValue: 'Paste any Buyer Hash or Seller Hash (0x...) to reveal their full profile, contact info, and verification status.' })}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder={t('blockchain.placeholderAccountHash', { defaultValue: 'Paste Buyer Hash or Seller Hash (0x...)' })}
              value={accountSearchInput}
              onChange={(e) => setAccountSearchInput(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              onClick={() => handleLookupAccount(accountSearchInput)}
              className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#002b36] font-bold text-sm transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <UserCheck className="w-4 h-4" /> {t('blockchain.lookupIdentity', { defaultValue: 'Lookup Identity' })}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs & Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tab Buttons */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-6 py-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'payments'
                ? 'border-[#00684a] text-[#00684a] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Coins className="w-4 h-4" />
            {t('blockchain.paymentAuditsOnChain', { defaultValue: 'Payment Audits On-Chain' })}
            <span className="ml-1.5 text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {data.paymentEvents.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settlements')}
            className={`px-6 py-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'settlements'
                ? 'border-[#00684a] text-[#00684a] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            {t('blockchain.settlementAuditsOnChain', { defaultValue: 'Settlement Audits On-Chain' })}
            <span className="ml-1.5 text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
              {data.settlementEvents.length}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-gray-500 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#00684a]" />
              <p className="font-medium text-sm">{t('blockchain.queryingKavaEvmTestnetSmartContract')}</p>
            </div>
          ) : activeTab === 'payments' ? (
            data.paymentEvents.length === 0 ? (
              <div className="py-16 text-center text-gray-500">
                <Database className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="font-bold text-gray-700">{t('blockchain.noPaymentEventsRecordedOnchainYet')}</p>
                <p className="text-xs text-gray-400 mt-1">{t('blockchain.newPaymentsProcessedThroughRazorpayWill')}</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="text-xs font-extrabold uppercase text-gray-400 border-b border-gray-100 pb-3">
                    <th className="py-3 px-3">{t('blockchain.eventIdHash')}</th>
                    <th className="py-3 px-3">{t('blockchain.itemsPurchased')}</th>
                    <th className="py-3 px-3">{t('blockchain.buyerHashIdentity', { defaultValue: 'Buyer Hash & Identity' })}</th>
                    <th className="py-3 px-3">{t('blockchain.sellerSplitHashes')}</th>
                    <th className="py-3 px-3">{t('blockchain.amountRupees', { defaultValue: 'Amount (₹)' })}</th>
                    <th className="py-3 px-3">{t('blockchain.onchainStatus')}</th>
                    <th className="py-3 px-3">{t('blockchain.recordedAt')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {data.paymentEvents.map((evt, idx) => (
                    <tr key={evt.eventIdHash || idx} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-medium text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <span title={evt.eventIdHash}>{evt.eventIdHash ? `${evt.eventIdHash.slice(0, 10)}...` : 'N/A'}</span>
                          <button
                            onClick={() => copyToClipboard(evt.eventIdHash)}
                            className="text-gray-400 hover:text-gray-700 p-0.5 rounded"
                            title="Copy full hash"
                          >
                            📋
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-bold text-gray-800 font-sans max-w-[220px]">
                        <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-lg inline-block text-xs font-bold">
                          📦 {evt.itemsSummary || 'Agricultural Produce'}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-mono">
                        <button
                          onClick={() => handleLookupAccount(evt.buyerIdHash)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold border border-blue-200 transition-colors text-xs"
                          title="Click to lookup Buyer identity"
                        >
                          <User className="w-3.5 h-3.5 text-blue-600" />
                          <span>{evt.buyerIdHash ? `${evt.buyerIdHash.slice(0, 8)}...` : 'Lookup Buyer'}</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-3 font-mono">
                        <div className="flex flex-col gap-1">
                          {(evt.sellerIdHashes && evt.sellerIdHashes.length > 0 ? evt.sellerIdHashes : [evt.buyerIdHash]).map((sHash, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleLookupAccount(sHash)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-200 transition-colors text-[11px]"
                              title="Click to lookup Seller identity"
                            >
                              <Tractor className="w-3 h-3 text-amber-600" />
                              <span>{sHash ? `${sHash.slice(0, 8)}...` : 'Lookup Seller'}</span>
                            </button>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-bold text-gray-900 font-display text-sm">
                        ₹{evt.amountRupees}
                        <span className="block text-[10px] text-gray-400 font-mono font-normal">({evt.amountPaise} paise)</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                          evt.statusText === 'CAPTURED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : evt.statusText === 'AUTHORIZED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {evt.statusText}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-gray-500 font-sans">
                        {evt.recordedAt ? new Date(evt.recordedAt).toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            data.settlementEvents.length === 0 ? (
              <div className="py-16 text-center text-gray-500">
                <Database className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="font-bold text-gray-700">{t('blockchain.noSettlementEventsRecordedOnchainYet')}</p>
                <p className="text-xs text-gray-400 mt-1">{t('blockchain.farmerMarketplaceSettlementsWillAppearHere')}</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="text-xs font-extrabold uppercase text-gray-400 border-b border-gray-100 pb-3">
                    <th className="py-3 px-3">{t('blockchain.eventIdHash')}</th>
                    <th className="py-3 px-3">{t('blockchain.settlementHash')}</th>
                    <th className="py-3 px-3">{t('blockchain.sellerIdentity')}</th>
                    <th className="py-3 px-3">{t('blockchain.sellerPayoutAmount')}</th>
                    <th className="py-3 px-3">{t('blockchain.status')}</th>
                    <th className="py-3 px-3">{t('blockchain.recordedAt')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {data.settlementEvents.map((evt, idx) => (
                    <tr key={evt.eventIdHash || idx} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-medium text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <span title={evt.eventIdHash}>{evt.eventIdHash ? `${evt.eventIdHash.slice(0, 10)}...` : 'N/A'}</span>
                          <button
                            onClick={() => copyToClipboard(evt.eventIdHash)}
                            className="text-gray-400 hover:text-gray-700 p-0.5 rounded"
                            title="Copy full hash"
                          >
                            📋
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-mono text-gray-500">
                        <span title={evt.settlementIdHash}>{evt.settlementIdHash ? `${evt.settlementIdHash.slice(0, 10)}...` : 'N/A'}</span>
                      </td>

                      <td className="py-3.5 px-3 font-mono">
                        <button
                          onClick={() => handleLookupAccount(evt.sellerIdHash)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-200 transition-colors text-xs"
                          title="Click to lookup Seller identity"
                        >
                          <Tractor className="w-3.5 h-3.5 text-amber-600" />
                          <span>{evt.sellerIdHash ? `${evt.sellerIdHash.slice(0, 8)}...` : 'Lookup Seller'}</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-3 font-bold text-gray-900 font-display text-sm">
                        ₹{evt.sellerAmountRupees}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-purple-100 text-purple-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {evt.statusText}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-gray-500 font-sans">
                        {evt.recordedAt ? new Date(evt.recordedAt).toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>

      {/* Account Identity Modal */}
      {accountModal.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl font-bold">
                  🛡️
                </span>
                <div>
                  <h3 className="text-xl font-extrabold text-[#001e2b] font-display">{t('blockchain.accountIdentityLookup')}</h3>
                  <p className="text-xs text-gray-500 font-sans">{t('blockchain.verifiedDatabaseRecordMatchingOnchainCryptographic')}</p>
                </div>
              </div>
              <button
                onClick={() => setAccountModal({ open: false, loading: false, data: null })}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {accountModal.loading ? (
              <div className="py-12 text-center text-gray-500 space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#00684a]" />
                <p className="font-bold text-sm">{t('blockchain.searchingRegisteredUsersAndFarmers')}</p>
              </div>
            ) : accountModal.data?.matched ? (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-mono text-emerald-900 break-all">
                  <strong>{t('blockchain.onchainHash')}</strong> {accountModal.data.accountHash}
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl space-y-3 font-sans text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">{t('blockchain.accountType')}</span>
                    <span className="font-extrabold font-display uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full text-xs">
                      {accountModal.data.accountType}
                    </span>
                  </div>

                  {accountModal.data.farmer ? (
                    <>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500 flex items-center gap-1.5"><User className="w-4 h-4 text-gray-400" />{t('blockchain.fullName')}</span>
                        <span className="font-bold text-gray-900">{accountModal.data.farmer.fullName}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500 flex items-center gap-1.5"><Tractor className="w-4 h-4 text-gray-400" />{t('blockchain.farmBusiness')}</span>
                        <span className="font-bold text-gray-900">{accountModal.data.farmer.farmName || 'Independent Farmer'}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500 flex items-center gap-1.5"><Mail className="w-4 h-4 text-gray-400" />{t('blockchain.email')}</span>
                        <span className="font-mono text-gray-900">{accountModal.data.farmer.email}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500 flex items-center gap-1.5"><Phone className="w-4 h-4 text-gray-400" />{t('blockchain.mobile')}</span>
                        <span className="font-mono text-gray-900">{accountModal.data.farmer.mobileNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t('blockchain.verificationStatus')}</span>
                        <span className="font-bold text-emerald-700">{accountModal.data.farmer.verificationStatus}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500 flex items-center gap-1.5"><User className="w-4 h-4 text-gray-400" />{t('blockchain.fullName')}</span>
                        <span className="font-bold text-gray-900">{accountModal.data.user?.fullName || accountModal.data.buyer?.businessName}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500 flex items-center gap-1.5"><Mail className="w-4 h-4 text-gray-400" />{t('blockchain.email')}</span>
                        <span className="font-mono text-gray-900">{accountModal.data.user?.email}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500 flex items-center gap-1.5"><Phone className="w-4 h-4 text-gray-400" />{t('blockchain.mobile')}</span>
                        <span className="font-mono text-gray-900">{accountModal.data.user?.mobileNumber}</span>
                      </div>
                      {accountModal.data.buyer?.buyerType && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t('blockchain.buyerType')}</span>
                          <span className="font-bold text-blue-700">{accountModal.data.buyer.buyerType}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-2">
                <XCircle className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="font-bold text-gray-800">{t('blockchain.noAccountFound')}</p>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">{accountModal.data?.message || 'No registered user matches this cryptographic account hash.'}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setAccountModal({ open: false, loading: false, data: null })}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
