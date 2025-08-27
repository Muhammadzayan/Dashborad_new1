import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Shield, 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  Calendar,
  Car,
  Bike,
  Heart,
  Plane,
  Building2,
  Activity,
  UserCheck,
  Trophy,
  Star,
  Target,
  ClipboardList
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, Tooltip, Area, AreaChart } from 'recharts';
import { mockPolicies, mockClients } from '@/data/mockData';
import { isExpiringSoon, getDaysUntil, formatDate } from '@/utils/dateUtils';
import NotificationCenter from './NotificationCenter';
import GetQuoteModal from './GetQuoteModal';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/contexts/UserRoleContext';

const DashboardHome = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useAuth();
  const { currentRole, roleConfig } = useUserRole();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Enhanced statistics
  const totalPolicies = mockPolicies.length;
  const totalClients = mockClients.length;
  const activePolicies = mockPolicies.filter(p => p.status === 'Active').length;
  const expiredPolicies = mockPolicies.filter(p => p.status === 'Expired').length;
  const totalPremium = mockPolicies.reduce((sum, p) => sum + p.premium, 0);
  const totalSumAssured = mockPolicies.reduce((sum, p) => sum + p.sumAssured, 0);
  const expiringPolicies = mockPolicies.filter(p => isExpiringSoon(p.maturityDate)).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Client/User Dashboard
  if (currentRole === 'user') {
    const userPolicies = mockPolicies.filter(p => p.clientName === user?.name || p.clientId === user?.id).slice(0, 3);
    const userTotalPremium = userPolicies.reduce((sum, p) => sum + p.premium, 0);
    const userTotalCoverage = userPolicies.reduce((sum, p) => sum + p.sumAssured, 0);
    const userExpiringPolicies = userPolicies.filter(p => isExpiringSoon(p.maturityDate)).length;

    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-8 rounded-xl text-white animate-fade-in relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-700/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-3">Welcome back, {user?.name}!</h2>
                <p className="text-green-100 text-lg">Your Personal Insurance Dashboard</p>
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <span className="text-sm">Total Coverage: {formatCurrency(userTotalCoverage)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    <span className="text-sm">Active Policies: {userPolicies.length}</span>
                  </div>
                  <GetQuoteModal>
                    <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                      Get Additional Coverage
                    </Button>
                  </GetQuoteModal>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-green-100 mb-2">
                  <Clock className="h-5 w-5" />
                  <span>Current Time</span>
                </div>
                <div className="text-2xl font-mono font-bold mb-1">
                  {currentTime.toLocaleTimeString('en-PK')}
                </div>
                <div className="text-green-200">
                  {currentTime.toLocaleDateString('en-PK', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card animate-scale-in hover:shadow-elegant transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Policies</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{userPolicies.length}</div>
              <p className="text-xs text-muted-foreground">Active insurance policies</p>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-scale-in hover:shadow-elegant transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100" style={{animationDelay: '100ms'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Coverage</CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(userTotalCoverage)}</div>
              <p className="text-xs text-muted-foreground">Sum assured amount</p>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-scale-in hover:shadow-elegant transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100" style={{animationDelay: '200ms'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Premium</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(userTotalPremium)}</div>
              <p className="text-xs text-muted-foreground">Total monthly payment</p>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-scale-in hover:shadow-elegant transition-all duration-300 bg-gradient-to-br from-yellow-50 to-yellow-100" style={{animationDelay: '300ms'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <AlertTriangle className={`h-4 w-4 ${userExpiringPolicies > 0 ? 'text-yellow-600 animate-pulse' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${userExpiringPolicies > 0 ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                {userExpiringPolicies}
              </div>
              <p className="text-xs text-muted-foreground">Policies need renewal</p>
            </CardContent>
          </Card>
        </div>

        {/* My Policies */}
        <Card className="shadow-card animate-fade-in">
          <CardHeader>
            <CardTitle>My Active Policies</CardTitle>
            <CardDescription>
              Your current insurance policies and coverage details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userPolicies.map((policy, index) => (
                <div key={policy.id} className="flex items-center space-x-4 p-4 bg-accent rounded-lg animate-slide-up hover:bg-accent/80 transition-colors" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-foreground">
                      {policy.policyNo}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      {policy.policyType} Insurance
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span>Premium: {formatCurrency(policy.premium)}</span>
                      <span>Coverage: {formatCurrency(policy.sumAssured)}</span>
                      <span>Expires: {formatDate(policy.maturityDate)}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge className={policy.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {policy.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin/Agent Dashboard
  const serviceMetrics = [
    {
      name: 'Life Insurance',
      icon: Heart,
      count: mockPolicies.filter(p => p.policyType === 'Life').length,
      premium: mockPolicies.filter(p => p.policyType === 'Life').reduce((sum, p) => sum + p.premium, 0),
      color: '#EF4444',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      growth: '+15%'
    },
    {
      name: 'Health Insurance',
      icon: Activity,
      count: mockPolicies.filter(p => p.policyType === 'Health').length,
      premium: mockPolicies.filter(p => p.policyType === 'Health').reduce((sum, p) => sum + p.premium, 0),
      color: '#10B981',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      growth: '+22%'
    },
    {
      name: 'Car Insurance',
      icon: Car,
      count: 45,
      premium: 2850000,
      color: '#3B82F6',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      growth: '+18%'
    },
    {
      name: 'Travel Insurance',
      icon: Plane,
      count: 28,
      premium: 850000,
      color: '#06B6D4',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600',
      growth: '+30%'
    },
    {
      name: 'Corporate',
      icon: Building2,
      count: 12,
      premium: 5500000,
      color: '#6366F1',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      growth: '+12%'
    },
    {
      name: 'Bike Insurance',
      icon: Bike,
      count: 67,
      premium: 980000,
      color: '#059669',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      growth: '+25%'
    }
  ];

  // Enhanced chart data
  const policyTypeData = [
    {
      name: 'Life',
      count: mockPolicies.filter(p => p.policyType === 'Life').length,
      value: mockPolicies.filter(p => p.policyType === 'Life').reduce((sum, p) => sum + p.premium, 0),
      color: '#EF4444'
    },
    {
      name: 'Health',
      count: mockPolicies.filter(p => p.policyType === 'Health').length,
      value: mockPolicies.filter(p => p.policyType === 'Health').reduce((sum, p) => sum + p.premium, 0),
      color: '#10B981'
    },
    {
      name: 'Car',
      count: 45,
      value: 2850000,
      color: '#3B82F6'
    },
    {
      name: 'Travel',
      count: 28,
      value: 850000,
      color: '#06B6D4'
    },
    {
      name: 'Corporate',
      count: 12,
      value: 5500000,
      color: '#6366F1'
    },
    {
      name: 'Bike',
      count: 67,
      value: 980000,
      color: '#059669'
    }
  ];

  // Monthly premium data
  const monthlyData = [
    { month: 'Jan', premium: 4800000, policies: 120, claims: 8 },
    { month: 'Feb', premium: 5200000, policies: 135, claims: 12 },
    { month: 'Mar', premium: 6000000, policies: 150, claims: 10 },
    { month: 'Apr', premium: 5800000, policies: 142, claims: 15 },
    { month: 'May', premium: 6500000, policies: 168, claims: 9 },
    { month: 'Jun', premium: totalPremium + 8500000, policies: activePolicies + 152, claims: 11 },
  ];

  // Performance metrics
  const performanceData = [
    { metric: 'Client Satisfaction', value: 94, color: '#10B981', icon: Star },
    { metric: 'Policy Renewal Rate', value: 89, color: '#F59E0B', icon: Trophy },
    { metric: 'Claims Processing', value: 96, color: '#3B82F6', icon: Target },
    { metric: 'Agent Performance', value: 92, color: '#8B5CF6', icon: UserCheck }
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Live Time Header */}
      <div className="bg-gradient-primary p-8 rounded-xl text-white animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-3">Welcome to Agent IGI Life Portal</h2>
              <p className="text-blue-100 text-lg">Comprehensive Insurance Management Dashboard - {roleConfig.title}</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm">Total Coverage: {formatCurrency(totalSumAssured + 45000000)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm">Active Clients: {totalClients + 156}</span>
                </div>
                <GetQuoteModal>
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                    Generate Lead Quote
                  </Button>
                </GetQuoteModal>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-blue-100 mb-2">
                <Clock className="h-5 w-5" />
                <span>Current Time</span>
              </div>
              <div className="text-2xl font-mono font-bold mb-1">
                {currentTime.toLocaleTimeString('en-PK')}
              </div>
              <div className="text-blue-200">
                {currentTime.toLocaleDateString('en-PK', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card animate-scale-in hover:shadow-elegant transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalPolicies + 152}</div>
            <p className="text-xs text-muted-foreground">
              {activePolicies + 142} active • {expiredPolicies + 10} expired
            </p>
            <div className="mt-2 flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600">+18% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card animate-scale-in hover:shadow-elegant transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100" style={{animationDelay: '100ms'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalClients + 156}</div>
            <p className="text-xs text-muted-foreground">Registered clients</p>
            <div className="mt-2 flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600">+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card animate-scale-in hover:shadow-elegant transition-all duration-300 bg-gradient-to-br from-yellow-50 to-yellow-100" style={{animationDelay: '200ms'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Premium</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPremium + 8500000)}</div>
            <p className="text-xs text-muted-foreground">
              Total collection this month
            </p>
            <div className="mt-2 flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600">+24% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card animate-scale-in hover:shadow-elegant transition-all duration-300 bg-gradient-to-br from-red-50 to-red-100" style={{animationDelay: '300ms'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${expiringPolicies > 0 ? 'text-red-600 animate-pulse' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${expiringPolicies > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
              {expiringPolicies + 7}
            </div>
            <p className="text-xs text-muted-foreground">
              Policies expiring in 30 days
            </p>
            {expiringPolicies > 0 && (
              <Badge variant="destructive" className="mt-2 text-xs animate-pulse-glow">
                Requires Attention
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Insurance Services Grid */}
      <div>
        <h3 className="text-xl font-bold mb-4">Insurance Services Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceMetrics.map((service, index) => (
            <Card key={service.name} className={`shadow-card animate-scale-in hover:shadow-elegant transition-all duration-300 ${service.bgColor}`} style={{animationDelay: `${index * 100}ms`}}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{service.name}</CardTitle>
                <service.icon className={`h-5 w-5 ${service.textColor}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${service.textColor}`}>{service.count}</div>
                <p className="text-xs text-muted-foreground mb-2">
                  Premium: {formatCurrency(service.premium)}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={service.textColor}>
                    {service.growth}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    Active policies
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Performance Metrics - Only for Admin */}
      {currentRole === 'admin' && (
        <div>
          <h3 className="text-xl font-bold mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceData.map((item, index) => (
              <Card key={item.metric} className="shadow-card animate-scale-in hover:shadow-elegant transition-all duration-300" style={{animationDelay: `${index * 100}ms`}}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <item.icon className="h-8 w-8" style={{ color: item.color }} />
                    <span className="text-2xl font-bold" style={{ color: item.color }}>
                      {item.value}%
                    </span>
                  </div>
                  <h4 className="font-medium text-sm text-muted-foreground">{item.metric}</h4>
                  <div className="mt-3 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${item.value}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Policy Types Chart */}
        <Card className="shadow-card animate-fade-in">
          <CardHeader>
            <CardTitle>Insurance Services Distribution</CardTitle>
            <CardDescription>
              Policies and premiums across all insurance types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={policyTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'count' ? value : formatCurrency(Number(value)), 
                      name === 'count' ? 'Policies' : 'Premium'
                    ]}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {policyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Monthly Trends */}
        <Card className="shadow-card animate-fade-in">
          <CardHeader>
            <CardTitle>Monthly Performance Trends</CardTitle>
            <CardDescription>
              Premium collection and policy growth over 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'premium' ? formatCurrency(Number(value)) : value,
                    name === 'premium' ? 'Premium' : name === 'policies' ? 'Policies' : 'Claims'
                  ]} />
                  <Area 
                    type="monotone" 
                    dataKey="premium" 
                    stroke="#3B82F6" 
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="policies" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="shadow-card animate-fade-in">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest policy updates and actions across all services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPolicies.slice(0, 5).map((policy, index) => (
                <div key={policy.id} className="flex items-center space-x-4 p-4 bg-accent rounded-lg animate-slide-up hover:bg-accent/80 transition-colors" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {policy.policyNo}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        {policy.clientName} - {policy.policyType}
                      </p>
                      {isExpiringSoon(policy.maturityDate) && (
                        <Badge variant="destructive" className="text-xs animate-pulse">
                          Expiring in {getDaysUntil(policy.maturityDate)} days
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      policy.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {policy.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <NotificationCenter />
      </div>
    </div>
  );
};

export default DashboardHome;
