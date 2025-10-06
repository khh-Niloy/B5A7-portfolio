import { SidebarDemo } from "@/components/modules/Dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-screen">
      <SidebarDemo>{children}</SidebarDemo>
    </main>
  );
}
