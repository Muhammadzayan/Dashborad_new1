import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Quote, CheckCircle, Car, Bike, Heart, Plane, Building2, Activity, UserCheck, Shield } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface GetQuoteModalProps {
  children: React.ReactNode;
}

const GetQuoteModal: React.FC<GetQuoteModalProps> = ({ children }) => {
  const { addQuoteLead, addUserService } = useData();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    insuranceType: '',
    message: ''
  });

  const insuranceTypes = [
    { value: 'car-insurance', label: 'Car Insurance', icon: Car, color: 'text-blue-600' },
    { value: 'bike-insurance', label: 'Bike Insurance', icon: Bike, color: 'text-green-600' },
    { value: 'life-insurance', label: 'Life Insurance', icon: Heart, color: 'text-red-600' },
    { value: 'travel-insurance', label: 'Travel Insurance', icon: Plane, color: 'text-cyan-600' },
    { value: 'corporate-insurance', label: 'Corporate Insurance', icon: Building2, color: 'text-indigo-600' },
    { value: 'employee-health', label: 'Employee Health', icon: Activity, color: 'text-pink-600' },
    { value: 'employee-life', label: 'Employee Life', icon: UserCheck, color: 'text-orange-600' },
    { value: 'general-insurance', label: 'General Insurance', icon: Shield, color: 'text-purple-600' }
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      insuranceType: '',
      message: ''
    });
    setIsSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Add lead to the system
      addQuoteLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        insuranceType: formData.insuranceType,
        message: formData.message
      });

      // Also track this as a user service if user is logged in
      if (user?.id) {
        const serviceType = insuranceTypes.find(t => t.value === formData.insuranceType);
        addUserService({
          userId: user.id,
          serviceType: formData.insuranceType,
          serviceName: serviceType?.label || 'Insurance Quote',
          status: 'requested',
          details: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            quoteType: 'general'
          }
        });
      }

      setIsSuccess(true);
      
      toast({
        title: "Quote Request Submitted!",
        description: "Our team will contact you within 24 hours with a personalized quote.",
      });

      // Auto close after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
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
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogHeader className="text-center">
              <DialogTitle className="text-xl text-green-700">Request Submitted!</DialogTitle>
              <DialogDescription className="text-base">
                Thank you for your interest! Our insurance experts will review your request and contact you within 24 hours with a personalized quote.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700 font-medium">
                What happens next?
              </p>
              <ul className="mt-2 text-sm text-green-600 space-y-1">
                <li>• Expert review of your requirements</li>
                <li>• Personalized quote preparation</li>
                <li>• Direct contact within 24 hours</li>
                <li>• No obligation consultation</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Quote className="h-6 w-6 text-primary" />
            Get Your Insurance Quote
          </DialogTitle>
          <DialogDescription>
            Fill out this form and our insurance experts will provide you with a personalized quote within 24 hours.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+92-300-1234567"
                required
              />
            </div>
          </div>

          {/* Insurance Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">Insurance Requirements</h3>
            <div className="space-y-2">
              <Label htmlFor="insuranceType">Type of Insurance *</Label>
              <Select value={formData.insuranceType} onValueChange={(value) => setFormData({...formData, insuranceType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select the type of insurance you need" />
                </SelectTrigger>
                <SelectContent>
                  {insuranceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className={`h-4 w-4 ${type.color}`} />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">Additional Details</h3>
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Please provide any specific requirements, coverage amounts, or additional information that would help us prepare your quote..."
                rows={4}
              />
            </div>
          </div>

          {/* Benefits Information */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Why Choose Agent IGI Life?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Competitive rates from leading insurers</li>
              <li>• Expert guidance from certified agents</li>
              <li>• Quick quote processing within 24 hours</li>
              <li>• Comprehensive coverage options</li>
              <li>• 24/7 customer support</li>
              <li>• No hidden fees or obligations</li>
            </ul>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-gradient-primary hover:bg-primary-dark" 
              disabled={isLoading || !formData.name || !formData.email || !formData.phone || !formData.insuranceType}
            >
              {isLoading ? 'Submitting...' : 'Get My Quote'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GetQuoteModal;
