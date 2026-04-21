import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import AdminAuth from './components/admin/AdminAuth';
import AdminLayout from './components/layout/AdminLayout';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageRecipes from './pages/admin/ManageRecipes';
import OrdersTracker from './pages/admin/OrdersTracker';

// Main layout wrapper
function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Admin routes wrapper with auth protection
function AdminRoutes() {
  return (
    <AdminAuth>
      <AdminLayout />
    </AdminAuth>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Main app routes with Header/Footer */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="recipes/:id" element={<RecipeDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="profile" element={<Profile />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="checkout" element={<Checkout />} />
          </Route>

          {/* Admin login - separate layout */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin routes with auth protection and custom layout */}
          <Route path="/admin" element={<AdminRoutes />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="recipes" element={<ManageRecipes />} />
            <Route path="orders" element={<OrdersTracker />} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
