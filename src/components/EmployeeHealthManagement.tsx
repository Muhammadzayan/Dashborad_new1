import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, Activity, Calendar, Shield, AlertTriangle, Eye, User, Users, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmployeeHealthPolicy {
  id: string;
  policyNo: string;
  companyName: string;
  employeeName: string;
  employeeId: string;
  designation: string;
  department: string;
  planType: 'Basic' | 'Standard' | 'Premium' | 'Executive';
  sumInsured: number;
  premium: number;
  familySize: number;
  dependents: string[];
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expired' | 'Suspended' | 'Claim Processing';
  lastClaimDate?: string;
  claimsUsed: number;
  networkHospitals: number;
  preExistingCovered: boolean;
  maternityBenefit: boolean;
}

const EmployeeHealthManagement = () => {
  const [policies, setPolicies] = useState<EmployeeHealthPolicy[]>([
    {
      id: '1',
      policyNo: 'EHP-2024-001',
      companyName: 'TechCorp Pakistan',
      employeeName: 'Muhammad Ali',
      employeeId: 'TC001',
      designation: 'Software Engineer',
      department: 'IT',
      planType: 'Premium',
      sumInsured: 1000000,
      premium: 45000,
      familySize: 4,
      dependents: ['Ayesha Ali (Wife)', 'Hassan Ali (Son)', 'Fatima Ali (Daughter)'],
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'Active',
      lastClaimDate: '2024-02-15',
      claimsUsed: 2,
      networkHospitals: 150,
      preExistingCovered: true,
      maternityBenefit: true
    },
    {
      id: '2',
      policyNo: 'EHP-2024-002',
      companyName: 'Global Industries',
      employeeName: 'Sara Ahmed',
      employeeId: 'GI002',
      designation: 'Marketing Manager',
      department: 'Marketing',
      planType: 'Standard',
      sumInsured: 500000,
      premium: 25000,
      familySize: 2,
      dependents: ['Ahmed Khan (Husband)'],
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'Active',
      claimsUsed: 0,
      networkHospitals: 100,
      preExistingCovered: false,
      maternityBenefit: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<EmployeeHealthPolicy | null>(null);
  const [viewingPolicy, setViewingPolicy] = useState<EmployeeHealthPolicy | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    policyNo: '',
    companyName: '',
    employeeName: '',
    employeeId: '',
    designation: '',
    department: '',
    planType: '',
    sumInsured: '',
    premium: '',
    familySize: '',
    dependents: '',
    startDate: '',
    endDate: '',
    networkHospitals: '',
    preExistingCovered: false,
    maternityBenefit: false
  });

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.policyNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlan = planFilter === 'all' || policy.planType === planFilter;

    return matchesSearch && matchesPlan;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const resetForm = () => {
    setFormData({
      policyNo: '',
      companyName: '',
      employeeName: '',
      employeeId: '',
      designation: '',
      department: '',
      planType: '',
      sumInsured: '',
      premium: '',
      familySize: '',
      dependents: '',
      startDate: '',
      endDate: '',
      networkHospitals: '',
      preExistingCovered: false,
      maternityBenefit: false
    });
    setEditingPolicy(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dependentsArray = formData.dependents.split(',').map(d => d.trim()).filter(d => d);
    
    if (editingPolicy) {
      setPolicies(policies.map(p => p.id === editingPolicy.id ? {
        ...editingPolicy,
        ...formData,
        sumInsured: parseFloat(formData.sumInsured),
        premium: parseFloat(formData.premium),
        familySize: parseInt(formData.familySize),
        networkHospitals: parseInt(formData.networkHospitals),
        dependents: dependentsArray
      } : p));
      
      toast({
        title: "Employee Health Policy Updated",
        description: "Employee health insurance policy has been successfully updated.",
      });
    } else {
      const newPolicy: EmployeeHealthPolicy = {
        id: Date.now().toString(),
        ...formData,
        sumInsured: parseFloat(formData.sumInsured),
        premium: parseFloat(formData.premium),
        familySize: parseInt(formData.familySize),
        networkHospitals: parseInt(formData.networkHospitals),
        dependents: dependentsArray,
        status: 'Active',
        claimsUsed: 0
      } as EmployeeHealthPolicy;
      
      setPolicies([...policies, newPolicy]);
      
      toast({
        title: "Employee Health Policy Added",
        description: "New employee health insurance policy has been successfully created.",
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Suspended': return 'bg-yellow-100 text-yellow-800';
      case 'Claim Processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanTypeColor = (type: string) => {
    switch (type) {
      case 'Basic': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'Standard': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Premium': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Executive': return 'bg-gold-50 text-gold-700 border-gold-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center">
              <Activity className="h-6 w-6 lg:h-8 lg:w-8 text-pink-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-pink-600">Total Policies</p>
                <p className="text-lg lg:text-2xl font-bold text-pink-700">{policies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center">
              <Users className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-green-600">Active Employees</p>
                <p className="text-lg lg:text-2xl font-bold text-green-700">
                  {policies.filter(p => p.status === 'Active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center">
              <Shield className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-blue-600">Total Coverage</p>
                <p className="text-lg lg:text-2xl font-bold text-blue-700">
                  {formatCurrency(policies.reduce((sum, p) => sum + p.sumInsured, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center">
              <Building className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-purple-600">Companies</p>
                <p className="text-lg lg:text-2xl font-bold text-purple-700">
                  {new Set(policies.map(p => p.companyName)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                <Activity className="h-5 w-5 lg:h-6 lg:w-6 text-pink-600" />
                Employee Health Insurance Management
              </CardTitle>
              <CardDescription className="text-sm">
                Manage corporate health insurance policies for employees and their families
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Add Employee Policy</span>
                  <span className="sm:hidden">Add Policy</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingPolicy ? 'Edit Employee Health Policy' : 'Add New Employee Health Policy'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="policyNo">Policy Number</Label>
                      <Input
                        id="policyNo"
                        value={formData.policyNo}
                        onChange={(e) => setFormData({...formData, policyNo: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeName">Employee Name</Label>
                      <Input
                        id="employeeName"
                        value={formData.employeeName}
                        onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <Input
                        id="employeeId"
                        value={formData.employeeId}
                        onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        value={formData.designation}
                        onChange={(e) => setFormData({...formData, designation: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IT">Information Technology</SelectItem>
                          <SelectItem value="HR">Human Resources</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="planType">Plan Type</Label>
                      <Select value={formData.planType} onValueChange={(value) => setFormData({...formData, planType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Basic">Basic Plan</SelectItem>
                          <SelectItem value="Standard">Standard Plan</SelectItem>
                          <SelectItem value="Premium">Premium Plan</SelectItem>
                          <SelectItem value="Executive">Executive Plan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sumInsured">Sum Insured (PKR)</Label>
                      <Input
                        id="sumInsured"
                        type="number"
                        value={formData.sumInsured}
                        onChange={(e) => setFormData({...formData, sumInsured: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="premium">Annual Premium (PKR)</Label>
                      <Input
                        id="premium"
                        type="number"
                        value={formData.premium}
                        onChange={(e) => setFormData({...formData, premium: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="familySize">Family Size</Label>
                      <Input
                        id="familySize"
                        type="number"
                        value={formData.familySize}
                        onChange={(e) => setFormData({...formData, familySize: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="networkHospitals">Network Hospitals</Label>
                      <Input
                        id="networkHospitals"
                        type="number"
                        value={formData.networkHospitals}
                        onChange={(e) => setFormData({...formData, networkHospitals: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-span-1 lg:col-span-3 space-y-2">
                      <Label htmlFor="dependents">Dependents (comma separated)</Label>
                      <Input
                        id="dependents"
                        value={formData.dependents}
                        onChange={(e) => setFormData({...formData, dependents: e.target.value})}
                        placeholder="e.g., Spouse Name (Wife), Child 1 (Son), Child 2 (Daughter)"
                      />
                    </div>
                    <div className="col-span-1 lg:col-span-3 flex gap-6">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="preExistingCovered"
                          checked={formData.preExistingCovered}
                          onChange={(e) => setFormData({...formData, preExistingCovered: e.target.checked})}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="preExistingCovered" className="text-sm">Pre-existing Conditions Covered</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="maternityBenefit"
                          checked={formData.maternityBenefit}
                          onChange={(e) => setFormData({...formData, maternityBenefit: e.target.checked})}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="maternityBenefit" className="text-sm">Maternity Benefit Included</Label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-primary">
                      {editingPolicy ? 'Update Policy' : 'Create Policy'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6 p-4 bg-accent rounded-lg">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by policy no., employee name, company, or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plan Types</SelectItem>
                <SelectItem value="Basic">Basic Plan</SelectItem>
                <SelectItem value="Standard">Standard Plan</SelectItem>
                <SelectItem value="Premium">Premium Plan</SelectItem>
                <SelectItem value="Executive">Executive Plan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="min-w-[150px]">Policy Details</TableHead>
                  <TableHead className="min-w-[180px]">Employee Info</TableHead>
                  <TableHead className="min-w-[150px]">Company Details</TableHead>
                  <TableHead className="min-w-[120px]">Plan & Coverage</TableHead>
                  <TableHead className="min-w-[120px]">Family Info</TableHead>
                  <TableHead className="min-w-[140px]">Benefits</TableHead>
                  <TableHead className="min-w-[100px]">Claims</TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                  <TableHead className="text-right min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolicies.map((policy) => (
                  <TableRow key={policy.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm lg:text-base">{policy.policyNo}</div>
                        <div className="text-xs lg:text-sm text-muted-foreground">
                          {new Date(policy.startDate).toLocaleDateString()} - {new Date(policy.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm lg:text-base">{policy.employeeName}</div>
                        <div className="text-xs lg:text-sm text-muted-foreground">
                          ID: {policy.employeeId}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {policy.designation}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm lg:text-base">{policy.companyName}</div>
                        <div className="text-xs lg:text-sm text-muted-foreground">
                          {policy.department}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline" className={`text-xs ${getPlanTypeColor(policy.planType)}`}>
                          {policy.planType}
                        </Badge>
                        <div className="text-xs lg:text-sm text-muted-foreground mt-1">
                          {formatCurrency(policy.sumInsured)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Premium: {formatCurrency(policy.premium)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">Family: {policy.familySize}</div>
                        <div className="text-xs text-muted-foreground">
                          {policy.dependents.length} dependents
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-xs">Hospitals: {policy.networkHospitals}</div>
                        {policy.preExistingCovered && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">Pre-existing</Badge>
                        )}
                        {policy.maternityBenefit && (
                          <Badge variant="outline" className="text-xs bg-pink-50 text-pink-700">Maternity</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">{policy.claimsUsed}</div>
                        <div className="text-xs text-muted-foreground">Used</div>
                        {policy.lastClaimDate && (
                          <div className="text-xs text-muted-foreground">
                            Last: {new Date(policy.lastClaimDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(policy.status)}>
                        {policy.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1 lg:space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewingPolicy(policy)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-3 w-3 lg:h-4 lg:w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingPolicy(policy);
                            setFormData({
                              policyNo: policy.policyNo,
                              companyName: policy.companyName,
                              employeeName: policy.employeeName,
                              employeeId: policy.employeeId,
                              designation: policy.designation,
                              department: policy.department,
                              planType: policy.planType,
                              sumInsured: policy.sumInsured.toString(),
                              premium: policy.premium.toString(),
                              familySize: policy.familySize.toString(),
                              dependents: policy.dependents.join(', '),
                              startDate: policy.startDate,
                              endDate: policy.endDate,
                              networkHospitals: policy.networkHospitals.toString(),
                              preExistingCovered: policy.preExistingCovered,
                              maternityBenefit: policy.maternityBenefit
                            });
                            setIsDialogOpen(true);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3 lg:h-4 lg:w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPolicies(policies.filter(p => p.id !== policy.id));
                            toast({
                              title: "Policy Deleted",
                              description: "Employee health insurance policy has been deleted.",
                            });
                          }}
                          className="text-destructive hover:text-destructive h-8 w-8 p-0"
                        >
                          <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Policy Dialog */}
      <Dialog open={!!viewingPolicy} onOpenChange={() => setViewingPolicy(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Employee Health Insurance Policy Details</DialogTitle>
          </DialogHeader>
          {viewingPolicy && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Policy Number</Label>
                  <p className="text-lg font-medium">{viewingPolicy.policyNo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Employee Details</Label>
                  <p className="text-lg">{viewingPolicy.employeeName}</p>
                  <p className="text-sm text-muted-foreground">ID: {viewingPolicy.employeeId}</p>
                  <p className="text-sm text-muted-foreground">{viewingPolicy.designation}, {viewingPolicy.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Company</Label>
                  <p className="text-lg">{viewingPolicy.companyName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Family & Dependents</Label>
                  <p className="text-sm">Family Size: {viewingPolicy.familySize}</p>
                  <div className="mt-2 space-y-1">
                    {viewingPolicy.dependents.map((dependent, idx) => (
                      <div key={idx} className="text-sm bg-accent p-2 rounded">
                        {dependent}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Plan Details</Label>
                  <Badge variant="outline" className={`${getPlanTypeColor(viewingPolicy.planType)} mb-2`}>
                    {viewingPolicy.planType} Plan
                  </Badge>
                  <p className="text-lg font-bold text-success">{formatCurrency(viewingPolicy.sumInsured)}</p>
                  <p className="text-sm text-muted-foreground">Annual Premium: {formatCurrency(viewingPolicy.premium)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Coverage Period</Label>
                  <div className="text-sm space-y-1">
                    <div>Start: {new Date(viewingPolicy.startDate).toLocaleDateString()}</div>
                    <div>End: {new Date(viewingPolicy.endDate).toLocaleDateString()}</div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Benefits & Features</Label>
                  <div className="space-y-2">
                    <div className="text-sm">Network Hospitals: {viewingPolicy.networkHospitals}</div>
                    <div className="flex flex-wrap gap-2">
                      {viewingPolicy.preExistingCovered && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700">Pre-existing Covered</Badge>
                      )}
                      {viewingPolicy.maternityBenefit && (
                        <Badge variant="outline" className="text-xs bg-pink-50 text-pink-700">Maternity Benefit</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Claims Information</Label>
                  <div className="text-sm space-y-1">
                    <div>Claims Used: {viewingPolicy.claimsUsed}</div>
                    {viewingPolicy.lastClaimDate && (
                      <div>Last Claim: {new Date(viewingPolicy.lastClaimDate).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge className={`mt-1 ${getStatusColor(viewingPolicy.status)}`}>
                    {viewingPolicy.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeHealthManagement;
