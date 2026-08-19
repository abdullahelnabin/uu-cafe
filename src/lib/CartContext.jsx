import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(null);

  const load = useCallback(() => {
    if (!user?.id) {
      setItems([]);
      return;
    }
    base44.entities.Cart
      .filter({ created_by_id: user.id }, "-created_date", 200)
      .then(setItems)
      .catch(() => setItems([]));
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const removeItem = async (id) => {
    await base44.entities.Cart.delete(id);
    await load();
  };

  const addItem = async (food, quantity = 1) => {
    // Fetch fresh cart state to avoid stale-record races on rapid adds
    const fresh = await base44.entities.Cart.filter(
      { created_by_id: user.id, foodId: food.id },
      "-created_date",
      10
    );
    const existing = fresh[0];
    if (existing) {
      await base44.entities.Cart.update(existing.id, {
        quantity: existing.quantity + quantity,
      });
    } else {
      await base44.entities.Cart.create({
        foodId: food.id,
        name: food.name,
        image: food.image || "",
        unitPrice: food.price,
        quantity,
      });
    }
    await load();
  };

  const updateQty = async (item, quantity) => {
    if (quantity <= 0) {
      await removeItem(item.id);
      return;
    }
    await base44.entities.Cart.update(item.id, { quantity });
    await load();
  };

  const clear = async () => {
    if (!user?.id) return;
    await base44.entities.Cart.deleteMany({ created_by_id: user.id });
    await load();
  };

  const list = items || [];
  const totalItems = list.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = list.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: list,
        loading: items === null,
        addItem,
        updateQty,
        removeItem,
        clear,
        totalItems,
        totalPrice,
        reload: load,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    return {
      items: [],
      loading: false,
      totalItems: 0,
      totalPrice: 0,
      addItem: async () => {},
      updateQty: async () => {},
      removeItem: async () => {},
      clear: async () => {},
    };
  }
  return ctx;
}