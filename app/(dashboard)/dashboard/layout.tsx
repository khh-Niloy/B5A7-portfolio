import { SidebarDemo } from "@/components/modules/Dashboard/Sidebar";
import Protect from "@/components/Protect";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-screen">
      <Protect>
      <SidebarDemo>{children}</SidebarDemo>
      </Protect>
    </main>
  );
}
