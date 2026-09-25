import { StatusBadge, LoadingState, EmptyState } from './Components';
import { useTranslation } from 'react-i18next';

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items to display at this time.',
  keyField = '_id',
  onRowClick,
}) {
  const { t } = useTranslation();
  if (loading) return <LoadingState />;

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle === 'No records found' ? t('ui.noRecords') : emptyTitle} description={emptyDescription === 'There are no items to display at this time.' ? t('ui.noItemsDescription') : emptyDescription} />;
  }

  return (
    <div className="w-full bg-white rounded-3xl border border-[#e8eddb] overflow-hidden shadow-sm">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#001e2b] text-white text-xs font-black uppercase tracking-wider font-display border-b border-emerald-900/40">
              {columns.map((col, idx) => (
                <th key={col.key || idx} className={`py-4 px-5 ${col.headerClassName || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f4e8] text-sm text-[#001e2b] font-sans">
            {data.map((row, rowIdx) => (
              <tr
                key={row[keyField] || rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`hover:bg-[#f9fbef] transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col, colIdx) => (
                  <td key={col.key || colIdx} className={`py-4 px-5 ${col.cellClassName || ''}`}>
                    {col.render ? (
                      col.render(row, rowIdx)
                    ) : col.type === 'status' ? (
                      <StatusBadge status={row[col.key]} />
                    ) : col.type === 'currency' ? (
                      <span className="font-extrabold font-display">
                        ₹{Number(row[col.key] || 0).toLocaleString()}
                      </span>
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
