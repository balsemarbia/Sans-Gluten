import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { apiCall } from '@/constants/api';

interface SalesData {
  today: number;
  week: number;
  month: number;
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  ordersGrowth: number;
  revenueGrowth: number;
}

export default function SalesAnalytics() {
  const [salesData, setSalesData] = useState<SalesData>({
    today: 0,
    week: 0,
    month: 0,
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    ordersGrowth: 0,
    revenueGrowth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(false);
      // In a real app, you'd fetch from your analytics API
      // const data = await apiCall('/admin/analytics', 'GET');
      // Mock data for now
      setSalesData({
        today: 1250.500,
        week: 8750.000,
        month: 35000.000,
        totalRevenue: 125000.000,
        totalOrders: 450,
        totalProducts: 120,
        totalUsers: 89,
        ordersGrowth: 15.5,
        revenueGrowth: 22.3
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const stats = [
    {
      title: "Revenu du jour",
      value: `${salesData.today.toFixed(3)} DT`,
      change: salesData.revenueGrowth,
      icon: DollarSign,
      color: "bg-green-500"
    },
    {
      title: "Revenu hebdomadaire",
      value: `${salesData.week.toFixed(3)} DT`,
      change: 12.5,
      icon: TrendingUp,
      color: "bg-blue-500"
    },
    {
      title: "Revenu mensuel",
      value: `${salesData.month.toFixed(3)} DT`,
      change: 8.2,
      icon: ShoppingCart,
      color: "bg-purple-500"
    },
    {
      title: "Total commandes",
      value: salesData.totalOrders,
      change: salesData.ordersGrowth,
      icon: Package,
      color: "bg-orange-500"
    },
    {
      title: "Total clients",
      value: salesData.totalUsers,
      change: 18.7,
      icon: Users,
      color: "bg-indigo-500"
    },
    {
      title: "Total produits",
      value: salesData.totalProducts,
      change: 5.3,
      icon: Package,
      color: "bg-pink-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;

          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-gray-600" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Évolution des revenus</h3>
        <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
          <p className="text-gray-500">Graphique d'évolution (à implémenter avec Chart.js)</p>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Produits populaires</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                  {i}
                </div>
                <div>
                  <p className="font-medium text-gray-900">Produit {i}</p>
                  <p className="text-sm text-gray-500">{100 - i * 15} ventes</p>
                </div>
              </div>
              <p className="font-bold text-primary-600">{(50 - i * 5).toFixed(3)} DT</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
