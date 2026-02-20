# FreshMart Best

Premium mini-mart / supermarket website built with Vite + React + Tailwind.

## Run
```powershell
npm install
npm run dev
```

## Routes
- `/` Home
- `/products` Product listing
- `/product/:id` Product detail
- `/cart` Cart
- `/checkout` Checkout
- `/order-confirmation/:orderId` Confirmation
- `/track-order` Track order
- `/admin` Admin login
- `/admin/dashboard` Admin
- `/admin/products` Admin products
- `/admin/orders` Admin orders
- `/admin/reports` Admin reports

## Notes
- Admin auth uses localStorage key `freshmart-admin` for demo.
- Cart and Orders persist in localStorage.
