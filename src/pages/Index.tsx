import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { UserRoleProvider, useUserRole } from '@/contexts/UserRoleContext';
import { DataProvider, useData } from '@/contexts/DataContext';
import LoginPage from '@/components/LoginPage';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import GetQuoteModal from '@/components/GetQuoteModal';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardHome from '@/components/DashboardHome';
import EnhancedDashboardHome from '@/components/EnhancedDashboardHome';
import PoliciesManagement from '@/components/PoliciesManagement';
import ClientsManagement from '@/components/ClientsManagement';
import CarInsuranceManagement from '@/components/CarInsuranceManagement';
import TravelInsuranceManagement from '@/components/TravelInsuranceManagement';
import BikeInsuranceManagement from '@/components/BikeInsuranceManagement';
import LifeInsuranceManagement from '@/components/LifeInsuranceManagement';
import EmployeeHealthManagement from '@/components/EmployeeHealthManagement';
import CorporateInsuranceManagement from '@/components/CorporateInsuranceManagement';
import UserManagement from '@/components/UserManagement';
import LeadsManagement from '@/components/LeadsManagement';
import CarTrackerService from '@/components/CarTrackerService';
import EmployeeLifeService from '@/components/EmployeeLifeService';
import ServicesPage from '@/components/ServicesPage';
import UserProfileEdit from '@/components/UserProfileEdit';
import ServiceProvision from '@/components/ServiceProvision';

// Service placeholder components for remaining services
const ServicePlaceholder = ({ serviceName, description, icon: Icon }: { 
  serviceName: string; 
  description: string; 
  icon: React.ComponentType<{ className?: string }> 
}) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 lg:p-8">
    <div className="bg-gradient-primary rounded-full p-4 lg:p-6 mb-4 lg:mb-6">
      <Icon className="h-8 w-8 lg:h-12 lg:w-12 text-white" />
    </div>
    <h2 className="text-2xl lg:text-3xl font-bold mb-2 lg:mb-4 text-center">{serviceName}</h2>
    <p className="text-base lg:text-lg text-muted-foreground text-center max-w-md mb-4 lg:mb-6 px-4">
      {description}
    </p>
    <div className="bg-accent p-4 lg:p-6 rounded-lg border-2 border-dashed border-border w-full max-w-md">
      <p className="text-sm text-muted-foreground text-center">
        This service management page is under development. 
        <br />
        Full functionality will be available soon.
      </p>
    </div>
  </div>
);

