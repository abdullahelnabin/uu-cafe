import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/lib/CartContext";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import {
  Image as ImageIcon,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { toast } from "@/components/ui/use-toast";

export default function Cart() {
  const { items, loading, updateQty, removeItem, totalItems, totalPrice } = useCart();

  const handleQty = async (item, delta) => {
    try {
      await updateQty(item, item.quantity + delta);
      toast({ title: "Quantity updated" });
    } catch (err) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    }
  };

  const handleRemove = async (item) => {
    try {
      await removeItem(item.id);
      toast({ title: "Item removed from cart", description: `${item.name} removed.` });
    } catch (err) {
      toast({ title: "Remove failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Cart</h1>
        <p className="text-sm text-muted-foreground mt-1">Review your items before checkout.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Browse the menu and add items to your cart."
            action={
              <Link to="/menu">
                <Button>
                  Browse menu <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((it) => (
              <div
                key={it.id}
                className="rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-sm flex items-center gap-3 sm:gap-4"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  {it.image ? (
                    <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{it.name}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(it.unitPrice)} each</p>
                  <p className="text-sm font-medium text-primary mt-0.5 sm:hidden">
                    {formatCurrency(it.unitPrice * it.quantity)}
                  </p>
                </div>
                <div className="flex items-center rounded-lg border border-border">
                  <button
                    onClick={() => handleQty(it, -1)}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{it.quantity}</span>
                  <button
                    onClick={() => handleQty(it, 1)}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="hidden sm:block font-semibold text-foreground w-24 text-right">
                  {formatCurrency(it.unitPrice * it.quantity)}
                </span>
                <button
                  onClick={() => handleRemove(it)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Total Items</span>
              <span className="font-medium text-foreground">{totalItems}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="font-semibold text-foreground">Total Price</span>
              <span className="text-xl font-bold text-primary">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="mt-4 flex justify-end">
              <Link to="/checkout">
                <Button size="lg">
                  Proceed to Checkout <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}