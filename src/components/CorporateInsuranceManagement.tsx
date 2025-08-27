import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, Building2, Calendar, Shield, AlertTriangle, Eye, TrendingUp, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CorporatePolicy {
  id: string;
  policyNo: string;
  companyName: string;
  businessType: string;
  registrationNo: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  policyType: 'Property' | 'Liability' | 'Professional Indemnity' | 'Directors & Officers' | 'Cyber Liability' | 'Marine' | 'Commercial Vehicle';
  coverageDetails: string;
  sumInsured: number;
  premium: number;
  deductible: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expired' | 'Under Review' | 'Claim Processing' | 'Suspended';
  riskAssessment: 'Low' | 'Medium' | 'High';
  lastClaimDate?: string;
  claimsCount: number;
  renewalDate: string;
  brokerName?: string;
}

const CorporateInsuranceManagement = () => {
  const [policies, setPolicies] = useState<CorporatePolicy[]>([
    {
      id: '1',
      policyNo: 'CORP-2024-001',
      companyName: 'TechVision Solutions Ltd',
      businessType: 'Software Development',
      registrationNo: 'REG-123456',
      contactPerson: 'Ahmed Khan',
      contactEmail: 'ahmed@techvision.com',
      contactPhone: '+92-21-1234567',
      policyType: 'Professional Indemnity',
      coverageDetails: 'Professional liability coverage for software development services',
      sumInsured: 50000000,
      premium: 350000,
      deductible: 250000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'Active',
      riskAssessment: 'Medium',
      lastClaimDate: '2024-03-15',
      claimsCount: 1,
      renewalDate: '2024-12-01',
      brokerName: 'Premium Insurance Brokers'
    },
    {
      id: '2',
      policyNo: 'CORP-2024-002',
      companyName: 'Global Manufacturing Co',
      businessType: 'Manufacturing',
      registrationNo: 'REG-789012',
      contactPerson: 'Sara Malik',
      contactEmail: 'sara@globalmanuf.com',
      contactPhone: '+92-42-9876543',
      policyType: 'Property',
      coverageDetails: 'Property insurance for manufacturing facility and equipment',
      sumInsured: 100000000,
      premium: 750000,
      deductible: 500000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'Active',
      riskAssessment: 'High',
      claimsCount: 0,
      renewalDate: '2024-12-01'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<CorporatePolicy | null>(null);
  const [viewingPolicy, setViewingPolicy] = useState<CorporatePolicy | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    policyNo: '',
    companyName: '',
    businessType: '',
    registrationNo: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    policyType: '',
    coverageDetails: '',
    sumInsured: '',
    premium: '',
    deductible: '',
    startDate: '',
    endDate: '',
    riskAssessment: '',
    brokerName: ''
  });

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.policyNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.businessType.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  const calculateRenewalDate = (endDate: string) => {
    const end = new Date(endDate);
    const renewal = new Date(end.getTime() - (30 * 24 * 60 * 60 * 1000)); // 30 days before end
    return renewal.toISOString().split('T')[0];
  };

  const resetForm = () => {
    setFormData({
      policyNo: '',
      companyName: '',
      businessType: '',
      registrationNo: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      policyType: '',
      coverageDetails: '',
      sumInsured: '',
      premium: '',
      deductible: '',
      startDate: '',
      endDate: '',
      riskAssessment: '',
      brokerName: ''
    });
    setEditingPolicy(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const renewalDate = calculateRenewalDate(formData.endDate);
    
    if (editingPolicy) {
      setPolicies(policies.map(p => p.id === editingPolicy.id ? {
        ...editingPolicy,
        ...formData,
        sumInsured: parseFloat(formData.sumInsured),
        premium: parseFloat(formData.premium),
        deductible: parseFloat(formData.deductible),
        renewalDate
      } : p));
      
      toast({
        title: "Corporate Policy Updated",
        description: "Corporate insurance policy has been successfully updated.",
      });
    } else {
      const newPolicy: CorporatePolicy = {
        id: Date.now().toString(),
        ...formData,
        sumInsured: parseFloat(formData.sumInsured),
        premium: parseFloat(formData.premium),
        deductible: parseFloat(formData.deductible),
        renewalDate,
        status: 'Active',
        claimsCount: 0
      } as CorporatePolicy;
      
      setPolicies([...policies, newPolicy]);
      
      toast({
        title: "Corporate Policy Added",
        description: "New corporate insurance policy has been successfully created.",
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Claim Processing': return 'bg-blue-100 text-blue-800';
      case 'Suspended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-50 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'High': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPolicyTypeColor = (type: string) => {
    const colors = {
      'Property': 'bg-blue-50 text-blue-700 border-blue-200',
      'Liability': 'bg-orange-50 text-orange-700 border-orange-200',
      'Professional Indemnity': 'bg-purple-50 text-purple-700 border-purple-200',
      'Directors & Officers': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Cyber Liability': 'bg-cyan-50 text-cyan-700 border-cyan-200',
      'Marine': 'bg-teal-50 text-teal-700 border-teal-200',
      'Commercial Vehicle': 'bg-green-50 text-green-700 border-green-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center">
              <Building2 className="h-6 w-6 lg:h-8 lg:w-8 text-indigo-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-indigo-600">Total Policies</p>
                <p className="text-lg lg:text-2xl font-bold text-indigo-700">{policies.length}</p>
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
              <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
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
              <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600" />
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
                <Building2 className="h-5 w-5 lg:h-6 lg:w-6 text-indigo-600" />
                Corporate Insurance Management
              </CardTitle>
              <CardDescription className="text-sm">
                Manage corporate insurance policies, risk assessments, and business protection
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Add Corporate Policy</span>
                  <span className="sm:hidden">Add Policy</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingPolicy ? 'Edit Corporate Insurance Policy' : 'Add New Corporate Insurance Policy'}
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
                      <Label htmlFor="registrationNo">Registration Number</Label>
                      <Input
                        id="registrationNo"
                        value={formData.registrationNo}
                        onChange={(e) => setFormData({...formData, registrationNo: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type</Label>
                      <Select value={formData.businessType} onValueChange={(value) => setFormData({...formData, businessType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="Software Development">Software Development</SelectItem>
                          <SelectItem value="Construction">Construction</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Financial Services">Financial Services</SelectItem>
                          <SelectItem value="Transportation">Transportation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Contact Person</Label>
                      <Input
                        id="contactPerson"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policyType">Policy Type</Label>
                      <Select value={formData.policyType} onValueChange={(value) => setFormData({...formData, policyType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select policy type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Property">Property Insurance</SelectItem>
                          <SelectItem value="Liability">General Liability</SelectItem>
                          <SelectItem value="Professional Indemnity">Professional Indemnity</SelectItem>
                          <SelectItem value="Directors & Officers">Directors & Officers</SelectItem>
                          <SelectItem value="Cyber Liability">Cyber Liability</SelectItem>
                          <SelectItem value="Marine">Marine Insurance</SelectItem>
                          <SelectItem value="Commercial Vehicle">Commercial Vehicle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="riskAssessment">Risk Assessment</Label>
                      <Select value={formData.riskAssessment} onValueChange={(value) => setFormData({...formData, riskAssessment: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low Risk</SelectItem>
                          <SelectItem value="Medium">Medium Risk</SelectItem>
                          <SelectItem value="High">High Risk</SelectItem>
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
                      <Label htmlFor="deductible">Deductible (PKR)</Label>
                      <Input
                        id="deductible"
                        type="number"
                        value={formData.deductible}
                        onChange={(e) => setFormData({...formData, deductible: e.target.value})}
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
                    <div className="space-y-2">
                      <Label htmlFor="brokerName">Broker (Optional)</Label>
                      <Input
                        id="brokerName"
                        value={formData.brokerName}
                        onChange={(e) => setFormData({...formData, brokerName: e.target.value})}
                        placeholder="Insurance broker name"
                      />
                    </div>
                    <div className="col-span-1 lg:col-span-3 space-y-2">
                      <Label htmlFor="coverageDetails">Coverage Details</Label>
                      <Input
                        id="coverageDetails"
                        value={formData.coverageDetails}
                        onChange={(e) => setFormData({...formData, coverageDetails: e.target.value})}
                        placeholder="Detailed description of coverage"
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
                  placeholder="Search by policy no., company name, contact person, or business type..."
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
                <SelectItem value="Property">Property Insurance</SelectItem>
                <SelectItem value="Liability">General Liability</SelectItem>
                <SelectItem value="Professional Indemnity">Professional Indemnity</SelectItem>
                <SelectItem value="Directors & Officers">Directors & Officers</SelectItem>
                <SelectItem value="Cyber Liability">Cyber Liability</SelectItem>
                <SelectItem value="Marine">Marine Insurance</SelectItem>
                <SelectItem value="Commercial Vehicle">Commercial Vehicle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="min-w-[150px]">Policy Details</TableHead>
                  <TableHead className="min-w-[200px]">Company Information</TableHead>
                  <TableHead className="min-w-[150px]">Contact Details</TableHead>
                  <TableHead className="min-w-[120px]">Policy Type</TableHead>
                  <TableHead className="min-w-[150px]">Financial</TableHead>
                  <TableHead className="min-w-[100px]">Risk Level</TableHead>
                  <TableHead className="min-w-[140px]">Coverage Period</TableHead>
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
                        <div className="text-xs lg:text-sm text-muted-foreground">{policy.registrationNo}</div>
                        {policy.brokerName && (
                          <div className="text-xs text-muted-foreground">Broker: {policy.brokerName}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm lg:text-base">{policy.companyName}</div>
                        <div className="text-xs lg:text-sm text-muted-foreground">{policy.businessType}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm lg:text-base">{policy.contactPerson}</div>
                        <div className="text-xs lg:text-sm text-muted-foreground">{policy.contactEmail}</div>
                        <div className="text-xs text-muted-foreground">{policy.contactPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${getPolicyTypeColor(policy.policyType)}`}>
                        {policy.policyType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm lg:text-base">{formatCurrency(policy.premium)}</div>
                        <div className="text-xs lg:text-sm text-muted-foreground">
                          Coverage: {formatCurrency(policy.sumInsured)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Deductible: {formatCurrency(policy.deductible)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${getRiskColor(policy.riskAssessment)}`}>
                        {policy.riskAssessment}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs lg:text-sm">
                        <div>Start: {new Date(policy.startDate).toLocaleDateString()}</div>
                        <div>End: {new Date(policy.endDate).toLocaleDateString()}</div>
                        <div className="text-warning">Renewal: {new Date(policy.renewalDate).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">{policy.claimsCount}</div>
                        <div className="text-xs text-muted-foreground">Claims</div>
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
                              businessType: policy.businessType,
                              registrationNo: policy.registrationNo,
                              contactPerson: policy.contactPerson,
                              contactEmail: policy.contactEmail,
                              contactPhone: policy.contactPhone,
                              policyType: policy.policyType,
                              coverageDetails: policy.coverageDetails,
                              sumInsured: policy.sumInsured.toString(),
                              premium: policy.premium.toString(),
                              deductible: policy.deductible.toString(),
                              startDate: policy.startDate,
                              endDate: policy.endDate,
                              riskAssessment: policy.riskAssessment,
                              brokerName: policy.brokerName || ''
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
                              description: "Corporate insurance policy has been deleted.",
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
            <DialogTitle>Corporate Insurance Policy Details</DialogTitle>
          </DialogHeader>
          {viewingPolicy && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Policy Information</Label>
                  <p className="text-lg font-medium">{viewingPolicy.policyNo}</p>
                  <p className="text-sm text-muted-foreground">Registration: {viewingPolicy.registrationNo}</p>
                  {viewingPolicy.brokerName && (
                    <p className="text-sm text-muted-foreground">Broker: {viewingPolicy.brokerName}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Company Details</Label>
                  <p className="text-lg">{viewingPolicy.companyName}</p>
                  <p className="text-sm text-muted-foreground">Business Type: {viewingPolicy.businessType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Contact Information</Label>
                  <div className="space-y-1">
                    <p className="text-sm">{viewingPolicy.contactPerson}</p>
                    <p className="text-sm text-muted-foreground">{viewingPolicy.contactEmail}</p>
                    <p className="text-sm text-muted-foreground">{viewingPolicy.contactPhone}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Coverage Details</Label>
                  <p className="text-sm bg-accent p-3 rounded">{viewingPolicy.coverageDetails}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Policy Type</Label>
                  <Badge variant="outline" className={`${getPolicyTypeColor(viewingPolicy.policyType)} mb-2`}>
                    {viewingPolicy.policyType}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Financial Details</Label>
                  <div className="space-y-2">
                    <div>Sum Insured: <span className="font-bold text-success">{formatCurrency(viewingPolicy.sumInsured)}</span></div>
                    <div>Annual Premium: <span className="font-bold text-primary">{formatCurrency(viewingPolicy.premium)}</span></div>
                    <div>Deductible: <span className="font-bold text-warning">{formatCurrency(viewingPolicy.deductible)}</span></div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Risk Assessment</Label>
                  <Badge variant="outline" className={`mt-1 ${getRiskColor(viewingPolicy.riskAssessment)}`}>
                    {viewingPolicy.riskAssessment} Risk
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Coverage Period</Label>
                  <div className="text-sm space-y-1">
                    <div>Start Date: {new Date(viewingPolicy.startDate).toLocaleDateString()}</div>
                    <div>End Date: {new Date(viewingPolicy.endDate).toLocaleDateString()}</div>
                    <div>Renewal Date: {new Date(viewingPolicy.renewalDate).toLocaleDateString()}</div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Claims History</Label>
                  <div className="text-sm space-y-1">
                    <div>Total Claims: {viewingPolicy.claimsCount}</div>
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

export default CorporateInsuranceManagement;
