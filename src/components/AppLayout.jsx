import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { CartProvider, useCart } from "@/lib/CartContext";
import {
  Coffee,
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const studentNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/menu", label: "Food Menu", icon: UtensilsCrossed },
  { to: "/cart", label: "My Cart", icon: ShoppingCart, badge: true },
  { to: "/orders", label: "My Orders", icon: ClipboardList },
  { to: "/profile", label: "Profile", icon: User },
];

const adminNav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/foods", label: "Food Management", icon: UtensilsCrossed },
  { to: "/admin/orders", label: "Order Management", icon: ClipboardList },
];

function CartBadge() {
  const { totalItems } = useCart();
  if (!totalItems) return null;
  return (
    <span className="ml-auto min-w-5 h-5 px-1.5 rounded-full bg-primary-foreground/25 text-primary-foreground text-[11px] font-bold flex items-center justify-center">
      {totalItems}
    </span>
  );
}

export default function AppLayout({ role = "user", requireRole }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (requireRole && user?.role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  const nav = role === "admin" ? adminNav : studentNav;
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    try {
      await base44.auth.logout();
    } catch {
      /* noop */
    }
    toast({ title: "Logout successful", description: "You have been signed out." });
    setTimeout(() => navigate("/login"), 200);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 flex items-center gap-2.5">
        <img src="https://media.base44.com/images/public/6a6998218d51cd310a17b17e/50c25c4d6_header_logo2.png" alt="UU Cafe" className="w-10 h-10 object-contain" />
        <div>
          <p className="font-bold text-foreground leading-tight">UU Cafe</p>
          <p className="text-[11px] text-muted-foreground">{isAdmin ? "Admin Portal" : "Student Portal"}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {nav.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.badge && <CartBadge />}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <div className="px-3 py-2 mb-1">
          <p className="text-sm font-medium text-foreground truncate">{user?.fullName || user?.email}</p>
          <p className="text-xs text-muted-foreground truncate">{isAdmin ? "Administrator" : user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-rose-50 hover:text-rose-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <CartProvider>
      <div className="min-h-screen bg-background flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
          <SidebarContent />
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <aside className="relative w-64 bg-card flex flex-col">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-accent"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </aside>
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-16 border-b border-border bg-card">
            <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-accent">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <img src="https://media.base44.com/images/public/6a6998218d51cd310a17b17e/50c25c4d6_header_logo2.png" alt="UU Cafe" className="w-7 h-7 object-contain" />
              <span className="font-bold">UU Cafe</span>
            </div>
            <Link to="/cart" className="relative p-2 rounded-lg hover:bg-accent">
              <ShoppingCart className="w-5 h-5" />
              <CartBadge />
            </Link>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </CartProvider>
  );
}