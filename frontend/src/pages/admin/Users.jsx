import { useState, useEffect } from 'react';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Components';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

export default function AdminUsers() {
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
      header: 'User Name',
      key: 'fullName',
      render: (u) => <span className="font-extrabold text-[#001e2b] font-display">{u.fullName}</span>
    },
    { header: 'Email Address', key: 'email' },
    { header: 'Account Role', key: 'role', type: 'status' },
    {
      header: 'Account Status',
      key: 'active',
      render: (u) => (
        <span className={`text-xs font-bold font-display uppercase tracking-wider ${u.active ? 'text-[#00684a]' : 'text-red-600'}`}>
          {u.active ? 'Active' : 'Suspended'}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      headerClassName: 'text-right',
      render: (u) => (
        <div className="text-right">
          <Button
            variant={u.active ? 'danger' : 'primary'}
            size="sm"
            onClick={() => toggleStatus(u._id)}
          >
            {u.active ? 'Suspend Account' : 'Activate Account'}
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[#00684a] font-extrabold text-xs tracking-widest uppercase font-display bg-[#00ed64]/20 px-3 py-1 rounded-full">User Directory</span>
        <h1 className="text-3xl font-black text-[#001e2b] font-display mt-2">Platform User Management</h1>
        <p className="text-sm text-gray-600 mt-1 font-sans">View user roles, access statuses, and activate or suspend accounts.</p>
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
            {r || 'All Roles'}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        emptyTitle="No registered users found"
      />
    </div>
  );
}
