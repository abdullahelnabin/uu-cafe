import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, Pencil, Trash2, Loader2, UtensilsCrossed, ImageOff } from "lucide-react";
import FoodFormDialog from "@/components/FoodFormDialog";
import EmptyState from "@/components/EmptyState";
import { formatCurrency } from "@/lib/format";
import { toast } from "@/components/ui/use-toast";

export default function FoodManagement() {
  const [foods, setFoods] = useState(null);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    base44.entities.Food.list("-created_date", 500).then(setFoods).catch(() => setFoods([]));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!foods) return [];
    return foods.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
  }, [foods, search]);

  const toggleAvailable = async (food) => {
    try {
      await base44.entities.Food.update(food.id, { available: !food.available });
      load();
    } catch (err) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    }
  };

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (food) => {
    setEditing(food);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await base44.entities.Food.delete(deleteTarget.id);
      toast({ title: "Food deleted" });
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Food Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Add, edit, and manage menu items.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Food
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search food by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-11 max-w-sm" />
      </div>

      {foods === null ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card">
          <EmptyState icon={UtensilsCrossed} title="No food items" description="Add your first menu item to get started." action={<Button onClick={openAdd}><Plus className="w-4 h-4 mr-1.5" /> Add Food</Button>} />
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Food</th>
                  <th className="text-left font-medium px-4 py-3 hidden sm:table-cell">Category</th>
                  <th className="text-left font-medium px-4 py-3">Price</th>
                  <th className="text-left font-medium px-4 py-3">Status</th>
                  <th className="text-right font-medium px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((food) => (
                  <tr key={food.id} className="hover:bg-accent/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {food.image ? <img src={food.image} alt={food.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageOff className="w-4 h-4 text-muted-foreground" /></div>}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{food.name}</p>
                          <p className="text-xs text-muted-foreground sm:hidden">{food.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">{food.category}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{formatCurrency(food.price)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleAvailable(food)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                          food.available ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"
                        }`}
                      >
                        {food.available ? "Available" : "Out of Stock"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(food)} className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(food)} className="p-2 rounded-lg hover:bg-rose-50 text-muted-foreground hover:text-rose-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <FoodFormDialog open={dialogOpen} onOpenChange={setDialogOpen} food={editing} onSaved={load} />

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete food item?</DialogTitle>
            <DialogDescription>
              "{deleteTarget?.name}" will be permanently removed from the menu.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}