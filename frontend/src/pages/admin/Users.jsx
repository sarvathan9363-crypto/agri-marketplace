import { useTranslation } from 'react-i18next';
import { translateRole } from '../../utils/enumTranslations';
import { useState, useEffect } from 'react';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Components';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => { fetchUsers(); }, [filter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter) params.role = filter;
      const res = await adminService.getUsers(params);
      setUsers(res.users || []);
    } catch {} finally { setLoading(false); }
  };

  const toggleStatus = async (id) => {
    try {
      await adminService.toggleUserStatus(id);
      toast.success('User status updated.');
      fetchUsers();
    } catch { toast.error('Failed to update status.'); }
  };

  const columns = [
    {
      header: t('adminUsers.colUserName', { defaultValue: 'USER NAME' }),
      key: 'fullName',
      render: (u) => <span className="font-extrabold text-[#001e2b] font-display">{u.fullName}</span>
    },
    { header: t('adminUsers.colEmail', { defaultValue: 'EMAIL ADDRESS' }), key: 'email' },
    {
      header: t('adminUsers.colAccountHash', { defaultValue: 'ON-CHAIN ACCOUNT HASH' }),
      key: 'accountHash',
      render: (u) => (
        <div className="flex items-center gap-1.5 font-mono text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100" title={u.accountHash}>
          <span>{u.accountHash ? `${u.accountHash.slice(0, 10)}...${u.accountHash.slice(-6)}` : 'N/A'}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(u.accountHash);
              toast.success('Account Hash copied!');
            }}
            className="text-gray-400 hover:text-gray-700 p-0.5 rounded"
            title="Copy full hash"
          >
            📋
          </button>
        </div>
      )
    },
    { header: t('adminUsers.colAccountRole', { defaultValue: 'ACCOUNT ROLE' }), key: 'role', type: 'status' },
    {
      header: t('adminUsers.colAccountStatus', { defaultValue: 'ACCOUNT STATUS' }),
      key: 'active',
      render: (u) => (
        <span className={`text-xs font-bold font-display uppercase tracking-wider ${u.active ? 'text-[#00684a]' : 'text-red-600'}`}>
          {u.active ? t('status.active', { defaultValue: 'Active' }) : t('status.suspended', { defaultValue: 'Suspended' })}
        </span>
      )
    },
    {
      header: t('adminUsers.colActions', { defaultValue: 'ACTIONS' }),
      key: 'actions',
      headerClassName: 'text-right',
      render: (u) => (
        <div className="text-right">
          <Button
            variant={u.active ? 'danger' : 'primary'}
            size="sm"
            onClick={() => toggleStatus(u._id)}
          >
            {u.active ? t('adminUsers.suspendAccount', { defaultValue: 'Suspend Account' }) : t('adminUsers.activateAccount', { defaultValue: 'Activate Account' })}
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">{t('admin.userDirectory')}</span>
        <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">{t('admin.platformUserManagement')}</h1>
        <p className="text-sm text-gray-600 mt-1 font-sans">{t('admin.viewUserRolesAccessStatusesAnd')}</p>
      </div>

      <div className="flex gap-2 flex-wrap bg-white p-3 rounded-3xl border border-[#e8eddb] shadow-sm">
        {['', 'FARMER', 'BUYER', 'ADMIN'].map(r => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all font-display ${
              filter === r ? 'bg-[#001e2b] text-[#00ed64]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {r ? translateRole(t, r) : t('adminUsers.allRoles', { defaultValue: 'All Roles' })}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        emptyTitle={t('adminUsers.noRegisteredUsersFound', { defaultValue: 'No registered users found' })}
      />
    </div>
  );
}
