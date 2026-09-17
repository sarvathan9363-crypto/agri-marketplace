import { Outlet, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import PageContainer from '../components/ui/PageContainer';

export default function DashboardLayout({ loading, isAuthorized, links, portalLabel, sidebarOpen, setSidebarOpen }) {
  if (loading) return null;
  if (!isAuthorized) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-[#F7F9F3] text-[#082B36]">
      <Navbar />
      <div className="flex">
        <Sidebar links={links} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="min-w-0 flex-1">
          <div className="flex items-center justify-between border-b border-[#E2E8E5] bg-[#002B36] px-4 py-3 text-white lg:hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00E676]">{portalLabel}</span>
            <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 hover:bg-[#003947]" aria-label="Open navigation menu">
              <Menu className="h-5 w-5 text-white" />
            </button>
          </div>
          <PageContainer className="py-6 sm:py-8 lg:py-10">
            <Outlet />
          </PageContainer>
        </main>
      </div>
    </div>
  );
}
