import React, { ReactNode, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  Building2,
  Settings,
  Car,
  Bike,
  Heart,
  Shield,
  Briefcase,
  Plane,
  Activity,
  UserCheck,
  Crown,
  ChevronDown,
  Eye,
  Lock,
  User,
  ClipboardList,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange 
}) => {
  const { user, logout, updateUserRole } = useAuth();
  const { currentRole, roleConfig, canAccessService, availableRoles, setUserRole, hasPermission } = useUserRole();

  // Sync role when user changes
  useEffect(() => {
    if (user && user.role !== currentRole) {
      console.log(`Syncing role: user.role=${user.role}, currentRole=${currentRole}`);
      setUserRole(user.role);
    }
  }, [user, currentRole, setUserRole]);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      category: 'main'
    },
    {
      id: currentRole === 'user' ? 'my-policies' : 'policies',
      label: currentRole === 'user' ? 'My Policies' : 'All Policies',
      icon: FileText,
      category: 'main'
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: Users,
      category: 'main',
      requiresPermission: 'canViewAllClients'
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: UserCheck,
      category: 'main',
      requiresPermission: 'canManageUsers'
    },
    {
      id: 'leads-management',
      label: 'Quote Leads',
      icon: ClipboardList,
      category: 'main',
      requiresPermission: 'canViewReports'
    },
    {
      id: 'service-provision',
      label: 'Provide Services',
      icon: Settings,
      category: 'main',
      requiresPermission: 'canCreatePolicies'
    },
  ];

  const insuranceServices = [
    {
      id: 'car-insurance',
      label: 'Car Insurance',
      icon: Car,
      color: 'bg-blue-500',
      description: 'Vehicle protection'
    },
    {
      id: 'car-tracker',
      label: 'Car Tracker',
      icon: Car,
      color: 'bg-purple-500',
      description: 'Vehicle tracking'
    },
    {
      id: 'bike-insurance',
      label: 'Bike Insurance',
      icon: Bike,
      color: 'bg-green-500',
      description: 'Motorcycle coverage'
    },
    {
      id: 'life-insurance',
      label: 'Life Insurance',
      icon: Heart,
      color: 'bg-red-500',
      description: 'Life protection'
    },
    {
      id: 'employee-life',
      label: 'Employee Life',
      icon: UserCheck,
      color: 'bg-orange-500',
      description: 'Staff life coverage'
    },
    {
      id: 'corporate-insurance',
      label: 'Corporate',
      icon: Building2,
      color: 'bg-indigo-500',
      description: 'Business protection'
    },
    {
      id: 'travel-insurance',
      label: 'Travel Insurance',
      icon: Plane,
      color: 'bg-cyan-500',
      description: 'Travel coverage'
    },
    {
      id: 'employee-health',
      label: 'Employee Health',
      icon: Activity,
      color: 'bg-pink-500',
      description: 'Staff health benefits'
    }
  ];

  const userSpecificServices = [
    {
      id: 'my-policies',
      label: 'My Policies',
      icon: ClipboardList,
      color: 'bg-blue-500',
      description: 'Your active policies'
    },
    {
      id: 'services',
      label: 'Browse Services',
      icon: Shield,
      color: 'bg-purple-500',
      description: 'Explore insurance options'
    },
    {
      id: 'claims',
      label: 'Claims',
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      description: 'File and track claims'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      color: 'bg-gray-500',
      description: 'Personal information'
    }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4" />;
      case 'agent': return <UserCheck className="h-4 w-4" />;
      case 'user': return <User className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'agent': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNavigationItems = navigationItems.filter(item => {
    if (item.requiresPermission) {
      return hasPermission(item.requiresPermission as keyof typeof roleConfig.permissions);
    }
    return canAccessService(item.id);
  });

  const availableServices = currentRole === 'user' ? userSpecificServices : insuranceServices;
  const filteredServices = availableServices.filter(service => canAccessService(service.id));

  const handleRoleChange = (newRole: string) => {
    console.log(`Role change requested: ${currentRole} -> ${newRole}`);
    setUserRole(newRole as any);
    updateUserRole(newRole as any);
    // Navigate to dashboard when role changes
    onTabChange('dashboard');
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border shadow-xl backdrop-blur-sm">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Crown className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-sidebar-foreground">Agent IGI Life</h2>
                <p className="text-sm text-sidebar-foreground/70">Insurance Portal</p>
              </div>
            </div>
          </div>

          {/* Role Selector */}
          <div className="p-4 border-b border-sidebar-border">
            <Card className="bg-sidebar-accent">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-sidebar-foreground">Portal Mode</span>
                    <Badge className={cn("text-xs", getRoleColor(currentRole))}>
                      {getRoleIcon(currentRole)}
                      {roleConfig.title}
                    </Badge>
                  </div>
                  <Select value={currentRole} onValueChange={handleRoleChange}>
                    <SelectTrigger className="w-full bg-sidebar border-sidebar-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoles.map((role) => (
                        <SelectItem key={role.role} value={role.role}>
                          <div className="flex items-center gap-2">
                            {getRoleIcon(role.role)}
                            <div>
                              <div className="font-medium">{role.title}</div>
                              <div className="text-xs text-muted-foreground">{role.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Main Navigation */}
            <nav className="p-4 space-y-2">
              <div className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-3">
                Main Menu
              </div>
              {filteredNavigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-11 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    activeTab === item.id && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                  )}
                  onClick={() => onTabChange(item.id)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              ))}
            </nav>

            {/* Services Section */}
            {filteredServices.length > 0 && (
              <nav className="p-4 space-y-2">
                <div className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-3 flex items-center gap-2">
                  {currentRole === 'user' ? 'My Services' : 'Insurance Services'}
                  <Badge variant="secondary" className="text-xs">{filteredServices.length}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {filteredServices.map((service) => {
                    const hasAccess = canAccessService(service.id);
                    return (
                      <Button
                        key={service.id}
                        variant="ghost"
                        className={cn(
                          "h-auto p-3 flex-col gap-2 text-sidebar-foreground hover:bg-sidebar-accent relative",
                          activeTab === service.id && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary",
                          !hasAccess && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() => hasAccess && onTabChange(service.id)}
                        disabled={!hasAccess}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          activeTab === service.id ? "bg-white/20" : service.color
                        )}>
                          <service.icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-medium leading-none">{service.label}</div>
                          <div className="text-xs text-sidebar-foreground/50 mt-1">{service.description}</div>
                        </div>
                        {!hasAccess && (
                          <Lock className="h-3 w-3 absolute top-1 right-1 text-muted-foreground" />
                        )}
                      </Button>
                    );
                  })}
                </div>
              </nav>
            )}
          </div>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="mb-3 p-3 bg-sidebar-accent rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sidebar-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-sidebar-primary-foreground">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
                  <p className="text-xs text-sidebar-foreground/70 truncate">{user?.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge className={cn("text-xs", getRoleColor(currentRole))}>
                      {getRoleIcon(currentRole)}
                      {roleConfig.title}
                    </Badge>
                    {user?.agentId && (
                      <Badge variant="outline" className="text-xs">{user.agentId}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-11 text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-72">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-border px-6 py-4 shadow-lg sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold capitalize text-foreground flex items-center gap-2">
                {activeTab.replace('-', ' ')}
                {!canAccessService(activeTab) && (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                )}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {activeTab === 'dashboard' && `${roleConfig.title} overview of insurance services and metrics`}
                {(activeTab === 'policies' || activeTab === 'my-policies') && (currentRole === 'user' ? 'View and manage your personal policies' : 'Manage all insurance policies across different services')}
                {activeTab === 'clients' && 'Client management and information'}
                {activeTab.includes('insurance') && `Manage ${activeTab.replace('-', ' ')} policies and claims`}
                {activeTab.includes('tracker') && 'Vehicle tracking and monitoring services'}
                {activeTab.includes('employee') && 'Employee benefits and coverage management'}
                {activeTab.includes('corporate') && 'Corporate insurance and business protection'}
                {activeTab === 'claims' && 'File new claims and track existing claim status'}
                {activeTab === 'profile' && 'Manage your personal information and preferences'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{roleConfig.title}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
