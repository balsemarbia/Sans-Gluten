# 🔐 Admin Access Guide

## Dedicated Admin Login System

The admin panel has a **separate login system** specifically for administrators. When navigating to `/admin`, users are redirected to a dedicated admin login page.

### 🌐 Admin Access URLs

| Page | URL |
|------|-----|
| **Admin Login** | `http://192.168.1.17:5173/admin/login` |
| **Admin Dashboard** | `http://192.168.1.17:5173/admin` |
| **Products** | `http://192.168.1.17:5173/admin/products` |
| **Recipes** | `http://192.168.1.17:5173/admin/recipes` |
| **Orders** | `http://192.168.1.17:5173/admin/orders` |

### 📋 Admin Credentials

```
📧 Email:    admin@balsem.tn
🔑 Password: Admin@2026
```

### 🔐 How Admin Login Works

1. **Navigate to Admin Panel**
   - Go to any `/admin/*` URL
   - Automatically redirected to `/admin/login` if not logged in as admin

2. **Admin Login Page**
   - Specialized login interface for administrators
   - Validates admin credentials
   - Checks user role is 'admin'
   - Regular users are denied access

3. **Session Management**
   - Separate admin session flag stored in localStorage
   - Role verification on every admin page load
   - Automatic redirect to admin login if not authorized

### 🛡️ Security Features

| Feature | Description |
|---------|-------------|
| **Role Verification** | Every admin page checks user role via `/api/users/role` |
| **Automatic Redirect** | Non-admin users redirected to admin login |
| **Separate Login UI** | Dedicated admin login page with security styling |
| **Token Validation** | JWT tokens verified on every admin API call |
| **Backend Protection** | All `/api/admin/*` endpoints protected by admin middleware |

### 📊 Admin Dashboard Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Statistics, quick actions, recent orders overview |
| **Products** | Create, edit, delete products with stock management |
| **Recipes** | Create, edit, delete recipes with ingredients |
| **Orders** | Track orders, update status, view shipping details |

### 🔧 Testing Admin Access

#### Test Admin Can Access
```bash
# Login as admin
curl -X POST http://192.168.1.17:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@balsem.tn","password":"Admin@2026"}'

# Should return admin role
curl http://192.168.1.17:5000/api/users/role \
  -H "x-auth-token: <token>"

# Should access admin endpoints
curl http://192.168.1.17:5000/api/admin/stats \
  -H "x-auth-token: <token>"
```

#### Test Regular User Blocked
```bash
# Login as regular user
curl -X POST http://192.168.1.17:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"password"}'

# Should return "user" role
curl http://192.168.1.17:5000/api/users/role \
  -H "x-auth-token: <token>"

# Should be denied
curl http://192.168.1.17:5000/api/admin/stats \
  -H "x-auth-token: <token>"
# Returns: {"message":"Accès refusé. Administration uniquement."}
```

### 🚀 Quick Start

```bash
# 1. Start servers
cd backend && node server.js &
cd frontend && npm run dev &

# 2. Access admin panel
# Open browser: http://192.168.1.17:5173/admin

# 3. Login with admin credentials
# Email: admin@balsem.tn
# Password: Admin@2026
```

### 🔑 Password Management

#### Reset Admin Password
```bash
cd backend
node scripts/resetAdmin.js NewSecurePassword123
```

#### Promote User to Admin
```bash
cd backend
node scripts/setupAdmin.js user@example.com
```

### ⚠️ Important Notes

1. **Separate Login**: Admin login is completely separate from regular user login
2. **Role Required**: Only users with `role: 'admin'` can access admin panel
3. **Auto-Redirect**: Any `/admin/*` URL redirects to login if not authenticated as admin
4. **Session Persistence**: Admin sessions stored with `isAdmin` flag in localStorage
5. **Security**: All admin API endpoints protected by admin middleware on backend

### 🔍 Troubleshooting

**"Accès refusé" error on admin login?**
- Verify email and password are correct
- Check user has `role: 'admin'` in database
- Try clearing browser localStorage

**Redirected to admin login repeatedly?**
- Check browser console for errors
- Verify `/api/users/role` endpoint is accessible
- Ensure JWT token is valid (not expired)

**Admin pages not loading?**
- Verify backend server is running
- Check MongoDB connection is active
- Ensure JWT_SECRET is set in backend/.env

### 📞 Admin Scripts

| Script | Location | Purpose |
|--------|----------|---------|
| **createAdmin.js** | `backend/scripts/` | Create initial admin account |
| **resetAdmin.js** | `backend/scripts/` | Reset admin password |
| **setupAdmin.js** | `backend/scripts/` | Promote existing user to admin |
