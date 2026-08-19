import React from "react";
import { Image as ImageIcon, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";

export default function FoodCard({ food, quantity, onQty, onAddToCart, adding }) {
  const unavailable = food.available === false;
  return (
    <div className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
      <div className="relative h-40 overflow-hidden bg-muted">
        {food.image ? (
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ImageIcon className="w-8 h-8" />
          </div>
        )}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur text-foreground border border-border">
          {food.category}
        </span>
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
            unavailable ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"
          }`}
        >
          {unavailable ? "Out of Stock" : "Available"}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-foreground leading-tight">{food.name}</h3>
        {food.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{food.description}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">{formatCurrency(food.price)}</span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center rounded-lg border border-border">
            <button
              type="button"
              onClick={() => onQty(Math.max(1, quantity - 1))}
              disabled={unavailable || quantity <= 1}
              className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <button
              type="button"
              onClick={() => onQty(quantity + 1)}
              disabled={unavailable}
              className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <Button onClick={onAddToCart} disabled={unavailable || adding} size="sm" className="flex-1">
            <ShoppingCart className="w-4 h-4 mr-1.5" />
            {adding ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}