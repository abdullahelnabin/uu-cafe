import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { Search, Loader2, ClipboardList, Eye } from "lucide-react";
import { formatCurrency, formatDate, STATUS_LABELS } from "@/lib/format";
import { toast } from "@/components/ui/use-toast";

const STATUSES = ["pending", "preparing", "ready", "completed", "cancelled"];

export default function OrderManagement() {
  const [orders, setOrders] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState("pending");
  const [updating, setUpdating] = useState(false);

  const load = () => {
    base44.entities.Order.list("-created_date", 500).then(setOrders).catch(() => setOrders([]));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!orders) return [];
    return orders.filter((o) => {
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      const term = search.toLowerCase();
      const matchSearch =
        (o.studentName || "").toLowerCase().includes(term) ||
        (o.studentNo || "").toLowerCase().includes(term) ||
        o.id.toLowerCase().includes(term) ||
        (o.items || []).some((i) => i.name.toLowerCase().includes(term));
      return matchStatus && matchSearch;
    });
  }, [orders, search, statusFilter]);

  const openDetails = (order) => {
    setSelected(order);
    setNewStatus(order.status);
  };

  const updateStatus = async () => {
    if (!selected) return;
    setUpdating(true);
    try {
      await base44.entities.Order.update(selected.id, { status: newStatus });
      toast({ title: "Order updated", description: `Status set to ${STATUS_LABELS[newStatus]}.` });
      setSelected(null);
      load();
    } catch (err) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Order Management</h1>
        <p className="text-sm text-muted-foreground mt-1">View and update all student orders.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by student, ID, or food..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-11" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-11 sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {orders === null ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card">
          <EmptyState icon={ClipboardList} title="No orders found" description="Orders matching your filters will appear here." />
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Order</th>
                  <th className="text-left font-medium px-4 py-3 hidden sm:table-cell">Student</th>
                  <th className="text-left font-medium px-4 py-3 hidden sm:table-cell">Table</th>
                  <th className="text-left font-medium px-4 py-3 hidden md:table-cell">Items</th>
                  <th className="text-left font-medium px-4 py-3">Total</th>
                  <th className="text-left font-medium px-4 py-3">Status</th>
                  <th className="text-right font-medium px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-accent/40">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">#{o.id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(o.created_date)}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-foreground">{o.studentName || "—"}</p>
                      <p className="text-xs text-muted-foreground">{o.studentNo || ""}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                      {o.tableNo ? o.tableNo : "—"}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground max-w-xs truncate">
                      {(o.items || []).map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{formatCurrency(o.totalPrice)}</td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm" onClick={() => openDetails(o)}>
                        <Eye className="w-4 h-4 mr-1.5" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selected ? `#${selected.id.slice(-6).toUpperCase()} · ${formatDate(selected.created_date)}` : ""}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Student</p>
                  <p className="font-medium text-foreground">{selected.studentName || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Student ID</p>
                  <p className="font-medium text-foreground">{selected.studentNo || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Table No</p>
                  <p className="font-medium text-foreground">{selected.tableNo || "—"}</p>
                </div>
              </div>

              <div className="rounded-lg border border-border divide-y divide-border">
                {selected.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 text-sm">
                    <span className="text-foreground">{it.quantity}× {it.name}</span>
                    <span className="text-muted-foreground">{formatCurrency(it.price * it.quantity)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between p-3 bg-muted/40">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-bold text-foreground">{formatCurrency(selected.totalPrice)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Update Status</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
            <Button onClick={updateStatus} disabled={updating || newStatus === selected?.status}>
              {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}