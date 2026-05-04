# 🔧 Image Update Guide

## Problem: Product and Recipe Images Not Loading

The MongoDB Atlas connection from this environment is not working. The images in the database need to be updated with working URLs.

## Solutions

### Option 1: Run This Script When Server Has Database Access

When the backend server can connect to the database (either locally or with Atlas IP whitelisted), run:

```bash
cd backend
node scripts/updateImages.js
```

### Option 2: Update Through Admin Panel

1. Login to admin panel: `http://192.168.1.17:5173/admin/login`
2. Go to Products or Recipes management
3. Edit each item and update the image URL

### Option 3: Use API with Admin Token

```bash
# Get admin token
TOKEN=$(curl -s -X POST http://192.168.1.17:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@balsem.tn","password":"Admin@2026"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Update images via API
curl -X POST http://192.168.1.17:5000/api/utils/update-images \
  -H "x-auth-token: $TOKEN"
```

## Recommended Image URLs

### Products
- Flours: `https://images.unsplash.com/photo-1586496436937-2c1e1e6d0f3c?w=800&q=80`
- Breads: `https://images.unsplash.com/photo-1509440159596-7241a558f172?w=800&q=80`
- Pastries: `https://images.unsplash.com/photo-1558326567-98ae2405596b?w=800&q=80`
- Snacks: `https://images.unsplash.com/photo-1499636136210-6f9eeae975e4?w=800&q=80`

### Recipes
- General: `https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80`
- Salad: `https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80`
- Main dishes: `https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80`
- Dessert: `https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80`

## Quick Fix: MongoDB Atlas IP Whitelist

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Go to Security → Network Access
3. Add your current IP address to whitelist
4. Wait a few minutes for the change to take effect
5. Then run: `node scripts/updateImages.js`

## Alternative: Use Local MongoDB

If Atlas continues to be an issue, switch to local MongoDB:

1. Install MongoDB locally
2. Update `.env`: `MONGODB_URI=mongodb://127.0.0.1:27017/pfe_sans_gluten`
3. Run seed script: `node seed.js`
4. Update images: `node scripts/updateImages.js`
