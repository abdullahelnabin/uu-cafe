# ☕ UU Cafe

**UU Cafe** is a university café ordering and management web application designed to make campus food ordering faster and easier for students while providing administrators with tools to manage menu items and orders.

🌐 **Live Demo:** https://uucafe.base44.app
💻 **Source Code:** https://github.com/abdullahelnabin/uu-cafe

---

## 📌 About the Project

UU Cafe is a full-stack web application built for a university café environment.

Students can create an account, browse available food items, add products to their cart, select a table, place an order and track its status.

Administrators have a separate dashboard for managing food items and handling student orders.

The project focuses on providing a clean, responsive and easy-to-use experience for both students and café administrators.

---

## ✨ Features

### 👨‍🎓 Student Features

* Student account registration
* Email OTP verification
* Secure login system
* Forgot and reset password flow
* Student dashboard
* Browse café food menu
* View food categories and prices
* Add food items to cart
* Update cart quantities
* Remove items from cart
* Checkout system
* Select café table number
* Cash on Pickup payment option
* Place food orders
* View previous and active orders
* Track order status
* Student profile management

### 👨‍💼 Admin Features

* Role-protected admin dashboard
* View café statistics and order information
* Add new food items
* Edit existing food items
* Delete food items
* Control food availability
* View student orders
* Search orders
* Filter orders by status
* View complete order details
* Update order status

### 📦 Order Status Flow

Orders can move through the following states:

`Pending → Preparing → Ready → Completed`

Orders can also be marked as:

`Cancelled`

---

## 🛠️ Tech Stack

### Frontend

* React 18
* JavaScript
* React Router
* Vite
* Tailwind CSS
* Radix UI
* Lucide React
* TanStack React Query

### Backend & Authentication

* Base44
* Base44 SDK
* Base44 Authentication
* Base44 Entities / Data Models

### Development Tools

* Git
* GitHub
* ESLint
* TypeScript type checking
* npm

---

## 📂 Project Structure

```text
uu-cafe/
│
├── base44/
│   ├── entities/
│   │   ├── Cart.jsonc
│   │   ├── Food.jsonc
│   │   ├── Order.jsonc
│   │   └── User.jsonc
│   └── config.jsonc
│
├── src/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🚀 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/abdullahelnabin/uu-cafe.git
```

### 2. Enter the project folder

```bash
cd uu-cafe
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Vite will display a local development URL in the terminal.

---

## 🧪 Available Scripts

Start development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

Run type checking:

```bash
npm run typecheck
```

Preview production build:

```bash
npm run preview
```

---

## 🔐 Authentication

UU Cafe includes authentication for students and administrators.

Student registration includes email verification using an OTP before the account setup is completed.

Protected routes are used to prevent unauthenticated users from accessing application pages, while administrative pages require an administrator role.

---

## 🗃️ Data Models

The application currently uses four primary data models:

### User

Stores additional student profile information such as:

* Student ID
* Full name
* Department
* Phone number

### Food

Stores café menu information including:

* Food name
* Category
* Description
* Price
* Image
* Availability

### Cart

Stores temporary cart items including:

* Food ID
* Name
* Image
* Unit price
* Quantity

### Order

Stores submitted orders including:

* Ordered items
* Total price
* Student information
* Table number
* Order status

---

## 💳 Payment

The current version supports:

**Cash on Pickup**

Students place their order through the application and pay at the café counter when collecting their food.

Online payment integration can be added in a future version.

---

## 📱 Responsive Design

UU Cafe is designed to work across:

* Desktop computers
* Laptops
* Tablets
* Mobile devices

The interface uses responsive layouts and reusable UI components.

---

## 📸 Screenshots

Project screenshots can be added here.

Recommended screenshots:

1. Login Page
2. Student Dashboard
3. Food Menu
4. Shopping Cart
5. Checkout Page
6. My Orders
7. Admin Dashboard
8. Food Management
9. Order Management

---

## 🔮 Future Improvements

Some possible future improvements include:

* Online payment integration
* Real-time order notifications
* Estimated preparation time
* QR-based table identification
* Order history analytics
* Sales analytics dashboard
* Food ratings and reviews
* Push notifications
* Improved role and database security
* Automated testing
* CI/CD workflow

---

## 🎯 Project Purpose

This project was developed to practice and demonstrate skills in:

* Frontend development
* React application architecture
* Authentication
* Role-based interfaces
* CRUD operations
* Database integration
* State management
* Responsive UI development
* Git and GitHub
* Full-stack application development

---

## 👨‍💻 Author

**Abdullah Elnabin**

GitHub: [@abdullahelnabin](https://github.com/abdullahelnabin)

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

