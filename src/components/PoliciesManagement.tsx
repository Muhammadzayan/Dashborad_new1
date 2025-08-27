import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, Filter, SortAsc, SortDesc, Calendar, Clock, AlertTriangle, Eye } from 'lucide-react';
import { mockPolicies, mockClients, Policy } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { isExpiringSoon, isExpired, getDaysUntil, formatDate } from '@/utils/dateUtils';

const PoliciesManagement = () => {
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [viewingPolicy, setViewingPolicy] = useState<Policy | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    policyNo: '',
    clientId: '',
    policyType: '',
    sumAssured: '',
    premium: '',
    startDate: '',
    maturityDate: '',
    status: 'Active'
  });

  // Enhanced filtering and sorting
  const filteredAndSortedPolicies = useMemo(() => {
    let filtered = policies.filter(policy => {
      const matchesSearch = policy.policyNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           policy.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           policy.policyType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || policy.status === statusFilter ||
                           (statusFilter === 'expiring' && isExpiringSoon(policy.maturityDate)) ||
                           (statusFilter === 'expired' && isExpired(policy.maturityDate));
      
      const matchesType = typeFilter === 'all' || policy.policyType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    // Sort policies
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof Policy];
      let bValue = b[sortBy as keyof Policy];

      if (sortBy === 'premium' || sortBy === 'sumAssured') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [policies, searchTerm, statusFilter, typeFilter, sortBy, sortOrder]);

  const resetForm = () => {
    setFormData({
      policyNo: '',
      clientId: '',
      policyType: '',
      sumAssured: '',
      premium: '',
      startDate: '',
      maturityDate: '',
      status: 'Active'
    });
    setEditingPolicy(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleView = (policy: Policy) => {
    setViewingPolicy(policy);
  };

  const handleEdit = (policy: Policy) => {
    setEditingPolicy(policy);
    setFormData({
      policyNo: policy.policyNo,
      clientId: policy.clientId,
      policyType: policy.policyType,
      sumAssured: policy.sumAssured.toString(),
      premium: policy.premium.toString(),
      startDate: policy.startDate,
      maturityDate: policy.maturityDate,
      status: policy.status
    });
    setIsDialogOpen(true);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getPolicyStatusColor = (policy: Policy) => {
    if (isExpired(policy.maturityDate)) return 'bg-destructive text-destructive-foreground';
    if (isExpiringSoon(policy.maturityDate)) return 'bg-warning text-warning-foreground';
    if (policy.status === 'Active') return 'bg-success text-success-foreground';
    return 'bg-muted text-muted-foreground';
  };

  const handleDelete = (policyId: string) => {
    setPolicies(policies.filter(p => p.id !== policyId));
    toast({
      title: "Policy Deleted",
      description: "Policy has been successfully deleted.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const clientName = mockClients.find(c => c.id === formData.clientId)?.name || '';

    if (editingPolicy) {
      // Update existing policy
      setPolicies(policies.map(p => p.id === editingPolicy.id ? {
        ...editingPolicy,
        policyNo: formData.policyNo,
        clientId: formData.clientId,
        clientName,
        policyType: formData.policyType as 'Life' | 'Health' | 'Savings',
        sumAssured: parseFloat(formData.sumAssured),
        premium: parseFloat(formData.premium),
        startDate: formData.startDate,
        maturityDate: formData.maturityDate,
        status: formData.status as 'Active' | 'Expired'
      } : p));
      
      toast({
        title: "Policy Updated",
        description: "Policy has been successfully updated.",
      });
    } else {
      // Add new policy
      const newPolicy: Policy = {
        id: Date.now().toString(),
        policyNo: formData.policyNo,
        clientId: formData.clientId,
        clientName,
        policyType: formData.policyType as 'Life' | 'Health' | 'Savings',
        sumAssured: parseFloat(formData.sumAssured),
        premium: parseFloat(formData.premium),
        startDate: formData.startDate,
        maturityDate: formData.maturityDate,
        status: formData.status as 'Active' | 'Expired',
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setPolicies([...policies, newPolicy]);
      
      toast({
        title: "Policy Added",
        description: "New policy has been successfully created.",
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Policies Management</CardTitle>
              <CardDescription>
                Manage insurance policies with advanced filtering and timing alerts
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAdd} className="bg-gradient-primary hover:bg-primary-dark">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Policy
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingPolicy ? 'Edit Policy' : 'Add New Policy'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingPolicy ? 'Update policy information.' : 'Create a new insurance policy.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4 py-4">
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
                      <Label htmlFor="clientId">Client</Label>
                      <Select value={formData.clientId} onValueChange={(value) => setFormData({...formData, clientId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockClients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policyType">Policy Type</Label>
                      <Select value={formData.policyType} onValueChange={(value) => setFormData({...formData, policyType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select policy type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Life">Life Insurance</SelectItem>
                          <SelectItem value="Health">Health Insurance</SelectItem>
                          <SelectItem value="Savings">Savings Plan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <Label htmlFor="maturityDate">Maturity Date</Label>
                      <Input
                        id="maturityDate"
                        type="date"
                        value={formData.maturityDate}
                        onChange={(e) => setFormData({...formData, maturityDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-primary hover:bg-primary-dark">
                      {editingPolicy ? 'Update Policy' : 'Create Policy'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Enhanced Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6 p-4 bg-accent rounded-lg">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search policies by number, client name, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="expiring">Expiring Soon</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Life">Life</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Savings">Savings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Enhanced Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-primary/10 p-4 rounded-lg animate-scale-in">
              <div className="text-2xl font-bold text-primary">{filteredAndSortedPolicies.length}</div>
              <div className="text-sm text-muted-foreground">Total Policies</div>
            </div>
            <div className="bg-success/10 p-4 rounded-lg animate-scale-in" style={{animationDelay: '100ms'}}>
              <div className="text-2xl font-bold text-success">
                {filteredAndSortedPolicies.filter(p => p.status === 'Active').length}
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="bg-warning/10 p-4 rounded-lg animate-scale-in" style={{animationDelay: '200ms'}}>
              <div className="text-2xl font-bold text-warning">
                {filteredAndSortedPolicies.filter(p => isExpiringSoon(p.maturityDate)).length}
              </div>
              <div className="text-sm text-muted-foreground">Expiring Soon</div>
            </div>
            <div className="bg-destructive/10 p-4 rounded-lg animate-scale-in" style={{animationDelay: '300ms'}}>
              <div className="text-2xl font-bold text-destructive">
                {filteredAndSortedPolicies.filter(p => isExpired(p.maturityDate)).length}
              </div>
              <div className="text-sm text-muted-foreground">Expired</div>
            </div>
          </div>

          {/* Enhanced Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={() => handleSort('policyNo')}
                  >
                    <div className="flex items-center gap-2">
                      Policy No.
                      {sortBy === 'policyNo' && (
                        sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={() => handleSort('clientName')}
                  >
                    <div className="flex items-center gap-2">
                      Client
                      {sortBy === 'clientName' && (
                        sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={() => handleSort('sumAssured')}
                  >
                    <div className="flex items-center gap-2">
                      Sum Assured
                      {sortBy === 'sumAssured' && (
                        sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={() => handleSort('premium')}
                  >
                    <div className="flex items-center gap-2">
                      Premium
                      {sortBy === 'premium' && (
                        sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Timing</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedPolicies.map((policy, index) => (
                  <TableRow key={policy.id} className="animate-fade-in hover:bg-muted/30 transition-colors" style={{animationDelay: `${index * 50}ms`}}>
                    <TableCell className="font-medium">{policy.policyNo}</TableCell>
                    <TableCell>{policy.clientName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{policy.policyType}</Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(policy.sumAssured)}</TableCell>
                    <TableCell>{formatCurrency(policy.premium)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Start: {formatDate(policy.startDate)}
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          <span className={isExpiringSoon(policy.maturityDate) ? 'text-warning font-medium' : 'text-muted-foreground'}>
                            Expires: {formatDate(policy.maturityDate)}
                          </span>
                        </div>
                        {isExpiringSoon(policy.maturityDate) && (
                          <div className="flex items-center gap-1 text-xs text-warning">
                            <AlertTriangle className="h-3 w-3" />
                            {getDaysUntil(policy.maturityDate)} days left
                          </div>
                        )}
                        {isExpired(policy.maturityDate) && (
                          <div className="flex items-center gap-1 text-xs text-destructive">
                            <AlertTriangle className="h-3 w-3" />
                            Expired {Math.abs(getDaysUntil(policy.maturityDate))} days ago
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${getPolicyStatusColor(policy)} ${isExpiringSoon(policy.maturityDate) || isExpired(policy.maturityDate) ? 'animate-pulse-glow' : ''}`}
                      >
                        {isExpired(policy.maturityDate) ? 'Expired' :
                         isExpiringSoon(policy.maturityDate) ? 'Expiring' :
                         policy.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(policy)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(policy)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(policy.id)}
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

      {/* Policy View Dialog */}
      <Dialog open={!!viewingPolicy} onOpenChange={() => setViewingPolicy(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Policy Details</DialogTitle>
          </DialogHeader>
          {viewingPolicy && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Policy Number</Label>
                  <p className="text-lg font-medium">{viewingPolicy.policyNo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Client</Label>
                  <p className="text-lg">{viewingPolicy.clientName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Policy Type</Label>
                  <Badge variant="outline" className="mt-1">{viewingPolicy.policyType}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge className={`mt-1 ${getPolicyStatusColor(viewingPolicy)}`}>
                    {isExpired(viewingPolicy.maturityDate) ? 'Expired' :
                     isExpiringSoon(viewingPolicy.maturityDate) ? 'Expiring Soon' :
                     viewingPolicy.status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Sum Assured</Label>
                  <p className="text-lg font-bold text-success">{formatCurrency(viewingPolicy.sumAssured)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Premium</Label>
                  <p className="text-lg font-bold text-primary">{formatCurrency(viewingPolicy.premium)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Start Date</Label>
                  <p className="text-lg">{formatDate(viewingPolicy.startDate)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Maturity Date</Label>
                  <p className={`text-lg ${isExpiringSoon(viewingPolicy.maturityDate) ? 'text-warning font-medium' : ''}`}>
                    {formatDate(viewingPolicy.maturityDate)}
                  </p>
                  {isExpiringSoon(viewingPolicy.maturityDate) && (
                    <p className="text-sm text-warning">Expires in {getDaysUntil(viewingPolicy.maturityDate)} days</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PoliciesManagement;