import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Search,
  Mail,
  Phone,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Car,
  Bike,
  Heart,
  Plane,
  Building2,
  Activity,
  UserCheck,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { QuoteLead } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';

const LeadsManagement = () => {
  const { quoteLeads, updateQuoteLead, deleteQuoteLead } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<QuoteLead | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const { toast } = useToast();

  const getInsuranceIcon = (type: string) => {
    switch (type) {
      case 'car-insurance': return Car;
      case 'bike-insurance': return Bike;
      case 'life-insurance': return Heart;
      case 'travel-insurance': return Plane;
      case 'corporate-insurance': return Building2;
      case 'employee-health': return Activity;
      case 'employee-life': return UserCheck;
      default: return Shield;
    }
  };

  const getInsuranceLabel = (type: string) => {
    const labels: Record<string, string> = {
      'car-insurance': 'Car Insurance',
      'bike-insurance': 'Bike Insurance',
      'life-insurance': 'Life Insurance',
      'travel-insurance': 'Travel Insurance',
      'corporate-insurance': 'Corporate Insurance',
      'employee-health': 'Employee Health',
      'employee-life': 'Employee Life',
      'general-insurance': 'General Insurance'
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'quoted': return 'bg-purple-100 text-purple-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return Clock;
      case 'contacted': return AlertCircle;
      case 'quoted': return Mail;
      case 'converted': return CheckCircle;
      case 'closed': return XCircle;
      default: return Clock;
    }
  };

  const filteredLeads = quoteLeads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      getInsuranceLabel(lead.insuranceType).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (leadId: string, newStatus: QuoteLead['status']) => {
    updateQuoteLead(leadId, { status: newStatus });
    toast({
      title: "Status Updated",
      description: `Lead status has been updated to ${newStatus}.`,
    });
  };

  const handleDelete = (leadId: string) => {
    deleteQuoteLead(leadId);
    // Remove from selected leads if it was selected
    setSelectedLeads(prev => prev.filter(id => id !== leadId));
    toast({
      title: "Lead Deleted",
      description: "Lead has been successfully deleted.",
    });
  };

  const handleBulkDelete = () => {
    selectedLeads.forEach(leadId => {
      deleteQuoteLead(leadId);
    });
    setSelectedLeads([]);
    setShowBulkDelete(false);
    toast({
      title: "Leads Deleted",
      description: `${selectedLeads.length} leads have been successfully deleted.`,
    });
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  const handleViewLead = (lead: QuoteLead) => {
    setSelectedLead(lead);
    setIsViewDialogOpen(true);
  };

  // Statistics
  const stats = {
    total: quoteLeads.length,
    new: quoteLeads.filter(l => l.status === 'new').length,
    contacted: quoteLeads.filter(l => l.status === 'contacted').length,
    quoted: quoteLeads.filter(l => l.status === 'quoted').length,
    converted: quoteLeads.filter(l => l.status === 'converted').length,
    closed: quoteLeads.filter(l => l.status === 'closed').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Leads</p>
                <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">New</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.new}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Contacted</p>
                <p className="text-2xl font-bold text-orange-700">{stats.contacted}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Quoted</p>
                <p className="text-2xl font-bold text-purple-700">{stats.quoted}</p>
              </div>
              <Mail className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Converted</p>
                <p className="text-2xl font-bold text-green-700">{stats.converted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Closed</p>
                <p className="text-2xl font-bold text-gray-700">{stats.closed}</p>
              </div>
              <XCircle className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quote Leads Management</CardTitle>
              <CardDescription>
                Manage and track insurance quote requests from potential customers
              </CardDescription>
            </div>
            {selectedLeads.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedLeads.length} selected</Badge>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowBulkDelete(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6 p-4 bg-accent rounded-lg">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, phone, or insurance type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Insurance Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => {
                  const InsuranceIcon = getInsuranceIcon(lead.insuranceType);
                  const StatusIcon = getStatusIcon(lead.status);
                  
                  return (
                    <TableRow key={lead.id} className={`hover:bg-muted/30 ${selectedLeads.includes(lead.id) ? 'bg-blue-50' : ''}`}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => handleSelectLead(lead.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {lead.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <InsuranceIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm">{getInsuranceLabel(lead.insuranceType)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {lead.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {lead.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={lead.status}
                          onValueChange={(value: QuoteLead['status']) => handleStatusUpdate(lead.id, value)}
                        >
                          <SelectTrigger className="w-auto">
                            <Badge className={getStatusColor(lead.status)}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {lead.status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="quoted">Quoted</SelectItem>
                            <SelectItem value="converted">Converted</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewLead(lead)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(lead.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No leads found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search criteria or filters.' 
                  : 'Quote requests will appear here as customers submit them.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Lead Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>
              Complete information about this quote request
            </DialogDescription>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                  <p className="text-lg font-medium">{selectedLead.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Insurance Type</Label>
                  <div className="flex items-center gap-2">
                    {React.createElement(getInsuranceIcon(selectedLead.insuranceType), { 
                      className: "h-4 w-4 text-primary" 
                    })}
                    <span>{getInsuranceLabel(selectedLead.insuranceType)}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p>{selectedLead.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                  <p>{selectedLead.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date Submitted</Label>
                  <p>{new Date(selectedLead.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge className={getStatusColor(selectedLead.status)}>
                    {React.createElement(getStatusIcon(selectedLead.status), { 
                      className: "h-3 w-3 mr-1" 
                    })}
                    {selectedLead.status}
                  </Badge>
                </div>
              </div>

              {/* Message */}
              {selectedLead.message && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Message</Label>
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p className="text-sm">{selectedLead.message}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Customer
                </Button>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={showBulkDelete} onOpenChange={setShowBulkDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirm Bulk Delete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedLeads.length} selected lead{selectedLeads.length !== 1 ? 's' : ''}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> This will permanently delete all selected leads and their associated data.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete {selectedLeads.length} Lead{selectedLeads.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadsManagement;
