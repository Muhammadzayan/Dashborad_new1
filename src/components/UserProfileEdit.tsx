import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { User, Edit, Save, X, Crown, UserCheck, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const UserProfileEdit = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    agentId: user?.agentId || ''
  });

  const resetForm = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      department: user?.department || '',
      agentId: user?.agentId || ''
    });
    setError('');
    setSuccess(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    resetForm();
  };

  const handleCancel = () => {
    setIsEditing(false);
    resetForm();
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Validation
      if (!formData.name.trim()) {
        setError('Name is required');
        setIsLoading(false);
        return;
      }

      if (!formData.email.trim()) {
        setError('Email is required');
        setIsLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      // Call the update function (we'll need to implement this in AuthContext)
      const success = await updateUserProfile({
        name: formData.name.trim(),
        email: formData.email.trim(),
        department: formData.department.trim(),
        agentId: formData.agentId.trim()
      });

      if (success) {
        setSuccess(true);
        setIsEditing(false);
        toast({
          title: "Profile Updated",
          description: "Your profile information has been successfully updated.",
        });
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while updating your profile.');
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-xl text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold">{user?.name?.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Profile Settings</h1>
            <p className="text-purple-100">Manage your personal information and preferences</p>
          </div>
          <Badge className={`${getRoleColor(user?.role || 'user')} text-sm`}>
            {getRoleIcon(user?.role || 'user')}
            <span className="ml-1 capitalize">{user?.role}</span>
          </Badge>
        </div>
      </div>

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Your profile has been successfully updated!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </div>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your full name"
                    className="transition-all"
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="font-medium">{user?.name}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter your email address"
                    className="transition-all"
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="font-medium">{user?.email}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                {isEditing ? (
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="Enter your department"
                    className="transition-all"
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="font-medium">{user?.department || 'Not specified'}</p>
                  </div>
                )}
              </div>

              {(user?.role === 'admin' || user?.role === 'agent') && (
                <div className="space-y-2">
                  <Label htmlFor="agentId">Agent ID</Label>
                  {isEditing ? (
                    <Input
                      id="agentId"
                      value={formData.agentId}
                      onChange={(e) => setFormData({...formData, agentId: e.target.value})}
                      placeholder="Enter your agent ID"
                      className="transition-all"
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="font-medium font-mono">{user?.agentId || 'Not specified'}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={handleSave} disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>
              View your account details and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Account Type</Label>
                <Badge className={`mt-1 ${getRoleColor(user?.role || 'user')}`}>
                  {getRoleIcon(user?.role || 'user')}
                  <span className="ml-1 capitalize">{user?.role}</span>
                </Badge>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">User ID</Label>
                <p className="font-mono text-sm bg-muted p-2 rounded">{user?.id}</p>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Member Since</Label>
                <p className="font-medium">January 2024</p>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Last Login</Label>
                <p className="font-medium">Today, {new Date().toLocaleTimeString()}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-3">Security Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Enable Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full justify-start text-blue-600 hover:text-blue-700">
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

export default UserProfileEdit;
