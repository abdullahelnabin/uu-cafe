import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import FoodCard from "@/components/FoodCard";
import EmptyState from "@/components/EmptyState";
import { Input } from "@/components/ui/input";
import { Search, Loader2, UtensilsCrossed } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const CATEGORIES = ["All", "Breakfast", "Meals", "Snacks", "Beverages", "Desserts"];

export default function FoodMenu() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [foods, setFoods] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [qtyMap, setQtyMap] = useState({});
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    base44.entities.Food.list("-created_date", 200).then(setFoods).catch(() => setFoods([]));
  }, []);

  const filtered = useMemo(() => {
    if (!foods) return [];
    return foods.filter((f) => {
      const matchCat = category === "All" || f.category === category;
      const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [foods, search, category]);

  const qty = (id) => qtyMap[id] ?? 1;
  const setQty = (id, v) => setQtyMap((m) => ({ ...m, [id]: v }));

  const addToCart = async (food) => {
    if (food.available === false) return;
    const quantity = qty(food.id);
    if (quantity < 1) {
      toast({ title: "Invalid quantity", description: "Quantity must be at least 1.", variant: "destructive" });
      return;
    }
    setAddingId(food.id);
    try {
      await addItem(food, quantity);
      toast({ title: "Item added to cart successfully", description: `${quantity}× ${food.name} added to your cart.` });
      setQtyMap((m) => ({ ...m, [food.id]: 1 }));
    } catch (err) {
      toast({ title: "Could not add to cart", description: err.message, variant: "destructive" });
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Food Menu</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse, search, and add items to your cart.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search food by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors border ${
                category === c ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {foods === null ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card">
          <EmptyState icon={UtensilsCrossed} title="No food found" description="Try a different search or category." />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              quantity={qty(food.id)}
              onQty={(v) => setQty(food.id, v)}
              onAddToCart={() => addToCart(food)}
              adding={addingId === food.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}