import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Image as ImageIcon,
  Wallet,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Table2,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { toast } from "@/components/ui/use-toast";

const TABLES = Array.from({ length: 10 }, (_, i) => `Table ${i + 1}`);

export default function Checkout() {
  const { user } = useAuth();
  const { items, totalPrice, totalItems, clear } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [tableNo, setTableNo] = useState("");
  const [tableError, setTableError] = useState(false);

  const placeOrder = async () => {
    if (items.length === 0) {
      toast({ title: "Your cart is empty", description: "Add items before placing an order.", variant: "destructive" });
      return;
    }
    if (!tableNo) {
      setTableError(true);
      toast({ title: "Table number required", description: "Please select your table number before placing the order.", variant: "destructive" });
      return;
    }
    setTableError(false);
    setPlacing(true);
    try {
      const orderItems = items.map((i) => ({
        foodId: i.foodId,
        name: i.name,
        price: i.unitPrice,
        quantity: i.quantity,
      }));
      await base44.entities.Order.create({
        items: orderItems,
        totalPrice: Number(totalPrice.toFixed(2)),
        status: "pending",
        studentName: user?.fullName || user?.email,
        studentNo: user?.studentId || "",
        tableNo,
      });
      await clear();
      toast({
        title: "Your order has been placed successfully",
        description: `Order for ${tableNo} is now being prepared.`,
      });
      navigate("/orders");
    } catch (err) {
      toast({ title: "Order failed", description: err.message, variant: "destructive" });
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0 && !placing) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
          <p className="text-sm text-muted-foreground mt-1">Your cart is empty.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Add items to your cart before checking out.
          </p>
          <Link to="/menu">
            <Button>Browse menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
        <p className="text-sm text-muted-foreground mt-1">Review and confirm your order.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-2xl border border-border bg-card divide-y divide-border">
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-3 p-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0">
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
                  <p className="text-sm text-muted-foreground">
                    {it.quantity} × {formatCurrency(it.unitPrice)}
                  </p>
                </div>
                <span className="font-semibold text-foreground">
                  {formatCurrency(it.unitPrice * it.quantity)}
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Edit cart
          </Link>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h2 className="font-semibold text-foreground">Order Summary</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Items</span>
                <span className="font-medium text-foreground">{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 mt-2">
                <span className="font-semibold text-foreground">Total Price</span>
                <span className="text-xl font-bold text-primary">{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Table2 className="w-4 h-4 text-primary" /> Table Number
            </h2>
            <Select
              value={tableNo}
              onValueChange={(v) => {
                setTableNo(v);
                setTableError(false);
              }}
            >
              <SelectTrigger className={tableError ? "border-destructive h-11" : "h-11"}>
                <SelectValue placeholder="Select your table" />
              </SelectTrigger>
              <SelectContent>
                {TABLES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {tableError && (
              <p className="text-xs text-destructive">Please select your table number before placing the order.</p>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Wallet className="w-4 h-4 text-primary" /> Payment Method
            </h2>
            <div className="mt-3 rounded-xl border-2 border-primary bg-primary/5 p-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm">Cash on Pickup</p>
                <p className="text-xs text-muted-foreground">Pay at the counter when collecting.</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={placeOrder} disabled={placing || !tableNo}>
            {placing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 mr-2" />
            )}
            {placing ? "Placing order..." : "Confirm Order"}
          </Button>
          {!tableNo && (
            <p className="text-xs text-center text-muted-foreground">
              Select a table number to confirm your order.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}