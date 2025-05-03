"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, LayoutGrid, Users, PackageOpen, Tag, ChevronLeft, Menu } from "lucide-react";

interface AdminSidebarProps {
  storeId: string;
  storeName: string;
}

export default function AdminSidebar({ storeId, storeName }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  
  const navItems = [
    {
      label: "Dashboard",
      href: `/admin/${storeId}`,
      icon: LayoutGrid,
    },
    {
      label: "Products",
      href: `/admin/${storeId}/products`,
      icon: PackageOpen,
    },
    {
      label: "Categories",
      href: `/admin/${storeId}/categories`,
      icon: Tag,
    },
    {
      label: "Orders",
      href: `/admin/${storeId}/orders`,
      icon: ShoppingBag,
    },
    {
      label: "Customers",
      href: `/admin/${storeId}/customers`,
      icon: Users,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden ${collapsed ? "hidden" : "block"}`} 
        onClick={() => setCollapsed(true)}
      />
      
      {/* Mobile toggle */}
      <button 
        className="fixed top-4 left-4 p-2 rounded-md bg-primary text-white z-50 lg:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu size={20} />
      </button>
      
      {/* Sidebar */}
      <aside 
        className={`bg-card border-r w-64 fixed inset-y-0 left-0 z-40 
                    transform transition-transform duration-200 ease-in-out
                    ${collapsed ? "-translate-x-full" : "translate-x-0"}
                    lg:translate-x-0 lg:static lg:h-screen`}
      >
        <div className="flex flex-col h-full">
          <div className="px-4 py-6 border-b">
            <h2 className="text-xl font-bold truncate">{storeName}</h2>
            <p className="text-sm text-muted-foreground">Admin Dashboard</p>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md transition-colors group
                            ${isActive 
                              ? "bg-primary/10 text-primary" 
                              : "hover:bg-muted text-foreground/80"}`}
                  onClick={() => setCollapsed(true)}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="border-t p-4">
            <Link
              href="/dashboard"
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
