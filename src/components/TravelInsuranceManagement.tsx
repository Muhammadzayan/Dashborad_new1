import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, Plane, MapPin, Calendar, Shield, Globe, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TravelPolicy {
  id: string;
  policyNo: string;
  clientName: string;
  destination: string;
  travelType: 'Domestic' | 'International';
  tripPurpose: 'Tourism' | 'Business' | 'Medical' | 'Education' | 'Other';
  coverageType: 'Single Trip' | 'Multi Trip' | 'Annual';
  premium: number;
  sumAssured: number;
  medicalCoverage: number;
  departureDate: string;
  returnDate: string;
  travelDuration: number;
  status: 'Active' | 'Expired' | 'Claim Filed' | 'Completed';
  emergencyContact: string;
}

const TravelInsuranceManagement = () => {
  const [policies, setPolicies] = useState<TravelPolicy[]>([
    {
      id: '1',
      policyNo: 'TRV-2024-001',
      clientName: 'Sana Ahmed',
      destination: 'Dubai, UAE',
      travelType: 'International',
      tripPurpose: 'Tourism',
      coverageType: 'Single Trip',
      premium: 15000,
      sumAssured: 1000000,
      medicalCoverage: 500000,
      departureDate: '2024-03-15',
      returnDate: '2024-03-25',
      travelDuration: 10,
      status: 'Active',
      emergencyContact: '+92-300-1234567'
    },
    {
      id: '2',
      policyNo: 'TRV-2024-002',
      clientName: 'Imran Khan',
      destination: 'London, UK',
      travelType: 'International',
      tripPurpose: 'Business',
      coverageType: 'Multi Trip',
      premium: 45000,
      sumAssured: 2000000,
      medicalCoverage: 1000000,
      departureDate: '2024-02-01',
      returnDate: '2024-02-15',
      travelDuration: 14,
      status: 'Completed',
      emergencyContact: '+92-321-9876543'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<TravelPolicy | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    policyNo: '',
    clientName: '',
    destination: '',
    travelType: '',
    tripPurpose: '',
    coverageType: '',
    premium: '',
    sumAssured: '',
    medicalCoverage: '',
    departureDate: '',
    returnDate: '',
    status: 'Active',
    emergencyContact: ''
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateDuration = (departure: string, returnDate: string) => {
    const start = new Date(departure);
    const end = new Date(returnDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.policyNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDestination = destinationFilter === 'all' || policy.travelType === destinationFilter;

    return matchesSearch && matchesDestination;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Claim Filed': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const resetForm = () => {
    setFormData({
      policyNo: '',
      clientName: '',
      destination: '',
      travelType: '',
      tripPurpose: '',
      coverageType: '',
      premium: '',
      sumAssured: '',
      medicalCoverage: '',
      departureDate: '',
      returnDate: '',
      status: 'Active',
      emergencyContact: ''
    });
    setEditingPolicy(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const duration = calculateDuration(formData.departureDate, formData.returnDate);
    
    if (editingPolicy) {
      setPolicies(policies.map(p => p.id === editingPolicy.id ? {
        ...editingPolicy,
        ...formData,
        premium: parseFloat(formData.premium),
        sumAssured: parseFloat(formData.sumAssured),
        medicalCoverage: parseFloat(formData.medicalCoverage),
        travelDuration: duration
      } : p));
      
      toast({
        title: "Travel Policy Updated",
        description: "Travel insurance policy has been successfully updated.",
      });
    } else {
      const newPolicy: TravelPolicy = {
        id: Date.now().toString(),
        ...formData,
        premium: parseFloat(formData.premium),
        sumAssured: parseFloat(formData.sumAssured),
        medicalCoverage: parseFloat(formData.medicalCoverage),
        travelDuration: duration
      } as TravelPolicy;
      
      setPolicies([...policies, newPolicy]);
      
      toast({
        title: "Travel Policy Added",
        description: "New travel insurance policy has been successfully created.",
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Plane className="h-8 w-8 text-cyan-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-cyan-600">Total Policies</p>
                <p className="text-2xl font-bold text-cyan-700">{policies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">International</p>
                <p className="text-2xl font-bold text-blue-700">
                  {policies.filter(p => p.travelType === 'International').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600">Active Trips</p>
                <p className="text-2xl font-bold text-green-700">
                  {policies.filter(p => p.status === 'Active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">Total Premium</p>
                <p className="text-2xl font-bold text-purple-700">
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-6 w-6 text-cyan-600" />
                Travel Insurance Management
              </CardTitle>
              <CardDescription>
                Manage travel insurance policies, destinations, and coverage
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Travel Policy
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingPolicy ? 'Edit Travel Insurance Policy' : 'Add New Travel Insurance Policy'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-3 gap-4 py-4">
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
                      <Label htmlFor="destination">Destination</Label>
                      <Input
                        id="destination"
                        value={formData.destination}
                        onChange={(e) => setFormData({...formData, destination: e.target.value})}
                        placeholder="e.g., Dubai, UAE"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="travelType">Travel Type</Label>
                      <Select value={formData.travelType} onValueChange={(value) => setFormData({...formData, travelType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Domestic">Domestic</SelectItem>
                          <SelectItem value="International">International</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tripPurpose">Trip Purpose</Label>
                      <Select value={formData.tripPurpose} onValueChange={(value) => setFormData({...formData, tripPurpose: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tourism">Tourism</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Medical">Medical</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
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
                          <SelectItem value="Single Trip">Single Trip</SelectItem>
                          <SelectItem value="Multi Trip">Multi Trip</SelectItem>
                          <SelectItem value="Annual">Annual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="departureDate">Departure Date</Label>
                      <Input
                        id="departureDate"
                        type="date"
                        value={formData.departureDate}
                        onChange={(e) => setFormData({...formData, departureDate: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="returnDate">Return Date</Label>
                      <Input
                        id="returnDate"
                        type="date"
                        value={formData.returnDate}
                        onChange={(e) => setFormData({...formData, returnDate: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                        placeholder="+92-300-1234567"
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
                      <Label htmlFor="medicalCoverage">Medical Coverage (PKR)</Label>
                      <Input
                        id="medicalCoverage"
                        type="number"
                        value={formData.medicalCoverage}
                        onChange={(e) => setFormData({...formData, medicalCoverage: e.target.value})}
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
                  placeholder="Search by policy no., client name, or destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={destinationFilter} onValueChange={setDestinationFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Destinations</SelectItem>
                <SelectItem value="Domestic">Domestic</SelectItem>
                <SelectItem value="International">International</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Policy Details</TableHead>
                  <TableHead>Travel Information</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead>Financial</TableHead>
                  <TableHead>Travel Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolicies.map((policy) => (
                  <TableRow key={policy.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div>
                        <div className="font-medium">{policy.policyNo}</div>
                        <div className="text-sm text-muted-foreground">{policy.clientName}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{policy.destination}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {policy.travelType} • {policy.tripPurpose}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {policy.emergencyContact}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline">{policy.coverageType}</Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          Medical: {formatCurrency(policy.medicalCoverage)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{formatCurrency(policy.premium)}</div>
                        <div className="text-sm text-muted-foreground">
                          Sum Assured: {formatCurrency(policy.sumAssured)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{policy.travelDuration} days</span>
                        </div>
                        <div>Departure: {new Date(policy.departureDate).toLocaleDateString()}</div>
                        <div>Return: {new Date(policy.returnDate).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(policy.status)}>
                        {policy.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingPolicy(policy);
                            setFormData({
                              policyNo: policy.policyNo,
                              clientName: policy.clientName,
                              destination: policy.destination,
                              travelType: policy.travelType,
                              tripPurpose: policy.tripPurpose,
                              coverageType: policy.coverageType,
                              premium: policy.premium.toString(),
                              sumAssured: policy.sumAssured.toString(),
                              medicalCoverage: policy.medicalCoverage.toString(),
                              departureDate: policy.departureDate,
                              returnDate: policy.returnDate,
                              status: policy.status,
                              emergencyContact: policy.emergencyContact
                            });
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPolicies(policies.filter(p => p.id !== policy.id));
                            toast({
                              title: "Policy Deleted",
                              description: "Travel insurance policy has been deleted.",
                            });
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
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
    </div>
  );
};

export default TravelInsuranceManagement;
