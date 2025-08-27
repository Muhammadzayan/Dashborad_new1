import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Car, MapPin, Shield, Clock, CheckCircle, AlertTriangle, Plus, Navigation } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const CarTrackerService = () => {
  const { addQuoteLead, addUserService } = useData();
  const { user } = useAuth();
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    registrationNo: '',
    currentLocation: '',
    trackingPlan: '',
    contactNumber: '',
    specialRequirements: ''
  });

  const trackingPlans = [
    { value: 'basic', label: 'Basic Tracking', price: 'PKR 2,500/month', features: ['Real-time location', 'Speed monitoring', 'Route history'] },
    { value: 'standard', label: 'Standard Tracking', price: 'PKR 4,500/month', features: ['All Basic features', 'Geofencing alerts', 'Driver behavior analysis', 'Mobile app access'] },
    { value: 'premium', label: 'Premium Tracking', price: 'PKR 7,500/month', features: ['All Standard features', 'Advanced analytics', 'Fleet management', '24/7 monitoring', 'Emergency response'] },
  ];

  const resetForm = () => {
    setFormData({
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: '',
      registrationNo: '',
      currentLocation: '',
      trackingPlan: '',
      contactNumber: '',
      specialRequirements: ''
    });
    setIsSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const selectedPlan = trackingPlans.find(p => p.value === formData.trackingPlan);
      const message = `Car Tracker Request:
Vehicle: ${formData.vehicleMake} ${formData.vehicleModel} (${formData.vehicleYear})
Registration: ${formData.registrationNo}
Location: ${formData.currentLocation}
Plan: ${selectedPlan?.label} - ${selectedPlan?.price}
Contact: ${formData.contactNumber}
Special Requirements: ${formData.specialRequirements || 'None'}`;

      addQuoteLead({
        name: user?.name || 'Car Tracker Customer',
        email: user?.email || 'customer@example.com',
        phone: formData.contactNumber,
        insuranceType: 'car-tracker',
        message: message
      });

      // Also track this as a user service if user is logged in
      if (user?.id) {
        addUserService({
          userId: user.id,
          serviceType: 'car-tracker',
          serviceName: `Car Tracker - ${selectedPlan?.label}`,
          status: 'requested',
          details: {
            vehicle: `${formData.vehicleMake} ${formData.vehicleModel} (${formData.vehicleYear})`,
            registrationNo: formData.registrationNo,
            plan: selectedPlan?.label,
            price: selectedPlan?.price,
            location: formData.currentLocation,
            contactNumber: formData.contactNumber
          }
        });
      }

      setIsSuccess(true);
      
      toast({
        title: "Car Tracker Request Submitted!",
        description: "Our tracking specialists will contact you within 24 hours to schedule installation.",
      });

      setTimeout(() => {
        setIsRequestOpen(false);
        resetForm();
      }, 3000);

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsRequestOpen(open);
    if (!open) {
      resetForm();
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={isRequestOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-primary hover:bg-primary-dark">
            <Plus className="h-4 w-4 mr-2" />
            Request Car Tracker
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogHeader className="text-center">
              <DialogTitle className="text-xl text-green-700">Request Submitted!</DialogTitle>
              <DialogDescription className="text-base">
                Our car tracking specialists will contact you within 24 hours to schedule the installation and setup.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700 font-medium">What's next?</p>
              <ul className="mt-2 text-sm text-green-600 space-y-1">
                <li>• Technical consultation call</li>
                <li>• Installation scheduling</li>
                <li>• Device setup and testing</li>
                <li>• Training on mobile app</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-8 rounded-xl text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <Car className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Car Tracker Service</h1>
            <p className="text-blue-100 text-lg">Advanced vehicle tracking and monitoring solutions</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            <span className="text-sm">Real-time GPS tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="text-sm">Anti-theft protection</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span className="text-sm">24/7 monitoring</span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Real-time Location</h3>
            </div>
            <p className="text-muted-foreground">Track your vehicle's exact location 24/7 with pinpoint accuracy using advanced GPS technology.</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">Anti-theft Protection</h3>
            </div>
            <p className="text-muted-foreground">Immediate alerts for unauthorized movement, tampering, or theft attempts with instant notifications.</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Navigation className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold">Route Optimization</h3>
            </div>
            <p className="text-muted-foreground">Analyze driving patterns, optimize routes, and monitor fuel efficiency for better vehicle management.</p>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Plans */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Choose Your Tracking Plan</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {trackingPlans.map((plan, index) => (
            <Card key={plan.value} className={`shadow-card hover:shadow-lg transition-all ${index === 1 ? 'ring-2 ring-primary scale-105' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{plan.label}</CardTitle>
                    <CardDescription className="text-2xl font-bold text-primary mt-2">{plan.price}</CardDescription>
                  </div>
                  {index === 1 && <span className="bg-primary text-white text-xs px-2 py-1 rounded">Popular</span>}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Dialog open={isRequestOpen} onOpenChange={handleOpenChange}>
                  <DialogTrigger asChild>
                    <Button className="w-full mt-4 bg-gradient-primary" onClick={() => setFormData({...formData, trackingPlan: plan.value})}>
                      Select {plan.label}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-xl">
                        <Car className="h-6 w-6 text-primary" />
                        Request Car Tracker Installation
                      </DialogTitle>
                      <DialogDescription>
                        Fill out the details below and our specialists will contact you for installation scheduling.
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Vehicle Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Vehicle Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="vehicleMake">Vehicle Make *</Label>
                            <Select value={formData.vehicleMake} onValueChange={(value) => setFormData({...formData, vehicleMake: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select vehicle make" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Toyota">Toyota</SelectItem>
                                <SelectItem value="Honda">Honda</SelectItem>
                                <SelectItem value="Suzuki">Suzuki</SelectItem>
                                <SelectItem value="Hyundai">Hyundai</SelectItem>
                                <SelectItem value="Kia">Kia</SelectItem>
                                <SelectItem value="Nissan">Nissan</SelectItem>
                                <SelectItem value="Mercedes">Mercedes</SelectItem>
                                <SelectItem value="BMW">BMW</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="vehicleModel">Vehicle Model *</Label>
                            <Input
                              id="vehicleModel"
                              value={formData.vehicleModel}
                              onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})}
                              placeholder="e.g., Corolla, City, Cultus"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="vehicleYear">Vehicle Year *</Label>
                            <Input
                              id="vehicleYear"
                              value={formData.vehicleYear}
                              onChange={(e) => setFormData({...formData, vehicleYear: e.target.value})}
                              placeholder="e.g., 2020"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="registrationNo">Registration Number *</Label>
                            <Input
                              id="registrationNo"
                              value={formData.registrationNo}
                              onChange={(e) => setFormData({...formData, registrationNo: e.target.value})}
                              placeholder="e.g., ABC-123"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Contact & Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="contactNumber">Contact Number *</Label>
                            <Input
                              id="contactNumber"
                              type="tel"
                              value={formData.contactNumber}
                              onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                              placeholder="+92-300-1234567"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="currentLocation">Current Location *</Label>
                            <Input
                              id="currentLocation"
                              value={formData.currentLocation}
                              onChange={(e) => setFormData({...formData, currentLocation: e.target.value})}
                              placeholder="City, Area"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="specialRequirements">Special Requirements (Optional)</Label>
                          <Textarea
                            id="specialRequirements"
                            value={formData.specialRequirements}
                            onChange={(e) => setFormData({...formData, specialRequirements: e.target.value})}
                            placeholder="Any specific tracking needs or installation preferences..."
                            rows={3}
                          />
                        </div>
                      </div>

                      {/* Selected Plan */}
                      {formData.trackingPlan && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-900 mb-2">Selected Plan</h4>
                          {(() => {
                            const selected = trackingPlans.find(p => p.value === formData.trackingPlan);
                            return selected ? (
                              <div>
                                <p className="text-blue-800 font-medium">{selected.label} - {selected.price}</p>
                                <ul className="mt-2 text-sm text-blue-700 space-y-1">
                                  {selected.features.map((feature, idx) => (
                                    <li key={idx}>• {feature}</li>
                                  ))}
                                </ul>
                              </div>
                            ) : null;
                          })()}
                        </div>
                      )}

                      <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsRequestOpen(false)}
                          className="w-full sm:w-auto"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="w-full sm:w-auto bg-gradient-primary hover:bg-primary-dark" 
                          disabled={isLoading || !formData.vehicleMake || !formData.vehicleModel || !formData.contactNumber}
                        >
                          {isLoading ? 'Submitting Request...' : 'Request Installation'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Why Choose Our Car Tracker?</CardTitle>
          <CardDescription>Professional installation and monitoring services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Key Benefits:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Professional installation by certified technicians
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  24/7 monitoring and customer support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Mobile app for iOS and Android
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Insurance premium discounts available
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Theft recovery assistance
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Installation Process:</h4>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                  <span>Free consultation and vehicle assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                  <span>Professional device installation (1-2 hours)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                  <span>System testing and mobile app setup</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">4</span>
                  <span>Training and ongoing support</span>
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarTrackerService;
