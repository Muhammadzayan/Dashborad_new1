import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, Bike, Calendar, Shield, AlertTriangle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BikePolicy {
  id: string;
  policyNo: string;
  clientName: string;
  bikeMake: string;
  bikeModel: string;
  bikeYear: string;
  registrationNo: string;
  engineCapacity: string;
  bikeType: 'Motorcycle' | 'Scooter' | 'Sports Bike' | 'Cruiser';
  coverageType: 'Comprehensive' | 'Third Party' | 'Theft Protection';
  premium: number;
  sumAssured: number;
  startDate: string;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Claim Pending';
  ncdPercentage: number;
}

const BikeInsuranceManagement = () => {
  const [policies, setPolicies] = useState<BikePolicy[]>([
    {
      id: '1',
      policyNo: 'BIKE-2024-001',
      clientName: 'Hassan Ali',
      bikeMake: 'Honda',
      bikeModel: 'CB 150F',
      bikeYear: '2023',
      registrationNo: 'KHI-2023',
      engineCapacity: '150cc',
      bikeType: 'Motorcycle',
      coverageType: 'Comprehensive',
      premium: 25000,
      sumAssured: 350000,
      startDate: '2024-01-15',
      expiryDate: '2025-01-15',
      status: 'Active',
      ncdPercentage: 15
    },
    {
      id: '2',
      policyNo: 'BIKE-2024-002',
      clientName: 'Aisha Khan',
      bikeMake: 'Yamaha',
      bikeModel: 'YBR 125',
      bikeYear: '2022',
      registrationNo: 'LHR-1234',
      engineCapacity: '125cc',
      bikeType: 'Motorcycle',
      coverageType: 'Third Party',
      premium: 15000,
      sumAssured: 250000,
      startDate: '2024-02-01',
      expiryDate: '2025-02-01',
      status: 'Active',
      ncdPercentage: 10
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [coverageFilter, setCoverageFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<BikePolicy | null>(null);
  const [viewingPolicy, setViewingPolicy] = useState<BikePolicy | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    policyNo: '',
    clientName: '',
    bikeMake: '',
    bikeModel: '',
    bikeYear: '',
    registrationNo: '',
    engineCapacity: '',
    bikeType: '',
    coverageType: '',
    premium: '',
    sumAssured: '',
    startDate: '',
    expiryDate: '',
    status: 'Active',
    ncdPercentage: ''
  });

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.policyNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.bikeMake.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.registrationNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCoverage = coverageFilter === 'all' || policy.coverageType === coverageFilter;

    return matchesSearch && matchesCoverage;
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
      clientName: '',
      bikeMake: '',
      bikeModel: '',
      bikeYear: '',
      registrationNo: '',
      engineCapacity: '',
      bikeType: '',
      coverageType: '',
      premium: '',
      sumAssured: '',
      startDate: '',
      expiryDate: '',
      status: 'Active',
      ncdPercentage: ''
    });
    setEditingPolicy(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPolicy) {
      setPolicies(policies.map(p => p.id === editingPolicy.id ? {
        ...editingPolicy,
        ...formData,
        premium: parseFloat(formData.premium),
        sumAssured: parseFloat(formData.sumAssured),
        ncdPercentage: parseFloat(formData.ncdPercentage)
      } : p));
      
      toast({
        title: "Bike Policy Updated",
        description: "Bike insurance policy has been successfully updated.",
      });
    } else {
      const newPolicy: BikePolicy = {
        id: Date.now().toString(),
        ...formData,
        premium: parseFloat(formData.premium),
        sumAssured: parseFloat(formData.sumAssured),
        ncdPercentage: parseFloat(formData.ncdPercentage)
      } as BikePolicy;
      
      setPolicies([...policies, newPolicy]);
      
      toast({
        title: "Bike Policy Added",
        description: "New bike insurance policy has been successfully created.",
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Claim Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center">
              <Bike className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-green-600">Total Policies</p>
                <p className="text-lg lg:text-2xl font-bold text-green-700">{policies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center">
              <Shield className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-blue-600">Active Policies</p>
                <p className="text-lg lg:text-2xl font-bold text-blue-700">
                  {policies.filter(p => p.status === 'Active').length}
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
                <p className="text-xs lg:text-sm font-medium text-purple-600">Total Premium</p>
                <p className="text-lg lg:text-2xl font-bold text-purple-700">
                  {formatCurrency(policies.reduce((sum, p) => sum + p.premium, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-orange-600">Claims Pending</p>
                <p className="text-lg lg:text-2xl font-bold text-orange-700">
                  {policies.filter(p => p.status === 'Claim Pending').length}
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
                <Bike className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
                Bike Insurance Management
              </CardTitle>
              <CardDescription className="text-sm">
                Manage motorcycle and bike insurance policies, coverage, and claims
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Add Bike Policy</span>
                  <span className="sm:hidden">Add Policy</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingPolicy ? 'Edit Bike Insurance Policy' : 'Add New Bike Insurance Policy'}
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
                      <Label htmlFor="registrationNo">Registration No.</Label>
                      <Input
                        id="registrationNo"
                        value={formData.registrationNo}
                        onChange={(e) => setFormData({...formData, registrationNo: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bikeMake">Bike Make</Label>
                      <Select value={formData.bikeMake} onValueChange={(value) => setFormData({...formData, bikeMake: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select make" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Honda">Honda</SelectItem>
                          <SelectItem value="Yamaha">Yamaha</SelectItem>
                          <SelectItem value="Suzuki">Suzuki</SelectItem>
                          <SelectItem value="Kawasaki">Kawasaki</SelectItem>
                          <SelectItem value="Harley Davidson">Harley Davidson</SelectItem>
                          <SelectItem value="KTM">KTM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bikeModel">Bike Model</Label>
                      <Input
                        id="bikeModel"
                        value={formData.bikeModel}
                        onChange={(e) => setFormData({...formData, bikeModel: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bikeYear">Bike Year</Label>
                      <Input
                        id="bikeYear"
                        value={formData.bikeYear}
                        onChange={(e) => setFormData({...formData, bikeYear: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="engineCapacity">Engine Capacity</Label>
                      <Select value={formData.engineCapacity} onValueChange={(value) => setFormData({...formData, engineCapacity: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select capacity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="70cc">70cc</SelectItem>
                          <SelectItem value="100cc">100cc</SelectItem>
                          <SelectItem value="125cc">125cc</SelectItem>
                          <SelectItem value="150cc">150cc</SelectItem>
                          <SelectItem value="200cc">200cc</SelectItem>
                          <SelectItem value="250cc+">250cc+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bikeType">Bike Type</Label>
                      <Select value={formData.bikeType} onValueChange={(value) => setFormData({...formData, bikeType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                          <SelectItem value="Scooter">Scooter</SelectItem>
                          <SelectItem value="Sports Bike">Sports Bike</SelectItem>
                          <SelectItem value="Cruiser">Cruiser</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coverageType">Coverage Type</Label>
                      <Select value={formData.coverageType} onValueChange={(value) => setFormData({...formData, coverageType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select coverage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                          <SelectItem value="Third Party">Third Party</SelectItem>
                          <SelectItem value="Theft Protection">Theft Protection</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ncdPercentage">NCD Percentage</Label>
                      <Input
                        id="ncdPercentage"
                        type="number"
                        value={formData.ncdPercentage}
                        onChange={(e) => setFormData({...formData, ncdPercentage: e.target.value})}
                        placeholder="0-50"
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
                  placeholder="Search by policy no., client name, bike make, or registration..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={coverageFilter} onValueChange={setCoverageFilter}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Coverage Types</SelectItem>
                <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                <SelectItem value="Third Party">Third Party</SelectItem>
                <SelectItem value="Theft Protection">Theft Protection</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="min-w-[150px]">Policy Details</TableHead>
                  <TableHead className="min-w-[180px]">Bike Information</TableHead>
                  <TableHead className="min-w-[120px]">Coverage</TableHead>
                  <TableHead className="min-w-[150px]">Financial</TableHead>
                  <TableHead className="min-w-[140px]">Dates</TableHead>
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
                        <div className="text-xs lg:text-sm text-muted-foreground">{policy.clientName}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm lg:text-base">{policy.bikeMake} {policy.bikeModel}</div>
                        <div className="text-xs lg:text-sm text-muted-foreground">
                          {policy.bikeYear} • {policy.registrationNo}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {policy.engineCapacity} • {policy.bikeType}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline" className="text-xs">{policy.coverageType}</Badge>
                        {policy.ncdPercentage > 0 && (
                          <div className="text-xs text-green-600 mt-1">
                            NCD: {policy.ncdPercentage}%
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm lg:text-base">{formatCurrency(policy.premium)}</div>
                        <div className="text-xs lg:text-sm text-muted-foreground">
                          Sum: {formatCurrency(policy.sumAssured)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs lg:text-sm">
                        <div>Start: {new Date(policy.startDate).toLocaleDateString()}</div>
                        <div>Expiry: {new Date(policy.expiryDate).toLocaleDateString()}</div>
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
                              bikeMake: policy.bikeMake,
                              bikeModel: policy.bikeModel,
                              bikeYear: policy.bikeYear,
                              registrationNo: policy.registrationNo,
                              engineCapacity: policy.engineCapacity,
                              bikeType: policy.bikeType,
                              coverageType: policy.coverageType,
                              premium: policy.premium.toString(),
                              sumAssured: policy.sumAssured.toString(),
                              startDate: policy.startDate,
                              expiryDate: policy.expiryDate,
                              status: policy.status,
                              ncdPercentage: policy.ncdPercentage.toString()
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
                              description: "Bike insurance policy has been deleted.",
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bike Insurance Policy Details</DialogTitle>
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
                  <Label className="text-sm font-medium text-muted-foreground">Bike</Label>
                  <p className="text-lg">{viewingPolicy.bikeMake} {viewingPolicy.bikeModel} ({viewingPolicy.bikeYear})</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Registration</Label>
                  <p className="text-lg font-mono">{viewingPolicy.registrationNo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Engine & Type</Label>
                  <p className="text-lg">{viewingPolicy.engineCapacity} • {viewingPolicy.bikeType}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Coverage Type</Label>
                  <Badge variant="outline" className="mt-1">{viewingPolicy.coverageType}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Premium</Label>
                  <p className="text-lg font-bold text-primary">{formatCurrency(viewingPolicy.premium)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Sum Assured</Label>
                  <p className="text-lg font-bold text-success">{formatCurrency(viewingPolicy.sumAssured)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">NCD Percentage</Label>
                  <p className="text-lg text-green-600">{viewingPolicy.ncdPercentage}%</p>
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

export default BikeInsuranceManagement;
