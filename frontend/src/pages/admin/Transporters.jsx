import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import { TextArea } from '../../components/ui/Input';
import BlockchainAuditBadge from '../../components/common/BlockchainAuditBadge';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import { Truck, ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Eye, X } from 'lucide-react';

export default function AdminTransporters() {
  const { t } = useTranslation();
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTransporters();
  }, [filter]);

  const fetchTransporters = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter) params.verificationStatus = filter;
      const res = await adminService.getTransporters(params);
      setTransporters(res.transporters || []);
    } catch {
      toast.error(t('adminTransporters.failedToLoad', { defaultValue: 'Failed to load transporters.' }));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      setSubmitting(true);
      await adminService.verifyTransporter(id, { status, notes });
      toast.success(t('adminTransporters.statusUpdated', { defaultValue: `Transporter verification updated to ${status}.` }));
      setSelectedTransporter(null);
      setNotes('');
      fetchTransporters();
    } catch {
      toast.error(t('adminTransporters.updateFailed', { defaultValue: 'Failed to update transporter verification.' }));
    } finally {
      setSubmitting(false);
    }
  };

  const statuses = ['', 'UNDER_REVIEW', 'VERIFIED', 'ACTION_REQUIRED', 'REJECTED', 'SUSPENDED'];

  const columns = [
    {
      header: t('adminTransporters.colCompany', { defaultValue: 'TRANSPORTER / COMPANY' }),
      key: 'companyName',
      render: (tr) => (
        <div>
          <p className="font-extrabold text-[#001e2b] font-display">{tr.companyName || 'Logistics Company'}</p>
          <p className="text-xs text-gray-500 font-sans">{tr.contactPerson || tr.transporterIdCode}</p>
        </div>
      ),
    },
    {
      header: t('adminTransporters.colContact', { defaultValue: 'CONTACT INFO' }),
      key: 'contact',
      render: (tr) => (
        <div className="text-xs font-sans">
          <p className="font-bold text-[#001e2b]">{tr.email}</p>
          <p className="text-gray-500">{tr.mobileNumber}</p>
        </div>
      ),
    },
    {
      header: t('adminTransporters.colFleet', { defaultValue: 'FLEET & DRIVERS' }),
      key: 'fleet',
      render: (tr) => (
        <div className="text-xs font-sans">
          <p className="font-bold text-[#00684a]">{tr.vehicles?.length || 0} Vehicle(s)</p>
          <p className="text-gray-500">{tr.drivers?.length || 0} Driver(s)</p>
        </div>
      ),
    },
    {
      header: t('adminTransporters.colVerification', { defaultValue: 'VERIFICATION STATUS' }),
      key: 'verificationStatus',
      type: 'status',
    },
    {
      header: t('adminTransporters.colAudit', { defaultValue: 'AUDIT PROVENANCE' }),
      key: 'audit',
      render: (tr) => <BlockchainAuditBadge entityType="TRANSPORTER" entityId={tr._id} compact={true} />,
    },
    {
      header: t('adminTransporters.colActions', { defaultValue: 'ACTIONS' }),
      key: 'actions',
      headerClassName: 'text-right',
      render: (tr) => (
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" size="sm" onClick={() => setSelectedTransporter(tr)}>
            <Eye className="w-3.5 h-3.5 mr-1" />
            {t('common.review', { defaultValue: 'Review' })}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#001e2b] font-display flex items-center gap-2">
            <Truck className="w-6 h-6 text-[#00684a]" />
            {t('adminTransporters.title', { defaultValue: 'Transporter Verification & Fleet Review' })}
          </h1>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            {t('adminTransporters.subtitle', { defaultValue: 'Review submitted transporter credentials, vehicle RC, licenses, and assign verified status.' })}
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 font-display">{t('common.filter', { defaultValue: 'Filter' })}:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 bg-white border border-[#e8eddb] rounded-xl text-xs font-bold text-[#001e2b]"
          >
            <option value="">{t('common.allStatuses', { defaultValue: 'All Statuses' })}</option>
            {statuses.filter(Boolean).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={transporters}
        loading={loading}
        emptyMessage={t('adminTransporters.noTransporters', { defaultValue: 'No transporters found for review.' })}
      />

      {/* REVIEW & APPROVAL MODAL */}
      {selectedTransporter && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 border border-[#e8eddb] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-[#00684a] bg-[#00ed64]/20 px-2 py-0.5 rounded-md font-display">
                  {selectedTransporter.transporterIdCode || 'TRANSPORTER'}
                </span>
                <h3 className="text-lg font-black text-[#001e2b] font-display mt-1">
                  {selectedTransporter.companyName}
                </h3>
              </div>
              <button onClick={() => setSelectedTransporter(null)} className="text-gray-400 hover:text-gray-600 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Overview */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-[#fafcf8] p-4 rounded-2xl border border-[#e8eddb]">
              <div>
                <p className="text-gray-500 font-semibold">{t('adminTransporters.contactPerson', { defaultValue: 'Contact Person' })}</p>
                <p className="font-bold text-[#001e2b]">{selectedTransporter.contactPerson || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">{t('adminTransporters.mobile', { defaultValue: 'Mobile' })}</p>
                <p className="font-bold text-[#001e2b]">{selectedTransporter.mobileNumber}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">{t('adminTransporters.email', { defaultValue: 'Email' })}</p>
                <p className="font-bold text-[#001e2b]">{selectedTransporter.email}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">{t('adminTransporters.address', { defaultValue: 'Address' })}</p>
                <p className="font-bold text-[#001e2b]">{selectedTransporter.address ? `${selectedTransporter.address}, ${selectedTransporter.state}` : 'N/A'}</p>
              </div>
            </div>

            {/* Vehicles Fleet Breakdown */}
            <div className="space-y-2">
              <h4 className="font-black text-[#001e2b] text-xs uppercase tracking-wider font-display">
                {t('adminTransporters.fleetSection', { defaultValue: 'Fleet Vehicles' })} ({selectedTransporter.vehicles?.length || 0})
              </h4>
              {selectedTransporter.vehicles && selectedTransporter.vehicles.length > 0 ? (
                <div className="space-y-2">
                  {selectedTransporter.vehicles.map((v) => (
                    <div key={v.registrationNumber} className="p-3 bg-gray-50 rounded-xl flex justify-between items-center text-xs font-sans">
                      <div>
                        <span className="font-mono font-bold text-[#001e2b]">{v.registrationNumber}</span>
                        <p className="text-gray-600">{v.vehicleType} · {v.capacityKg} KG</p>
                      </div>
                      {v.rcDocUrl && (
                        <a href={v.rcDocUrl} target="_blank" rel="noreferrer" className="text-[#00684a] font-bold underline">
                          View RC Doc ↗
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 font-sans">{t('adminTransporters.noVehiclesSubmitted', { defaultValue: 'No vehicles submitted.' })}</p>
              )}
            </div>

            {/* Drivers Breakdown */}
            <div className="space-y-2">
              <h4 className="font-black text-[#001e2b] text-xs uppercase tracking-wider font-display">
                {t('adminTransporters.driversSection', { defaultValue: 'Registered Drivers' })} ({selectedTransporter.drivers?.length || 0})
              </h4>
              {selectedTransporter.drivers && selectedTransporter.drivers.length > 0 ? (
                <div className="space-y-2">
                  {selectedTransporter.drivers.map((d) => (
                    <div key={d.licenseNumber} className="p-3 bg-gray-50 rounded-xl flex justify-between items-center text-xs font-sans">
                      <div>
                        <p className="font-bold text-[#001e2b]">{d.driverName}</p>
                        <p className="text-gray-600">Lic: {d.licenseNumber} · Vehicle: {d.assignedVehicleNumber || 'Unassigned'}</p>
                      </div>
                      {d.licenseDocUrl && (
                        <a href={d.licenseDocUrl} target="_blank" rel="noreferrer" className="text-[#00684a] font-bold underline">
                          View License ↗
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 font-sans">{t('adminTransporters.noDriversSubmitted', { defaultValue: 'No drivers submitted.' })}</p>
              )}
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t('adminTransporters.reviewNotes', { defaultValue: 'Admin Review / Rejection Notes' })}
              </label>
              <TextArea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes or reason for rejection/action required..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              <Button
                variant="primary"
                onClick={() => handleUpdateStatus(selectedTransporter._id, 'VERIFIED')}
                disabled={submitting}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                {t('adminTransporters.approveVerified', { defaultValue: 'Approve & Mark Verified' })}
              </Button>

              <Button
                variant="secondary"
                onClick={() => handleUpdateStatus(selectedTransporter._id, 'ACTION_REQUIRED')}
                disabled={submitting}
              >
                <AlertTriangle className="w-4 h-4 mr-1" />
                {t('adminTransporters.requestAction', { defaultValue: 'Request Correction' })}
              </Button>

              <Button
                variant="danger"
                onClick={() => handleUpdateStatus(selectedTransporter._id, 'REJECTED')}
                disabled={submitting}
              >
                <XCircle className="w-4 h-4 mr-1" />
                {t('adminTransporters.reject', { defaultValue: 'Reject Application' })}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
