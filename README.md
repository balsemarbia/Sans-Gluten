# Sans Gluten - E-Commerce Application

A full-stack e-commerce application for gluten-free products, built with React Native (Expo) frontend and Node.js/Express backend.

## Features

### Customer Features
- **User Authentication**: Register, login, and profile management
- **Product Catalog**: Browse and search gluten-free products by category
- **Recipe Collection**: Discover gluten-free recipes with difficulty levels
- **Shopping Cart**: Persistent cart with quantity management
- **Order Management**: Place orders and track order history
- **Favorites**: Save favorite products and recipes
- **User Profile**: View personal info and order history

### Admin Features
- **Dashboard**: View statistics (orders, revenue, users, stock alerts)
- **Product Management**: Create, update, delete products
- **Recipe Management**: Create, update, delete recipes
- **Order Tracking**: View and manage all orders with status updates

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React Native with Expo
- Expo Router for navigation
- AsyncStorage for local data persistence
- Context API for cart state management

## Project Structure

```
Sans-Gluten/
├── backend/
│   ├── models/           # Mongoose models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Recipe.js
│   │   ├── Order.js
│   │   ├── Favorite.js
│   │   └── Address.js
│   ├── routes/           # API routes
│   │   ├── auth.js       # Authentication
│   │   ├── users.js      # User profile
│   │   ├── products.js   # Products CRUD
│   │   ├── recipes.js    # Recipes CRUD
│   │   ├── orders.js     # Orders
│   │   ├── favorites.js  # Favorites
│   │   ├── addresses.js  # Addresses
│   │   └── admin.js      # Admin routes
│   ├── middleware/       # Custom middleware
│   │   └── authMiddleware.js
│   ├── server.js         # Main server file
│   └── .env.example      # Environment variables template
│
└── frontend/
    ├── app/
    │   ├── (tabs)/       # Tab navigation screens
    │   │   ├── home.tsx
    │   │   ├── products.tsx
    │   │   ├── recipes.tsx
    │   │   ├── cart.tsx
    │   │   ├── favorites.tsx
    │   │   └── profile.tsx
    │   ├── product/[id].tsx    # Product details
    │   ├── recipe/[id].tsx     # Recipe details
    │   ├── login.tsx           # Login screen
    │   ├── register.tsx        # Registration screen
    │   ├── admin_dashboard.tsx # Admin dashboard
    │   ├── manage-products.tsx # Product management
    │   ├── manage-recipes.tsx  # Recipe management
    │   ├── orders-tracker.tsx  # Order tracking
    │   └── _layout.tsx         # Root layout with CartProvider
    ├── context/
    │   └── CartContext.tsx     # Cart state management
    ├── constants/
    │   └── api.ts              # API configuration
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas)
- Expo CLI
- Android Studio / Xcode (for mobile development)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/pfe_sans_gluten
JWT_SECRET=your_secret_key_here
```

5. Start the MongoDB server (if using local MongoDB):
```bash
mongod
```

6. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update the API URL in `constants/api.ts` if needed:
```typescript
export const API_BASE_URL = 'http://YOUR_IP:5000/api';
```

4. Start the development server:
```bash
npm start
```

5. Scan the QR code with Expo Go app on your mobile device, or press:
   - `a` for Android emulator
   - `i` for iOS simulator
   - `w` for web browser

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products (with optional search/category filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (auth required)
- `PUT /api/products/:id` - Update product (auth required)
- `DELETE /api/products/:id` - Delete product (auth required)

### Recipes
- `GET /api/recipes` - Get all recipes (with optional search/category filters)
- `GET /api/recipes/:id` - Get recipe by ID
- `POST /api/recipes` - Create recipe (auth required)
- `PUT /api/recipes/:id` - Update recipe (auth required)
- `DELETE /api/recipes/:id` - Delete recipe (auth required)

### Orders
- `POST /api/orders/confirm` - Create new order (auth required)
- `GET /api/orders/my-orders` - Get user's orders (auth required)

### Favorites
- `GET /api/favorites` - Get user's favorites (auth required)
- `POST /api/favorites` - Add to favorites (auth required)
- `DELETE /api/favorites/:id` - Remove from favorites (auth required)

### Addresses
- `GET /api/addresses` - Get user's addresses (auth required)
- `POST /api/addresses` - Create address (auth required)
- `PUT /api/addresses/:id` - Update address (auth required)
- `DELETE /api/addresses/:id` - Delete address (auth required)

### User Profile
- `GET /api/users/profile` - Get user profile (auth required)
- `PUT /api/users/profile` - Update user profile (auth required)
- `PUT /api/users/change-password` - Change password (auth required)

### Admin
- `GET /api/admin/stats` - Get dashboard statistics (auth required)
- `GET /api/admin/orders` - Get all orders (auth required)
- `PUT /api/admin/orders/:id/status` - Update order status (auth required)
- `GET /api/admin/products` - Get all products (auth required)
- `GET /api/admin/recipes` - Get all recipes (auth required)
- `GET /api/admin/users` - Get all users (auth required)

## Default User Categories
- Products: Farines, Pains, Pâtisseries, Snacks, Autres
- Recipes: Petit-déjeuner, Déjeuner, Dîner, Dessert, Snack
- Recipe Difficulty: Facile, Moyen, Difficile
- Order Status: En attente, En préparation, Expédiée, Livré, Annulée

## Testing the Application

1. Register a new user account
2. Browse products and add items to cart
3. Place an order
4. View order history in profile
5. Add products/recipes to favorites
6. Access admin dashboard (currently any logged-in user can access)
7. Manage products and recipes
8. Track and update order statuses

## Future Enhancements
- User roles (admin/customer)
- Payment integration
- Email notifications
- Product reviews and ratings
- Advanced search and filters
- Image upload for products/recipes
- Order tracking with shipping updates
- Wishlist sharing
- Multi-language support

## License
This project is for educational purposes.
