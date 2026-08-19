import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  ClipboardList,
  UtensilsCrossed,
  Star,
  ArrowRight,
  Loader2,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { items, totalItems, totalPrice } = useCart();
  const [orders, setOrders] = useState(null);
  const [foods, setFoods] = useState([]);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    Promise.all([
      base44.entities.Order.filter({ created_by_id: user.id }, "-created_date", 5),
      base44.entities.Food.list("-created_date", 4),
      base44.entities.Food.list("-updated_date", 8),
    ])
      .then(([o, f, p]) => {
        setOrders(o);
        setFoods(f);
        setPopular(p);
      })
      .catch(() => {
        setOrders([]);
      });
  }, [user.id]);

  const totalOrders = orders?.length ?? 0;
  const todays = (orders || []).filter((o) => {
    const d = new Date(o.created_date);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const firstName = user?.fullName?.split(" ")[0] || user?.email?.split("@")[0] || "Student";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-sm">
        <h1 className="text-2xl font-bold">Hello, {firstName} 👋</h1>
        <p className="text-primary-foreground/80 mt-1">Hungry? Your campus café is ready to serve you.</p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-white/15 backdrop-blur hover:bg-white/25 text-sm font-medium transition-colors"
        >
          Browse the menu <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ClipboardList} label="Total Orders" value={orders === null ? "—" : totalOrders} accent="primary" />
        <StatCard icon={ShoppingBag} label="Today's Orders" value={orders === null ? "—" : todays} accent="blue" />
        <StatCard icon={UtensilsCrossed} label="Menu Items" value={foods.length} accent="emerald" />
        <StatCard icon={ShoppingCart} label="Cart Items" value={totalItems} accent="amber" />
      </div>

      {/* Cart summary */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Cart Summary</p>
            <p className="text-sm text-muted-foreground">
              {totalItems > 0 ? `${totalItems} item${totalItems > 1 ? "s" : ""} · ${formatCurrency(totalPrice)}` : "Your cart is empty"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/menu">
            <Button variant="outline" size="sm">Browse menu</Button>
          </Link>
          {totalItems > 0 && (
            <Link to="/checkout">
              <Button size="sm">
                Checkout <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Today's special */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" /> Today's Special
          </h2>
          <Link to="/menu" className="text-sm text-primary font-medium hover:underline">View all</Link>
        </div>
        {foods.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {foods.map((f) => (
              <Link to="/menu" key={f.id} className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="h-24 bg-muted overflow-hidden">
                  {f.image && <img src={f.image} alt={f.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm text-foreground truncate">{f.name}</p>
                  <p className="text-primary font-bold text-sm mt-0.5">{formatCurrency(f.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Popular foods */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Popular Foods
          </h2>
          <Link to="/menu" className="text-sm text-primary font-medium hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {popular.slice(0, 4).map((f) => (
            <Link to="/menu" key={f.id} className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="h-24 bg-muted overflow-hidden">
                {f.image && <img src={f.image} alt={f.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
              </div>
              <div className="p-3">
                <p className="font-medium text-sm text-foreground truncate">{f.name}</p>
                <p className="text-primary font-bold text-sm mt-0.5">{formatCurrency(f.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
          <Link to="/orders" className="text-sm text-primary font-medium hover:underline">View all</Link>
        </div>
        {orders === null ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card">
            <EmptyState icon={ClipboardList} title="No orders yet" description="Place your first order from the menu." action={<Link to="/menu" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">Browse menu <ArrowRight className="w-4 h-4" /></Link>} />
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card divide-y divide-border">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between p-4">
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {o.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDate(o.created_date)}</p>
                </div>
                <div className="flex items-center gap-4 pl-3">
                  <span className="font-semibold text-foreground">{formatCurrency(o.totalPrice)}</span>
                  <StatusBadge status={o.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}