import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, Loader2, ImageIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const CATEGORIES = ["Breakfast", "Meals", "Snacks", "Beverages", "Desserts"];
const EMPTY = { name: "", category: "Meals", description: "", price: "", image: "", available: true };

export default function FoodFormDialog({ open, onOpenChange, food, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const editing = !!food;

  useEffect(() => {
    setForm(food ? { ...EMPTY, ...food, price: food.price ?? "" } : EMPTY);
  }, [food, open]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image too large", description: "Max 5MB.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      set("image", file_url);
      toast({ title: "Image uploaded" });
    } catch (err) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    const price = Number(form.price);
    if (!price || price <= 0) {
      toast({ title: "Invalid price", description: "Price must be a positive number.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const payload = {
      name: form.name.trim(),
      category: form.category,
      description: form.description?.trim() || "",
      price,
      image: form.image || "",
      available: form.available,
    };
    try {
      if (editing) {
        await base44.entities.Food.update(food.id, payload);
        toast({ title: "Food updated" });
      } else {
        await base44.entities.Food.create(payload);
        toast({ title: "Food added" });
      }
      onSaved?.();
      onOpenChange(false);
    } catch (err) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Food" : "Add Food"}</DialogTitle>
          <DialogDescription>{editing ? "Update the food details." : "Create a new menu item."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Chicken Sandwich" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger id="category"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (৳)</Label>
              <Input id="price" type="number" min="0" step="1" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="220" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} placeholder="Grilled chicken with fresh veggies..." />
          </div>
          <div className="space-y-2">
            <Label>Image</Label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border cursor-pointer hover:bg-accent text-sm text-muted-foreground">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? "Uploading..." : "Upload image"}
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
              {form.image && (
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-border">
                  <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
              {!form.image && <ImageIcon className="w-8 h-8 text-muted-foreground/40" />}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label htmlFor="available" className="cursor-pointer">Available</Label>
              <p className="text-xs text-muted-foreground">Toggle to mark in/out of stock.</p>
            </div>
            <Switch id="available" checked={form.available} onCheckedChange={(v) => set("available", v)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {editing ? "Save changes" : "Add food"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}