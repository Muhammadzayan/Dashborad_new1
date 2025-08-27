import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, Heart, Calendar, Shield, AlertTriangle, Eye, User, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LifePolicy {
  id: string;
  policyNo: string;
  clientName: string;
  clientAge: number;
  clientGender: 'Male' | 'Female';
  policyType: 'Term Life' | 'Whole Life' | 'Endowment' | 'Unit Linked' | 'Money Back';
  planName: string;
  sumAssured: number;
  premium: number;
  premiumFrequency: 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual';
  policyTerm: number;
  premiumPayingTerm: number;
  maturityDate: string;
  startDate: string;
  status: 'Active' | 'Matured' | 'Lapsed' | 'Surrendered';
  nominees: string[];
  medicalDone: boolean;
  lastPremiumPaid: string;
}

const LifeInsuranceManagement = () => {
  const [policies, setPolicies] = useState<LifePolicy[]>([
    {
      id: '1',
      policyNo: 'LIFE-2024-001',
      clientName: 'Ahmed Hassan',
      clientAge: 35,
      clientGender: 'Male',
      policyType: 'Term Life',
      planName: 'IGI Secure Term Plan',
      sumAssured: 5000000,
      premium: 25000,
      premiumFrequency: 'Annual',
      policyTerm: 20,
      premiumPayingTerm: 20,
      maturityDate: '2044-03-15',
      startDate: '2024-03-15',
      status: 'Active',
      nominees: ['Fatima Hassan (Wife)', 'Ali Hassan (Son)'],
      medicalDone: true,
      lastPremiumPaid: '2024-03-15'
    },
    {
      id: '2',
      policyNo: 'LIFE-2024-002',
      clientName: 'Sana Malik',
      clientAge: 28,
      clientGender: 'Female',
      policyType: 'Whole Life',
      planName: 'IGI Whole Life Plus',
      sumAssured: 3000000,
      premium: 45000,
      premiumFrequency: 'Annual',
      policyTerm: 65,
      premiumPayingTerm: 25,
      maturityDate: '2061-01-20',
      startDate: '2024-01-20',
      status: 'Active',
      nominees: ['Omar Malik (Husband)'],
      medicalDone: true,
      lastPremiumPaid: '2024-01-20'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<LifePolicy | null>(null);
  const [viewingPolicy, setViewingPolicy] = useState<LifePolicy | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    policyNo: '',
    clientName: '',
    clientAge: '',
    clientGender: '',
    policyType: '',
    planName: '',
    sumAssured: '',
    premium: '',
    premiumFrequency: '',
    policyTerm: '',
    premiumPayingTerm: '',
    startDate: '',
    nominees: '',
    medicalDone: false
  });

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.policyNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.planName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || policy.policyType === typeFilter;

    return matchesSearch && matchesType;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateMaturityDate = (startDate: string, policyTerm: number) => {
    const start = new Date(startDate);
    const maturity = new Date(start.getFullYear() + policyTerm, start.getMonth(), start.getDate());
    return maturity.toISOString().split('T')[0];
  };

  const resetForm = () => {
    setFormData({
      policyNo: '',
      clientName: '',
      clientAge: '',
      clientGender: '',
      policyType: '',
      planName: '',
      sumAssured: '',
      premium: '',
      premiumFrequency: '',
      policyTerm: '',
      premiumPayingTerm: '',
      startDate: '',
      nominees: '',
      medicalDone: false
    });
    setEditingPolicy(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const maturityDate = calculateMaturityDate(formData.startDate, parseInt(formData.policyTerm));
    const nomineesArray = formData.nominees.split(',').map(n => n.trim()).filter(n => n);
    
    if (editingPolicy) {
      setPolicies(policies.map(p => p.id === editingPolicy.id ? {
        ...editingPolicy,
        ...formData,
        clientAge: parseInt(formData.clientAge),
        sumAssured: parseFloat(formData.sumAssured),
        premium: parseFloat(formData.premium),
        policyTerm: parseInt(formData.policyTerm),
        premiumPayingTerm: parseInt(formData.premiumPayingTerm),
        maturityDate,
        nominees: nomineesArray,
        lastPremiumPaid: formData.startDate
      } : p));
      
      toast({
        title: "Life Policy Updated",
        description: "Life insurance policy has been successfully updated.",
      });
    } else {
      const newPolicy: LifePolicy = {
        id: Date.now().toString(),
        ...formData,
        clientAge: parseInt(formData.clientAge),
        sumAssured: parseFloat(formData.sumAssured),
        premium: parseFloat(formData.premium),
        policyTerm: parseInt(formData.policyTerm),
        premiumPayingTerm: parseInt(formData.premiumPayingTerm),
        maturityDate,
        nominees: nomineesArray,
        status: 'Active',
        lastPremiumPaid: formData.startDate
      } as LifePolicy;
      
      setPolicies([...policies, newPolicy]);
      
      toast({
        title: "Life Policy Added",
        description: "New life insurance policy has been successfully created.",
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Matured': return 'bg-blue-100 text-blue-800';
      case 'Lapsed': return 'bg-red-100 text-red-800';
      case 'Surrendered': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPolicyTypeColor = (type: string) => {
    switch (type) {
      case 'Term Life': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Whole Life': return 'bg-green-50 text-green-700 border-green-200';
      case 'Endowment': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Unit Linked': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Money Back': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center">
              <Heart className="h-6 w-6 lg:h-8 lg:w-8 text-red-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-red-600">Total Policies</p>
                <p className="text-lg lg:text-2xl font-bold text-red-700">{policies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center">
              <Shield className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-green-600">Active Policies</p>
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
              <Users className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-blue-600">Total Coverage</p>
                <p className="text-lg lg:text-2xl font-bold text-blue-700">
                  {formatCurrency(policies.reduce((sum, p) => sum + p.sumAssured, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-purple-600">Annual Premium</p>
                <p className="text-lg lg:text-2xl font-bold text-purple-700">
                  {formatCurrency(policies.reduce((sum, p) => sum + p.premium, 0))}
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
                <Heart className="h-5 w-5 lg:h-6 lg:w-6 text-red-600" />
                Life Insurance Management
              </CardTitle>
              <CardDescription className="text-sm">
                Manage life insurance policies, beneficiaries, and coverage plans
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Add Life Policy</span>
                  <span className="sm:hidden">Add Policy</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingPolicy ? 'Edit Life Insurance Policy' : 'Add New Life Insurance Policy'}
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
                      <Label htmlFor="clientName">Client Name</Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientAge">Client Age</Label>
                      <Input
                        id="clientAge"
                        type="number"
                        value={formData.clientAge}
                        onChange={(e) => setFormData({...formData, clientAge: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientGender">Gender</Label>
                      <Select value={formData.clientGender} onValueChange={(value) => setFormData({...formData, clientGender: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policyType">Policy Type</Label>
                      <Select value={formData.policyType} onValueChange={(value) => setFormData({...formData, policyType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Term Life">Term Life</SelectItem>
                          <SelectItem value="Whole Life">Whole Life</SelectItem>
                          <SelectItem value="Endowment">Endowment</SelectItem>
                          <SelectItem value="Unit Linked">Unit Linked</SelectItem>
                          <SelectItem value="Money Back">Money Back</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="planName">Plan Name</Label>
                      <Input
                        id="planName"
                        value={formData.planName}
                        onChange={(e) => setFormData({...formData, planName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sumAssured">Sum Assured (PKR)</Label>
                      <Input
                        id="sumAssured"
                        type="number"
                        value={formData.sumAssured}
                        onChange={(e) => setFormData({...formData, sumAssured: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="premium">Premium (PKR)</Label>
                      <Input
                        id="premium"
                        type="number"
                        value={formData.premium}
                        onChange={(e) => setFormData({...formData, premium: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="premiumFrequency">Premium Frequency</Label>
                      <Select value={formData.premiumFrequency} onValueChange={(value) => setFormData({...formData, premiumFrequency: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Quarterly">Quarterly</SelectItem>
                          <SelectItem value="Semi-Annual">Semi-Annual</SelectItem>
                          <SelectItem value="Annual">Annual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policyTerm">Policy Term (Years)</Label>
                      <Input
                        id="policyTerm"
                        type="number"
                        value={formData.policyTerm}
                        onChange={(e) => setFormData({...formData, policyTerm: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="premiumPayingTerm">Premium Paying Term (Years)</Label>
                      <Input
                        id="premiumPayingTerm"
                        type="number"
                        value={formData.premiumPayingTerm}
                        onChange={(e) => setFormData({...formData, premiumPayingTerm: e.target.value})}
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
                    <div className="col-span-1 lg:col-span-3 space-y-2">
                      <Label htmlFor="nominees">Nominees (comma separated)</Label>
                      <Input
                        id="nominees"
                        value={formData.nominees}
                        onChange={(e) => setFormData({...formData, nominees: e.target.value})}
                        placeholder="e.g., Wife - 50%, Son - 30%, Daughter - 20%"
                        required
                      />
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
                  placeholder="Search by policy no., client name, or plan name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Policy Types</SelectItem>
                <SelectItem value="Term Life">Term Life</SelectItem>
                <SelectItem value="Whole Life">Whole Life</SelectItem>
                <SelectItem value="Endowment">Endowment</SelectItem>
                <SelectItem value="Unit Linked">Unit Linked</SelectItem>
                <SelectItem value="Money Back">Money Back</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="min-w-[150px]">Policy Details</TableHead>
                  <TableHead className="min-w-[180px]">Client Information</TableHead>
                  <TableHead className="min-w-[120px]">Plan Details</TableHead>
                  <TableHead className="min-w-[150px]">Financial</TableHead>
                  <TableHead className="min-w-[140px]">Terms & Dates</TableHead>
                  <TableHead className="min-w-[120px]">Nominees</TableHead>
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
                        <div className="text-xs lg:text-sm text-muted-foreground">{policy.planName}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm lg:text-base">{policy.clientName}</div>
                        <div className="text-xs lg:text-sm text-muted-foreground">
                          {policy.clientAge} years • {policy.clientGender}
                        </div>
                        {policy.medicalDone && (
                          <Badge variant="outline" className="text-xs mt-1">Medical Done</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline" className={`text-xs ${getPolicyTypeColor(policy.policyType)}`}>
                          {policy.policyType}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {policy.premiumFrequency}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm lg:text-base">{formatCurrency(policy.premium)}</div>
                        <div className="text-xs lg:text-sm text-muted-foreground">
                          Coverage: {formatCurrency(policy.sumAssured)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs lg:text-sm">
                        <div>Term: {policy.policyTerm} years</div>
                        <div>Pay: {policy.premiumPayingTerm} years</div>
                        <div>Maturity: {new Date(policy.maturityDate).getFullYear()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs lg:text-sm">
                        {policy.nominees.slice(0, 2).map((nominee, idx) => (
                          <div key={idx} className="truncate max-w-[100px]">
                            {nominee.split('(')[0]}
                          </div>
                        ))}
                        {policy.nominees.length > 2 && (
                          <div className="text-muted-foreground">+{policy.nominees.length - 2} more</div>
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
                              clientName: policy.clientName,
                              clientAge: policy.clientAge.toString(),
                              clientGender: policy.clientGender,
                              policyType: policy.policyType,
                              planName: policy.planName,
                              sumAssured: policy.sumAssured.toString(),
                              premium: policy.premium.toString(),
                              premiumFrequency: policy.premiumFrequency,
                              policyTerm: policy.policyTerm.toString(),
                              premiumPayingTerm: policy.premiumPayingTerm.toString(),
                              startDate: policy.startDate,
                              nominees: policy.nominees.join(', '),
                              medicalDone: policy.medicalDone
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
                              description: "Life insurance policy has been deleted.",
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
            <DialogTitle>Life Insurance Policy Details</DialogTitle>
          </DialogHeader>
          {viewingPolicy && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Policy Number</Label>
                  <p className="text-lg font-medium">{viewingPolicy.policyNo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Client Name</Label>
                  <p className="text-lg">{viewingPolicy.clientName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Age & Gender</Label>
                  <p className="text-lg">{viewingPolicy.clientAge} years • {viewingPolicy.clientGender}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Plan Details</Label>
                  <p className="text-lg">{viewingPolicy.planName}</p>
                  <Badge variant="outline" className={`mt-1 ${getPolicyTypeColor(viewingPolicy.policyType)}`}>
                    {viewingPolicy.policyType}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Nominees</Label>
                  <div className="mt-1">
                    {viewingPolicy.nominees.map((nominee, idx) => (
                      <div key={idx} className="text-sm bg-accent p-2 rounded mb-1">
                        {nominee}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Sum Assured</Label>
                  <p className="text-lg font-bold text-success">{formatCurrency(viewingPolicy.sumAssured)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Premium</Label>
                  <p className="text-lg font-bold text-primary">
                    {formatCurrency(viewingPolicy.premium)} ({viewingPolicy.premiumFrequency})
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Policy Terms</Label>
                  <div className="text-sm space-y-1">
                    <div>Policy Term: {viewingPolicy.policyTerm} years</div>
                    <div>Premium Paying Term: {viewingPolicy.premiumPayingTerm} years</div>
                    <div>Start Date: {new Date(viewingPolicy.startDate).toLocaleDateString()}</div>
                    <div>Maturity Date: {new Date(viewingPolicy.maturityDate).toLocaleDateString()}</div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge className={`mt-1 ${getStatusColor(viewingPolicy.status)}`}>
                    {viewingPolicy.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Premium Paid</Label>
                  <p className="text-sm">{new Date(viewingPolicy.lastPremiumPaid).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LifeInsuranceManagement;
