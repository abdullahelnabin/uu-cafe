export const formatCurrency = (value) => {
  const num = Number(value || 0);
  return "৳" + num.toLocaleString(undefined, { maximumFractionDigits: 0 });
};

export const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  preparing: "bg-blue-100 text-blue-700 border-blue-200",
  ready: "bg-emerald-100 text-emerald-700 border-emerald-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-rose-100 text-rose-700 border-rose-200",
};

export const STATUS_LABELS = {
  pending: "Pending",
  preparing: "Preparing",
  ready: "Ready for Pickup",
  completed: "Completed",
  cancelled: "Cancelled",
};