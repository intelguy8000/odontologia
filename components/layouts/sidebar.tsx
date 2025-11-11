"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  Plug,
  UserCog,
  Settings,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ShoppingCart, label: "Ventas", href: "/ventas" },
  { icon: ShoppingBag, label: "Compras & Gastos", href: "/compras" },
  { icon: Package, label: "Inventario", href: "/inventario" },
  { icon: Users, label: "Clientes", href: "/clientes" },
  { icon: TrendingUp, label: "P&G", href: "/pyg" },
  { icon: Plug, label: "Integraciones", href: "/integraciones" },
  { icon: UserCog, label: "Usuarios", href: "/usuarios" },
  { icon: Settings, label: "Configuración", href: "/configuracion" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">CR Dental Studio</h1>
        <p className="text-sm text-gray-500 mt-1">Sistema de Gestión</p>
      </div>
      <nav className="px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
