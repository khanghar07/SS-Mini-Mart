import { useCart } from "@/context/CartContext";

const CartNotification = () => {
  const { notification, clearNotification } = useCart();

  if (!notification) return null;

  return (
    <div className="fixed right-4 top-20 z-50">
      <button
        type="button"
        onClick={clearNotification}
        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-soft"
      >
        {notification}
      </button>
    </div>
  );
};

export default CartNotification;
