import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface DashboardShellProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function DashboardShell({
  title,
  subtitle,
  actions,
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="pr-64">
        <TopBar title={title} subtitle={subtitle} actions={actions} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
