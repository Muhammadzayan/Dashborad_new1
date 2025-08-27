import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  User,
  Shield,
  Car,
  Bike,
  Heart,
  Plane,
  Building2,
  Activity,
  UserCheck,
  Navigation
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ServiceProvision = () => {
  const { clients, addUserService, getUserServices, updateUserService } = useData();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    serviceType: '',
    serviceName: '',
    coverage: '',
    premium: '',
    policyNo: '',
    startDate: '',
    expiryDate: '',
    details: ''
  });

  const serviceTypes = [
    { value: 'car-insurance', label: 'Car Insurance', icon: Car, color: 'bg-blue-500' },
    { value: 'bike-insurance', label: 'Bike Insurance', icon: Bike, color: 'bg-green-500' },
    { value: 'life-insurance', label: 'Life Insurance', icon: Heart, color: 'bg-red-500' },
    { value: 'travel-insurance', label: 'Travel Insurance', icon: Plane, color: 'bg-cyan-500' },
    { value: 'corporate-insurance', label: 'Corporate Insurance', icon: Building2, color: 'bg-indigo-500' },
    { value: 'employee-health', label: 'Employee Health', icon: Activity, color: 'bg-pink-500' },
    { value: 'employee-life', label: 'Employee Life', icon: UserCheck, color: 'bg-orange-500' },
    { value: 'car-tracker', label: 'Car Tracker Service', icon: Navigation, color: 'bg-purple-500' }
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const resetForm = () => {
    setFormData({
      serviceType: '',
      serviceName: '',
      coverage: '',
      premium: '',
      policyNo: '',
      startDate: '',
      expiryDate: '',
      details: ''
    });
    setSelectedClient('');
  };

  const handleProvideService = async () => {
    if (!selectedClient || !formData.serviceType || !formData.serviceName) {
      toast({
        title: "Missing Information",
        description: "Please select a client and fill in required service details.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const client = clients.find(c => c.id === selectedClient);
      const selectedServiceType = serviceTypes.find(s => s.value === formData.serviceType);

      const serviceDetails = {
        policyNo: formData.policyNo,
        coverage: formData.coverage,
        premium: formData.premium ? parseFloat(formData.premium) : 0,
        startDate: formData.startDate,
        expiryDate: formData.expiryDate,
        providedBy: user?.name,
        providedById: user?.id,
        serviceIcon: selectedServiceType?.value,
        additionalDetails: formData.details
      };

      // Generate policy number if not provided
      const policyNumber = formData.policyNo || `IGI-${formData.serviceType.toUpperCase()}-${Date.now()}`;

      addUserService({
        userId: selectedClient,
        serviceType: formData.serviceType,
        serviceName: formData.serviceName,
        status: 'active',
        activationDate: new Date().toISOString(),
        policyNo: policyNumber,
        details: serviceDetails
      });

      toast({
        title: "Service Provided Successfully!",
        description: `${formData.serviceName} has been provided to ${client?.name}. They can now see it in their portal.`,
      });

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to provide service. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getClientServices = (clientId: string) => {
    return getUserServices(clientId);
  };

  const handleStatusChange = (serviceId: string, newStatus: string) => {
    updateUserService(serviceId, { status: newStatus as any });
    toast({
      title: "Status Updated",
      description: "Service status has been updated successfully.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceIcon = (serviceType: string) => {
    const service = serviceTypes.find(s => s.value === serviceType);
    return service ? service.icon : Shield;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-8 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Service Provision</h1>
            <p className="text-blue-100 text-lg">Provide insurance services directly to clients</p>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">{clients.length} Active Clients</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Instant Activation</span>
              </div>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Plus className="h-4 w-4 mr-2" />
                Provide Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Provide Insurance Service</DialogTitle>
                <DialogDescription>
                  Select a client and provide them with an insurance service that will appear in their portal.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Client Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Select Client</h3>
                  <div className="space-y-2">
                    <Label htmlFor="clientSearch">Search Client</Label>
                    <Input
                      id="clientSearch"
                      placeholder="Search by name, email, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="max-h-32 overflow-y-auto border rounded-lg">
                    {filteredClients.length > 0 ? (
                      <div className="space-y-1 p-2">
                        {filteredClients.map((client) => (
                          <div
                            key={client.id}
                            className={`p-3 rounded cursor-pointer transition-colors ${
                              selectedClient === client.id 
                                ? 'bg-blue-100 border-blue-300' 
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedClient(client.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{client.name}</p>
                                <p className="text-sm text-gray-600">{client.email}</p>
                              </div>
                              {selectedClient === client.id && (
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No clients found. {searchTerm && 'Try adjusting your search.'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Service Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Service Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="serviceType">Service Type *</Label>
                      <Select value={formData.serviceType} onValueChange={(value) => setFormData({...formData, serviceType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map((service) => (
                            <SelectItem key={service.value} value={service.value}>
                              <div className="flex items-center gap-2">
                                <service.icon className="h-4 w-4" />
                                {service.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceName">Service Name *</Label>
                      <Input
                        id="serviceName"
                        value={formData.serviceName}
                        onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
                        placeholder="e.g., Comprehensive Car Insurance"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="policyNo">Policy Number</Label>
                      <Input
                        id="policyNo"
                        value={formData.policyNo}
                        onChange={(e) => setFormData({...formData, policyNo: e.target.value})}
                        placeholder="Auto-generated if empty"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="premium">Premium (PKR)</Label>
                      <Input
                        id="premium"
                        type="number"
                        value={formData.premium}
                        onChange={(e) => setFormData({...formData, premium: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="coverage">Coverage Amount (PKR)</Label>
                      <Input
                        id="coverage"
                        value={formData.coverage}
                        onChange={(e) => setFormData({...formData, coverage: e.target.value})}
                        placeholder="e.g., 1000000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="details">Additional Details</Label>
                    <Textarea
                      id="details"
                      value={formData.details}
                      onChange={(e) => setFormData({...formData, details: e.target.value})}
                      placeholder="Any additional information about this service..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleProvideService} 
                  disabled={isLoading || !selectedClient || !formData.serviceType}
                  className="bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  {isLoading ? 'Providing...' : 'Provide Service'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Clients and Their Services */}
      <div className="grid gap-6">
        {clients.map((client) => {
          const clientServices = getClientServices(client.id);
          return (
            <Card key={client.id} className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{client.name.charAt(0)}</span>
                    </div>
                    <div>
                      <CardTitle>{client.name}</CardTitle>
                      <CardDescription>{client.email} • {client.phone}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {clientServices.length} Service{clientServices.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {clientServices.length > 0 ? (
                  <div className="space-y-3">
                    {clientServices.map((service) => {
                      const ServiceIcon = getServiceIcon(service.serviceType);
                      return (
                        <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <ServiceIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{service.serviceName}</h4>
                              <p className="text-sm text-gray-600">
                                {service.policyNo && `Policy: ${service.policyNo} • `}
                                Provided: {new Date(service.requestDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select
                              value={service.status}
                              onValueChange={(value) => handleStatusChange(service.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <Badge className={getStatusColor(service.status)}>
                                  {service.status}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Shield className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No services provided to this client yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {clients.length === 0 && (
        <Card className="shadow-lg">
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Clients Found</h3>
            <p className="text-gray-600">Add clients first to provide them with insurance services.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServiceProvision;
