import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  Shield, 
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Plus,
  Zap,
  Target,
  Award,
  Globe,
  Briefcase,
  Heart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useData } from '@/contexts/DataContext';
import GetQuoteModal from './GetQuoteModal';

// Simple Progress component
const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={`w-full bg-gray-200 rounded-full ${className}`}>
    <div
      className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-in-out"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    ></div>
  </div>
);

const EnhancedDashboardHome = () => {
  const { user } = useAuth();
  const { currentRole, roleConfig } = useUserRole();
  const { 
    clients, 
    policies, 
    carPolicies, 
    bikePolicies, 
    lifePolicies, 
    travelPolicies,
    employeeHealthPolicies,
    corporatePolicies,
    quoteLeads,
    getUserServices
  } = useData();

  const [activeMetric, setActiveMetric] = useState('overview');

  // Calculate statistics based on role
  const getStatistics = () => {
    if (currentRole === 'user') {
      const userServices = getUserServices(user?.id || '');
      const userPolicyCount = [
        ...policies.filter(p => p.clientName === user?.name),
        ...carPolicies.filter(p => p.clientName === user?.name),
        ...bikePolicies.filter(p => p.clientName === user?.name),
        ...lifePolicies.filter(p => p.clientName === user?.name),
        ...travelPolicies.filter(p => p.clientName === user?.name)
      ].length;

      return {
        totalPolicies: userPolicyCount,
        activeServices: userServices.filter(s => s.status === 'active').length,
        pendingRequests: userServices.filter(s => s.status === 'requested').length,
        totalCoverage: 2500000 // Mock data
      };
    }

    // Admin/Agent statistics
    const totalPolicies = policies.length + carPolicies.length + bikePolicies.length + 
                         lifePolicies.length + travelPolicies.length + employeeHealthPolicies.length + 
                         corporatePolicies.length;
    
    const newLeads = quoteLeads.filter(l => l.status === 'new').length;
    const activeClients = clients.length;
    const totalPremium = [...policies, ...carPolicies, ...bikePolicies, ...lifePolicies, ...travelPolicies]
                        .reduce((sum, policy) => sum + (policy.premium || 0), 0);

    return {
      totalPolicies,
      activeClients,
      newLeads,
      totalPremium,
      conversionRate: quoteLeads.length > 0 ? Math.round((quoteLeads.filter(l => l.status === 'converted').length / quoteLeads.length) * 100) : 0,
      monthlyGrowth: 12.5 // Mock data
    };
  };

  const stats = getStatistics();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-PK').format(num);
  };

  if (currentRole === 'user') {
    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 rounded-2xl text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {getGreeting()}, {user?.name}! 👋
                </h1>
                <p className="text-blue-100 text-lg mb-4">
                  Welcome to your personal insurance dashboard
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <span className="text-sm">Fully Protected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm">Account Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    <span className="text-sm">Quick Access</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-2">
                  <span className="text-3xl font-bold">{user?.name?.charAt(0)}</span>
                </div>
                <Badge className="bg-white/20 text-white border-white/30">
                  Premium Member
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">My Policies</p>
                  <p className="text-3xl font-bold text-blue-700">{stats.totalPolicies}</p>
                  <p className="text-blue-600 text-xs mt-1">Active Coverage</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Active Services</p>
                  <p className="text-3xl font-bold text-green-700">{stats.activeServices}</p>
                  <p className="text-green-600 text-xs mt-1">Running Services</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Pending Requests</p>
                  <p className="text-3xl font-bold text-yellow-700">{stats.pendingRequests}</p>
                  <p className="text-yellow-600 text-xs mt-1">Awaiting Approval</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Total Coverage</p>
                  <p className="text-2xl font-bold text-purple-700">{formatCurrency(stats.totalCoverage)}</p>
                  <p className="text-purple-600 text-xs mt-1">Protection Value</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Get started with our most popular services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <GetQuoteModal>
                <Button className="h-20 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex-col gap-2">
                  <Plus className="h-6 w-6" />
                  <span>Request New Quote</span>
                </Button>
              </GetQuoteModal>
              
              <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-green-50">
                <Eye className="h-6 w-6 text-green-600" />
                <span>View My Policies</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-purple-50">
                <Heart className="h-6 w-6 text-purple-600" />
                <span>File a Claim</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin/Agent Dashboard
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 p-8 rounded-2xl text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {getGreeting()}, {user?.name}! 🚀
              </h1>
              <p className="text-blue-100 text-lg mb-4">
                {roleConfig.title} Dashboard - {roleConfig.description}
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <span className="text-sm">System Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">All Services Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span className="text-sm">Performance Excellent</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-2">
                <span className="text-3xl font-bold">{user?.name?.charAt(0)}</span>
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                {roleConfig.title}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setActiveMetric('policies')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Policies</p>
                <p className="text-3xl font-bold text-blue-700">{stats.totalPolicies}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-green-600 text-xs">+12% this month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setActiveMetric('clients')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Active Clients</p>
                <p className="text-3xl font-bold text-green-700">{formatNumber(stats.activeClients)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-green-600 text-xs">+8% this month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setActiveMetric('leads')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">New Leads</p>
                <p className="text-3xl font-bold text-yellow-700">{stats.newLeads}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-green-600 text-xs">+15% this week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setActiveMetric('revenue')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Monthly Premium</p>
                <p className="text-2xl font-bold text-purple-700">{formatCurrency(stats.totalPremium)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-green-600 text-xs">+{stats.monthlyGrowth}%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setActiveMetric('conversion')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 text-sm font-medium">Conversion Rate</p>
                <p className="text-3xl font-bold text-indigo-700">{stats.conversionRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-green-600 text-xs">+3% this month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setActiveMetric('performance')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-600 text-sm font-medium">Performance</p>
                <p className="text-3xl font-bold text-cyan-700">98.5%</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-green-600 text-xs">Excellent</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Overview
            </CardTitle>
            <CardDescription>Key metrics and trends for this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Monthly Target Achievement</span>
                  <span className="font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Customer Satisfaction</span>
                  <span className="font-medium">94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Claims Processing Efficiency</span>
                  <span className="font-medium">96%</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Lead Conversion Rate</span>
                  <span className="font-medium">{stats.conversionRate}%</span>
                </div>
                <Progress value={stats.conversionRate} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Upcoming tasks and appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-8 bg-blue-500 rounded"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Team Meeting</p>
                  <p className="text-xs text-muted-foreground">10:00 AM - 11:00 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-8 bg-green-500 rounded"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Client Review</p>
                  <p className="text-xs text-muted-foreground">2:00 PM - 3:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-2 h-8 bg-yellow-500 rounded"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Policy Assessment</p>
                  <p className="text-xs text-muted-foreground">4:00 PM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedDashboardHome;
