import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Crown, UserCheck, User, Shield, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'admin' | 'agent' | 'user',
    department: '',
    agentId: ''
  });
  const { login, createUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    {
      email: 'admin@igilife.com',
      password: 'password123',
      role: 'Administrator',
      name: 'Muhammad Zayan',
      icon: Crown,
      color: 'bg-purple-100 text-purple-800',
      description: 'Full system access with all management capabilities'
    },
    {
      email: 'agent@igilife.com',
      password: 'password123',
      role: 'Insurance Agent',
      name: 'Sarah Ahmed',
      icon: UserCheck,
      color: 'bg-blue-100 text-blue-800',
      description: 'Policy management and client service capabilities'
    },
    {
      email: 'client@igilife.com',
      password: 'password123',
      role: 'Client',
      name: 'Ahmed Ali',
      icon: User,
      color: 'bg-green-100 text-green-800',
      description: 'View personal policies and make claims'
    }
  ];

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      if (registerData.role === 'agent') {
        // For agent registration, create a pending approval request
        setError('Agent registration request submitted. Admin will review and approve your account within 24 hours.');
        setIsLoading(false);
        return;
      }

      const success = await createUser({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        role: registerData.role,
        department: registerData.department || undefined,
        agentId: registerData.agentId || undefined
      });

      if (success) {
        setError('Account created successfully! You can now login with your credentials.');
        setIsRegistering(false);
        setRegisterData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'user',
          department: '',
          agentId: ''
        });
      } else {
        setError('Email already exists. Please use a different email or try logging in.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding and Features */}
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Agent IGI Life</h1>
                <p className="text-lg text-gray-600">Insurance Management Portal</p>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Insurance Solutions
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Manage all your insurance services in one powerful platform with advanced analytics and reporting.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">8 Insurance Types</h3>
                <p className="text-sm text-gray-600">Complete coverage</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Role-Based Access</h3>
                <p className="text-sm text-gray-600">Secure permissions</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Crown className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Admin Portal</h3>
                <p className="text-sm text-gray-600">Full management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Client Portal</h3>
                <p className="text-sm text-gray-600">Self-service</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="space-y-6">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-md hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="space-y-1 text-center">
              <div className="flex items-center justify-center space-x-1 mb-4">
                <Button
                  variant={!isRegistering ? "default" : "ghost"}
                  className="px-6"
                  onClick={() => setIsRegistering(false)}
                >
                  Login
                </Button>
                <Button
                  variant={isRegistering ? "default" : "ghost"}
                  className="px-6"
                  onClick={() => setIsRegistering(true)}
                >
                  Register
                </Button>
              </div>
              <CardTitle className="text-2xl font-bold">
                {isRegistering ? 'Create Account' : 'Welcome Back'}
              </CardTitle>
              <CardDescription>
                {isRegistering
                  ? 'Create a new account to access our insurance services'
                  : 'Enter your credentials to access the insurance portal'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isRegistering ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 pr-10 h-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant={error.includes('successfully') || error.includes('submitted') ? 'default' : 'destructive'}>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-primary hover:bg-primary-dark text-white font-semibold shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="registerName">Full Name</Label>
                      <Input
                        id="registerName"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                        placeholder="Enter your full name"
                        required
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registerEmail">Email Address</Label>
                      <Input
                        id="registerEmail"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                        placeholder="Enter your email"
                        required
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="registerPassword">Password</Label>
                      <Input
                        id="registerPassword"
                        type="password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        placeholder="Create a password"
                        required
                        minLength={6}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                        placeholder="Confirm your password"
                        required
                        minLength={6}
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Account Type</Label>
                    <Select value={registerData.role} onValueChange={(value: 'admin' | 'agent' | 'user') => setRegisterData({...registerData, role: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Client User
                          </div>
                        </SelectItem>
                        {/* <SelectItem value="agent">
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4" />
                            Insurance Agent (Requires Approval)
                          </div>
                        </SelectItem> */}
                      </SelectContent>
                    </Select>
                  </div>

                  {registerData.role === 'agent' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={registerData.department}
                          onChange={(e) => setRegisterData({...registerData, department: e.target.value})}
                          placeholder="e.g., Sales, Customer Service"
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="agentId">Requested Agent ID</Label>
                        <Input
                          id="agentId"
                          value={registerData.agentId}
                          onChange={(e) => setRegisterData({...registerData, agentId: e.target.value})}
                          placeholder="e.g., AGT001"
                          className="h-10"
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <Alert variant={error.includes('successfully') || error.includes('submitted') ? 'default' : 'destructive'}>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-primary hover:bg-primary-dark text-white font-semibold shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Demo Accounts */}
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-md hover:bg-white/80 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Demo Accounts
              </CardTitle>
              <CardDescription>
                Click on any account below to try different user roles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoAccounts.map((account, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 cursor-pointer group"
                  onClick={() => handleDemoLogin(account.email, account.password)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <account.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{account.name}</h4>
                        <Badge className={account.color}>{account.role}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{account.email}</p>
                      <p className="text-xs text-gray-500">{account.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Try Login
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500">
            <p>Password for all demo accounts: <code className="bg-gray-100 px-2 py-1 rounded">password123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
