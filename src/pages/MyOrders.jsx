import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { ClipboardList, Loader2, X } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { toast } from "@/components/ui/use-toast";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  const load = () => {
    base44.entities.Order.filter({ created_by_id: user.id }, "-created_date", 200)
      .then(setOrders)
      .catch(() => setOrders([]));
  };

  useEffect(() => {
    load();
    const unsub = base44.entities.Order.subscribe(() => load());
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const cancel = async (order) => {
    setCancelling(order.id);
    try {
      await base44.entities.Order.update(order.id, { status: "cancelled" });
      toast({ title: "Order cancelled" });
      load();
    } catch (err) {
      toast({ title: "Could not cancel", description: err.message, variant: "destructive" });
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your current and past orders.</p>
      </div>

      {orders === null ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card">
          <EmptyState icon={ClipboardList} title="No orders yet" description="Your order history will appear here." />
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const id = o.id.slice(-6).toUpperCase();
            return (
              <div key={o.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">#{id}</span>
                      <StatusBadge status={o.status} />
                      {o.tableNo && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border">
                          {o.tableNo}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(o.created_date)}</p>
                  </div>
                  <span className="font-bold text-foreground">{formatCurrency(o.totalPrice)}</span>
                </div>

                <div className="mt-3 divide-y divide-border border-t border-border">
                  {o.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 text-sm">
                      <span className="text-foreground">{it.quantity}× {it.name}</span>
                      <span className="text-muted-foreground">{formatCurrency(it.price * it.quantity)}</span>
                    </div>
                  ))}
                </div>

                {o.status === "pending" && (
                  <div className="mt-3 flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => cancel(o)} disabled={cancelling === o.id}>
                      {cancelling === o.id ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <X className="w-4 h-4 mr-1.5" />}
                      Cancel order
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}