// User-specific components
const MyPoliciesView = () => {
  const { user } = useAuth();
  const { policies, carPolicies, bikePolicies, lifePolicies, travelPolicies, getUserServices } = useData();

  // Get user's policies from all insurance types
  const userPolicies = policies.filter(p => p.clientName === user?.name || p.clientId === user?.id);
  const userCarPolicies = carPolicies.filter(p => p.clientName === user?.name);
  const userBikePolicies = bikePolicies.filter(p => p.clientName === user?.name);
  const userLifePolicies = lifePolicies.filter(p => p.clientName === user?.name);
  const userTravelPolicies = travelPolicies.filter(p => p.clientName === user?.name);

  // Get user's requested services
  const userServices = getUserServices(user?.id || '');

  const allUserPolicies = [
    ...userPolicies.map(p => ({ ...p, type: 'General', icon: FileText })),
    ...userCarPolicies.map(p => ({ ...p, type: 'Car Insurance', icon: Car })),
    ...userBikePolicies.map(p => ({ ...p, type: 'Bike Insurance', icon: Bike })),
    ...userLifePolicies.map(p => ({ ...p, type: 'Life Insurance', icon: Heart })),
    ...userTravelPolicies.map(p => ({ ...p, type: 'Travel Insurance', icon: Plane }))
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="bg-gradient-primary p-4 lg:p-6 rounded-xl text-white">
        <h2 className="text-xl lg:text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
        <p className="text-blue-100">Here are your personal insurance policies</p>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="text-sm">Active Policies: {allUserPolicies.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <span className="text-sm">Total Coverage: {formatCurrency(allUserPolicies.reduce((sum, p) => sum + (p.sumAssured || 0), 0))}</span>
          </div>
        </div>
      </div>

      {allUserPolicies.length > 0 ? (
        <div className="grid gap-4">
          {allUserPolicies.map((policy, index) => (
            <Card key={`${policy.type}-${policy.id}`} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <policy.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{policy.policyNo}</h3>
                      <p className="text-muted-foreground">{policy.type}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span>Premium: {formatCurrency(policy.premium)}</span>
                        <span>Coverage: {formatCurrency(policy.sumAssured || 0)}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={policy.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {policy.status}
                  </Badge>
                </div>
                {policy.type === 'Car Insurance' && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm"><strong>Vehicle:</strong> {policy.vehicleMake} {policy.vehicleModel} ({policy.vehicleYear})</p>
                    <p className="text-sm"><strong>Registration:</strong> {policy.registrationNo}</p>
                  </div>
                )}
                {policy.type === 'Life Insurance' && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm"><strong>Plan:</strong> {policy.planType}</p>
                    <p className="text-sm"><strong>Beneficiary:</strong> {policy.beneficiaryName} ({policy.beneficiaryRelation})</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-card">
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No Policies Found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              You don't have any insurance policies yet. Contact our agents to get started.
            </p>
            <GetQuoteModal>
              <Button className="bg-gradient-primary">
                Get Your First Quote
              </Button>
            </GetQuoteModal>
          </CardContent>
        </Card>
      )}

      {/* User Services Section */}
      {userServices.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">My Service Requests</h3>
          <div className="grid gap-4">
            {userServices.map((service) => (
              <Card key={service.id} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{service.serviceName}</h3>
                        <p className="text-muted-foreground capitalize">{service.serviceType.replace('-', ' ')}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-muted-foreground">
                            Requested: {new Date(service.requestDate).toLocaleDateString('en-PK', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          {service.activationDate && (
                            <p className="text-sm text-green-600">
                              Activated: {new Date(service.activationDate).toLocaleDateString('en-PK', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge className={
                      service.status === 'active' ? 'bg-green-100 text-green-800' :
                      service.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      service.status === 'requested' ? 'bg-yellow-100 text-yellow-800' :
                      service.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                      service.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      <div className="flex items-center gap-1">
                        {service.status === 'active' && <CheckCircle className="h-3 w-3" />}
                        {service.status === 'in_progress' && <Clock className="h-3 w-3" />}
                        {service.status === 'requested' && <AlertCircle className="h-3 w-3" />}
                        {service.status === 'completed' && <CheckCircle className="h-3 w-3" />}
                        {service.status === 'cancelled' && <X className="h-3 w-3" />}
                        <span className="capitalize">{service.status.replace('_', ' ')}</span>
                      </div>
                    </Badge>
                  </div>
                  {service.details && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <div className="text-sm space-y-1">
                        {service.serviceType === 'car-tracker' && service.details.vehicle && (
                          <p><strong>Vehicle:</strong> {service.details.vehicle}</p>
                        )}
                        {service.serviceType === 'employee-life' && service.details.company && (
                          <p><strong>Company:</strong> {service.details.company}</p>
                        )}
                        {service.details.plan && (
                          <p><strong>Plan:</strong> {service.details.plan}</p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ClaimsView = () => {
  const { user } = useAuth();
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimFormData, setClaimFormData] = useState({
    policyNo: '',
    claimType: '',
    incidentDate: '',
    description: '',
    estimatedAmount: ''
  });

  // Mock claims data for demonstration
  const mockClaims = [
    {
      id: 'CLM001',
      policyNo: 'IGI-LIFE-001',
      claimType: 'Life Insurance',
      amount: 50000,
      status: 'Under Review',
      submittedDate: '2024-01-15',
      description: 'Medical claim for treatment'
    },
    {
      id: 'CLM002',
      policyNo: 'IGI-CAR-002',
      claimType: 'Car Insurance',
      amount: 150000,
      status: 'Approved',
      submittedDate: '2024-01-10',
      description: 'Vehicle accident claim'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 lg:p-6 rounded-xl text-white">
        <h2 className="text-xl lg:text-2xl font-bold mb-2">Claims Management</h2>
        <p className="text-green-100">File and track your insurance claims</p>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="text-sm">Total Claims: {mockClaims.length}</span>
          </div>
          <Button
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            onClick={() => setShowClaimForm(true)}
          >
            File New Claim
          </Button>
        </div>
      </div>

      {/* Claims List */}
      <div className="grid gap-4">
        {mockClaims.map((claim) => (
          <Card key={claim.id} className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Claim #{claim.id}</h3>
                    <p className="text-muted-foreground">{claim.claimType} - {claim.policyNo}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span>Amount: {formatCurrency(claim.amount)}</span>
                      <span>Submitted: {new Date(claim.submittedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(claim.status)}>
                  {claim.status}
                </Badge>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm">{claim.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockClaims.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="text-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No Claims Filed</h3>
            <p className="text-sm text-muted-foreground mb-6">
              You haven't filed any insurance claims yet.
            </p>
            <Button
              className="bg-gradient-primary"
              onClick={() => setShowClaimForm(true)}
            >
              File Your First Claim
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Claim Form Modal */}
      {showClaimForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">File New Claim</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Policy Number</label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border rounded"
                    value={claimFormData.policyNo}
                    onChange={(e) => setClaimFormData({...claimFormData, policyNo: e.target.value})}
                    placeholder="Enter your policy number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Claim Type</label>
                  <select
                    className="w-full mt-1 p-2 border rounded"
                    value={claimFormData.claimType}
                    onChange={(e) => setClaimFormData({...claimFormData, claimType: e.target.value})}
                  >
                    <option value="">Select claim type</option>
                    <option value="life">Life Insurance</option>
                    <option value="car">Car Insurance</option>
                    <option value="health">Health Insurance</option>
                    <option value="travel">Travel Insurance</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Incident Date</label>
                  <input
                    type="date"
                    className="w-full mt-1 p-2 border rounded"
                    value={claimFormData.incidentDate}
                    onChange={(e) => setClaimFormData({...claimFormData, incidentDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    className="w-full mt-1 p-2 border rounded h-24"
                    value={claimFormData.description}
                    onChange={(e) => setClaimFormData({...claimFormData, description: e.target.value})}
                    placeholder="Describe the incident and your claim"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Estimated Amount (PKR)</label>
                  <input
                    type="number"
                    className="w-full mt-1 p-2 border rounded"
                    value={claimFormData.estimatedAmount}
                    onChange={(e) => setClaimFormData({...claimFormData, estimatedAmount: e.target.value})}
                    placeholder="Enter estimated claim amount"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowClaimForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-primary"
                  onClick={() => {
                    // Handle claim submission here
                    setShowClaimForm(false);
                    setClaimFormData({
                      policyNo: '',
                      claimType: '',
                      incidentDate: '',
                      description: '',
                      estimatedAmount: ''
                    });
                  }}
                >
                  Submit Claim
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

const ProfileView = () => {
  const { user, updateUserRole } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    agentId: user?.agentId || ''
  });

  const handleSave = () => {
    // In a real app, this would update the user profile
    setIsEditing(false);
    // For now, we'll just show a success message
    alert('Profile updated successfully!');
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 lg:p-6 rounded-xl text-white">
        <h2 className="text-xl lg:text-2xl font-bold mb-2">Profile Settings</h2>
        <p className="text-purple-100">Manage your personal information and preferences</p>
        <div className="flex items-center gap-4 mt-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold">{user?.name?.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold">{user?.name}</h3>
            <p className="text-purple-100 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border rounded"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                ) : (
                  <p className="text-lg">{user?.name}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    className="w-full mt-1 p-2 border rounded"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                ) : (
                  <p className="text-lg">{user?.email}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Department</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border rounded"
                    value={profileData.department}
                    onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                  />
                ) : (
                  <p className="text-lg">{user?.department || 'Not specified'}</p>
                )}
              </div>

              {user?.agentId && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Agent ID</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full mt-1 p-2 border rounded"
                      value={profileData.agentId}
                      onChange={(e) => setProfileData({...profileData, agentId: e.target.value})}
                    />
                  ) : (
                    <p className="text-lg font-mono">{user?.agentId}</p>
                  )}
                </div>
              )}
            </div>

            {isEditing && (
              <div className="mt-6">
                <Button onClick={handleSave} className="bg-gradient-primary">
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                <Badge className="mt-1 block w-fit">
                  {user?.role === 'admin' && <UserCheck className="h-3 w-3 mr-1" />}
                  {user?.role === 'agent' && <UserCheck className="h-3 w-3 mr-1" />}
                  {user?.role === 'user' && <Shield className="h-3 w-3 mr-1" />}
                  <span className="capitalize">{user?.role}</span>
                </Badge>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                <p className="text-lg">January 2024</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                <p className="text-lg">Today, {new Date().toLocaleTimeString()}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">Security</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  Download Account Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Import icons for placeholders
import {
  Car,
  UserCheck,
  FileText,
  Bike,
  Heart,
  Plane,
  Shield,
  Clock,
  AlertCircle,
  X,
  CheckCircle
} from 'lucide-react';

const DashboardApp = () => {
  const { isAuthenticated, user } = useAuth();
  const { canAccessService, currentRole, setUserRole } = useUserRole();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sync user role when user changes
  useEffect(() => {
    if (user && user.role !== currentRole) {
      setUserRole(user.role);
    }
  }, [user, currentRole, setUserRole]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleTabChange = (tab: string) => {
    console.log(`Attempting to navigate to: ${tab}`);
    console.log(`User role: ${user?.role}`);
    console.log(`Current role: ${currentRole}`);
    console.log(`Can access service: ${canAccessService(tab)}`);
    
    // Always allow navigation, but show appropriate content based on permissions
    setActiveTab(tab);
  };

  const renderContent = () => {
    console.log(`Rendering content for tab: ${activeTab}`);
    console.log(`User role: ${user?.role}`);
    console.log(`Current role: ${currentRole}`);
    
    // Check access before rendering
    if (!canAccessService(activeTab)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 lg:p-8">
          <div className="bg-red-100 rounded-full p-4 lg:p-6 mb-4 lg:mb-6">
            <div className="h-8 w-8 lg:h-12 lg:w-12 text-red-600 text-2xl lg:text-4xl flex items-center justify-center">🔒</div>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-red-700 text-center">Access Restricted</h2>
          <p className="text-base lg:text-lg text-muted-foreground text-center max-w-md mb-4 lg:mb-6 px-4">
            You don't have permission to access this service with your current role: <strong>{currentRole}</strong>
          </p>
          <p className="text-sm text-muted-foreground text-center px-4">
            Please contact your administrator or switch to an appropriate role.
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <EnhancedDashboardHome />;
      case 'policies':
        return <PoliciesManagement />;
      case 'my-policies':
        return <MyPoliciesView />;
      case 'clients':
        return <ClientsManagement />;
      case 'car-insurance':
        return <CarInsuranceManagement />;
      case 'car-tracker':
        return <CarTrackerService />;
      case 'bike-insurance':
        return <BikeInsuranceManagement />;
      case 'life-insurance':
        return <LifeInsuranceManagement />;
      case 'employee-life':
        return <EmployeeLifeService />;
      case 'corporate-insurance':
        return <CorporateInsuranceManagement />;
      case 'travel-insurance':
        return <TravelInsuranceManagement />;
      case 'employee-health':
        return <EmployeeHealthManagement />;
      case 'services':
        return <ServicesPage />;
      case 'claims':
        return <ClaimsView />;
      case 'profile':
        return <UserProfileEdit />;
      case 'user-management':
        return <UserManagement />;
      case 'leads-management':
        return <LeadsManagement />;
      case 'service-provision':
        return <ServiceProvision />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderContent()}
    </DashboardLayout>
  );
};

const AuthWrapper = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Don't render UserRoleProvider until we have a user
  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }
  
  return (
    <UserRoleProvider initialRole={user.role}>
      <DashboardApp />
    </UserRoleProvider>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <AuthWrapper />
      </DataProvider>
    </AuthProvider>
  );
};

export default Index;
