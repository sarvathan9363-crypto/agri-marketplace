import { useState, useEffect } from 'react';
import { ShieldCheck, ExternalLink, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function BlockchainAuditBadge({ entityType, entityId, initialAuditData = null, compact = false }) {
  const { t } = useTranslation();
  const [audit, setAudit] = useState(initialAuditData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialAuditData) {
      setAudit(initialAuditData);
      setLoading(false);
      return;
    }

    // Only fetch if entityId is a valid 66-character keccak256 eventIdHash (starts with 0x)
    if (entityId && typeof entityId === 'string' && entityId.startsWith('0x') && entityId.length === 66) {
      let isMounted = true;
      setLoading(true);
      const fetchAudit = async () => {
        try {
          const res = await fetch(`/api/blockchain/audit/${entityId}`);
          const data = await res.json();
          if (isMounted && data.success && data.verified) {
            setAudit(data);
          }
        } catch (err) {
          // Silent fallback if network/endpoint unavailable
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      fetchAudit();
      return () => { isMounted = false; };
    }
  }, [entityId, initialAuditData]);

  if (loading) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-700 font-medium animate-pulse">
        <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
        {t('blockchain.checking')}
      </div>
    );
  }

  if (!audit || !audit.verified || !audit.transactionHash) {
    return null; // Only display badge when actual verified backend blockchain status exists
  }

  const shortTx = `${audit.transactionHash.slice(0, 6)}...${audit.transactionHash.slice(-4)}`;

  if (compact) {
    return (
      <a
        href={audit.explorerUrl || `https://explorer.testnet.kava.io/tx/${audit.transactionHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-900/10 text-emerald-700 text-[10px] font-bold hover:bg-emerald-900/20 transition-colors"
        title={`${t('blockchain.verifiedOn')} ${audit.network || t('blockchain.testnet')}: ${audit.transactionHash}`}
      >
        <ShieldCheck className="w-3 h-3 text-emerald-600" />
        <span>{t('blockchain.audit')}: {shortTx}</span>
        <ExternalLink className="w-2.5 h-2.5 text-emerald-500" />
      </a>
    );
  }

  return (
    <div className="p-3 bg-gradient-to-r from-emerald-950/90 to-teal-950/90 rounded-xl border border-emerald-500/30 text-emerald-100 shadow-sm font-sans text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-emerald-300">
              <span>{t('blockchain.confirmed')}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[11px] text-emerald-400/80 font-mono">
              {t('blockchain.network')}: {audit.network || t('blockchain.testnet')} (Chain ID: {audit.chainId || 2221})
            </div>
          </div>
        </div>

        <a
          href={audit.explorerUrl || `https://explorer.testnet.kava.io/tx/${audit.transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 rounded-lg text-xs font-semibold transition-all"
        >
          <span>{t('blockchain.transaction')}: {shortTx}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
