import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'user' | 'agent';

export interface UserPermissions {
  canCreatePolicies: boolean;
  canEditPolicies: boolean;
  canDeletePolicies: boolean;
  canViewAllClients: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
  canProcessClaims: boolean;
  canManageSettings: boolean;
}

export interface RoleConfig {
  role: UserRole;
  title: string;
  description: string;
  permissions: UserPermissions;
  allowedServices: string[];
}

const defaultPermissions: Record<UserRole, UserPermissions> = {
  admin: {
    canCreatePolicies: true,
    canEditPolicies: true,
    canDeletePolicies: true,
    canViewAllClients: true,
    canManageUsers: true,
    canViewReports: true,
    canProcessClaims: true,
    canManageSettings: true,
  },
  agent: {
    canCreatePolicies: true,
    canEditPolicies: true,
    canDeletePolicies: false,
    canViewAllClients: true,
    canManageUsers: false,
    canViewReports: true,
    canProcessClaims: true,
    canManageSettings: false,
  },
  user: {
    canCreatePolicies: false,
    canEditPolicies: false,
    canDeletePolicies: false,
    canViewAllClients: false,
    canManageUsers: false,
    canViewReports: false,
    canProcessClaims: false,
    canManageSettings: false,
  },
};

const roleConfigs: Record<UserRole, RoleConfig> = {
  admin: {
    role: 'admin',
    title: 'Administrator',
    description: 'Full system access with all management capabilities',
    permissions: defaultPermissions.admin,
    allowedServices: [
      'dashboard',
      'policies',
      'clients',
      'car-insurance',
      'bike-insurance',
      'life-insurance',
      'corporate-insurance',
      'travel-insurance',
      'employee-health',
      'reports',
      'settings',
      'user-management',
      'leads-management',
      'service-provision'
    ],
  },
  agent: {
    role: 'agent',
    title: 'Insurance Agent',
    description: 'Policy management and client service capabilities',
    permissions: defaultPermissions.agent,
    allowedServices: [
      'dashboard',
      'policies',
      'clients',
      'car-insurance',
      'bike-insurance',
      'life-insurance',
      'travel-insurance',
      'employee-health',
      'corporate-insurance',
      'car-tracker',
      'employee-life',
      'leads-management',
      'service-provision',
      'services',
      'reports'
    ],
  },
  user: {
    role: 'user',
    title: 'Client',
    description: 'View personal policies and access services',
    permissions: defaultPermissions.user,
    allowedServices: [
      'dashboard',
      'my-policies',
      'claims',
      'profile',
      'services',
      'car-tracker',
      'employee-life',
      'car-insurance',
      'bike-insurance',
      'life-insurance',
      'travel-insurance',
      'employee-health',
      'corporate-insurance'
    ],
  },
};

interface UserRoleContextType {
  currentRole: UserRole;
  roleConfig: RoleConfig;
  permissions: UserPermissions;
  setUserRole: (role: UserRole) => void;
  hasPermission: (permission: keyof UserPermissions) => boolean;
  canAccessService: (serviceId: string) => boolean;
  availableRoles: RoleConfig[];
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};

interface UserRoleProviderProps {
  children: ReactNode;
  initialRole: UserRole;
}

export const UserRoleProvider: React.FC<UserRoleProviderProps> = ({ 
  children, 
  initialRole 
}) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(initialRole);

  // Update role when initialRole changes
  useEffect(() => {
    setCurrentRole(initialRole);
  }, [initialRole]);

  const roleConfig = roleConfigs[currentRole];
  const permissions = roleConfig.permissions;

  const setUserRole = (role: UserRole) => {
    console.log(`Setting user role from ${currentRole} to ${role}`);
    setCurrentRole(role);
  };

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    return permissions[permission];
  };

  const canAccessService = (serviceId: string): boolean => {
    const canAccess = roleConfig.allowedServices.includes(serviceId);
    console.log(`Role ${currentRole} accessing ${serviceId}: ${canAccess}`);
    console.log(`Allowed services:`, roleConfig.allowedServices);
    return canAccess;
  };

  const availableRoles = Object.values(roleConfigs);

  const value: UserRoleContextType = {
    currentRole,
    roleConfig,
    permissions,
    setUserRole,
    hasPermission,
    canAccessService,
    availableRoles,
  };

  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  );
};

export default UserRoleProvider;
