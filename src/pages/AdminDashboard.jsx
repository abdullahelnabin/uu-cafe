import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import StatCard from "@/components/StatCard";
import { UtensilsCrossed, ClipboardList, Clock, CheckCircle2, DollarSign, ShoppingBag, Loader2, BellRing } from "lucide-react";
import { formatCurrency } from "@/lib/format";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([base44.entities.Food.list("-created_date", 500), base44.entities.Order.list("-created_date", 500)])
      .then(([foods, orders]) => {
        const now = new Date();
        const todayOrders = orders.filter((o) => new Date(o.created_date).toDateString() === now.toDateString());
        const revenue = todayOrders
          .filter((o) => o.status !== "cancelled")
          .reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);
        setStats({
          foods: foods.length,
          totalOrders: orders.length,
          pending: orders.filter((o) => o.status === "pending").length,
          ready: orders.filter((o) => o.status === "ready").length,
          completed: orders.filter((o) => o.status === "completed").length,
          revenue,
          todayOrders: todayOrders.length,
        });
      })
      .catch(() => setStats({}));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of café operations.</p>
      </div>

      {stats === null ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={UtensilsCrossed} label="Total Food Items" value={stats.foods ?? 0} accent="emerald" />
          <StatCard icon={ClipboardList} label="Total Orders" value={stats.totalOrders ?? 0} accent="primary" />
          <StatCard icon={Clock} label="Pending Orders" value={stats.pending ?? 0} accent="amber" />
          <StatCard icon={BellRing} label="Ready Orders" value={stats.ready ?? 0} accent="emerald" />
          <StatCard icon={CheckCircle2} label="Completed Orders" value={stats.completed ?? 0} accent="blue" />
          <StatCard icon={DollarSign} label="Today's Revenue" value={formatCurrency(stats.revenue ?? 0)} accent="emerald" />
          <StatCard icon={ShoppingBag} label="Today's Orders" value={stats.todayOrders ?? 0} accent="violet" />
        </div>
      )}
    </div>
  );
}