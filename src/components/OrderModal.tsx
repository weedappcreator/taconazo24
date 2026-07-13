"use client";

import { motion, AnimatePresence } from "motion/react";
import { useCart } from "./CartProvider";
import { useEffect, useRef } from "react";

export function OrderModal() {
  const { items, removeItem, updateQuantity, total, count, isOpen, setOpen } = useCart();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <motion.div
            ref={overlayRef}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            className="relative z-10 w-full max-w-lg rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl max-h-[85vh] flex flex-col"
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-clay/30">
              <h2 className="font-display text-2xl text-soil">Tu Orden</h2>
              <div className="flex items-center gap-3">
                {count > 0 && (
                  <span className="text-xs text-stone font-semibold">{count} items</span>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="h-8 w-8 rounded-full bg-clay/30 flex items-center justify-center text-stone hover:bg-clay/50 transition-colors"
                  aria-label="Cerrar orden"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 scrollbar-hide">
              {items.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-stone text-sm">Tu orden esta vacia</p>
                  <p className="text-stone/60 text-xs mt-1">Agrega items del menu para comenzar</p>
                </div>
              ) : (
                items.map((ci) => (
                  <div key={ci.item.id} className="flex items-center gap-3 py-3 border-b border-clay/20 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-soil truncate">{ci.item.name}</p>
                      <p className="text-xs text-stone">${ci.item.price} c/u</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(ci.item.id, ci.quantity - 1)}
                        className="h-7 w-7 rounded-full border border-clay/40 flex items-center justify-center text-stone hover:bg-clay/20 transition-colors text-sm"
                        aria-label="Disminuir cantidad"
                      >−</button>
                      <span className="w-6 text-center text-sm font-bold text-soil">{ci.quantity}</span>
                      <button
                        onClick={() => updateQuantity(ci.item.id, ci.quantity + 1)}
                        className="h-7 w-7 rounded-full bg-neon flex items-center justify-center text-white hover:opacity-90 transition-opacity text-sm"
                        aria-label="Aumentar cantidad"
                      >+</button>
                    </div>
                    <div className="text-right min-w-[60px]">
                      <p className="text-sm font-bold text-soil">${ci.item.price * ci.quantity}</p>
                      <button
                        onClick={() => removeItem(ci.item.id)}
                        className="text-[10px] text-stone/50 hover:text-salsa transition-colors"
                      >Eliminar</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-clay/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone">Subtotal</span>
                  <span className="text-sm font-bold text-soil">${total}</span>
                </div>
                <button
                  className="w-full rounded-full bg-neon py-3.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
                  onClick={() => {
                    const msg = items.map((ci) => `${ci.item.name} x${ci.quantity} = $${ci.item.price * ci.quantity}`).join("\n");
                    const whatsappUrl = `https://wa.me/18091234567?text=${encodeURIComponent(`Hola! Quiero ordenar:\n${msg}\n\nTotal: $${total}`)}`;
                    window.open(whatsappUrl, "_blank");
                    setOpen(false);
                  }}
                >
                  Ordenar por WhatsApp — ${total}
                </button>
                <p className="text-[10px] text-center text-stone/50">Te contactaremos en minutos para confirmar</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
