import { Sidebar, BottomNav } from "@/components/dashboard/sidebar";
import { SignalProvider } from "@/contexts/signal-context";
import { SignalToast } from "@/components/dashboard/signal-toast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SignalProvider>
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, overflow: "auto", paddingBottom: "68px" }} className="dash-main">
          {children}
        </main>
        <BottomNav />
        <SignalToast />
      </div>
      <style>{`
        @media (min-width: 769px) { .dash-main { padding-bottom: 0 !important; } }
      `}</style>
    </SignalProvider>
  );
}
