import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Leaf, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ links, isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky z-30 hidden w-64 shrink-0 flex-col border-r border-[#E2E8E5]/20 bg-[#002B36] text-white shadow-xl lg:flex">
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="px-3 py-1.5 mb-4 flex items-center justify-between">
            <p className="text-[11px] font-bold text-[#00E676] uppercase tracking-widest">Portal Menu</p>
          </div>
          
          <nav className="space-y-1.5">
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#00E676] text-[#002B36] font-bold shadow-sm'
                      : 'text-slate-300 hover:bg-[#003947] hover:text-white'
                  }`
                }
              >
                <link.icon className="w-5 h-5 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Footer in Sidebar */}
        <div className="border-t border-[#E2E8E5]/20 p-4 bg-[#002129]">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 bg-[#00E676] text-[#002B36] rounded-full flex items-center justify-center font-bold text-sm shrink-0">
              {user?.fullName?.[0] || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.fullName}</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/40 transition-colors border border-red-900/30"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-[#002B36] text-white z-50 shadow-2xl flex flex-col justify-between lg:hidden border-r border-[#E2E8E5]/20"
            >
              <div>
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8E5]/20 bg-[#003947]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-[#00E676] text-[#002B36] rounded-full flex items-center justify-center font-bold">
                      <Leaf className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-white">Agri<span className="text-[#00E676]">Bazaar</span></span>
                  </div>
                  <button onClick={onClose} className="p-1.5 hover:bg-[#002B36] text-slate-300 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4">
                  <nav className="space-y-1.5">
                    {links.map(link => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-[#00E676] text-[#002B36] font-bold'
                              : 'text-slate-300 hover:bg-[#003947] hover:text-white'
                          }`
                        }
                      >
                        <link.icon className="w-5 h-5" />
                        <span>{link.label}</span>
                      </NavLink>
                    ))}
                  </nav>
                </div>
              </div>

              <div className="border-t border-[#E2E8E5]/20 p-4 bg-[#002129]">
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/40 transition-colors border border-red-900/30">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
