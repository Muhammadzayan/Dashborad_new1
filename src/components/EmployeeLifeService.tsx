import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserCheck, Users, Shield, Heart, CheckCircle, Building2, Plus, TrendingUp } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const EmployeeLifeService = () => {
  const { addQuoteLead, addUserService } = useData();
  const { user } = useAuth();
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    companyName: '',
    businessType: '',
    numberOfEmployees: '',
    contactPerson: '',
    designation: '',
    contactNumber: '',
    email: '',
    coveragePlan: '',
    currentProvider: '',
    specialRequirements: ''
  });

  const coveragePlans = [
    { 
      value: 'basic', 
      label: 'Basic Life Coverage', 
      price: 'PKR 500/employee/month', 
      coverage: 'PKR 500,000',
      features: ['Life insurance coverage', 'Accidental death benefit', 'Basic claims processing', 'Online portal access'] 
    },
    { 
      value: 'standard', 
      label: 'Standard Life Coverage', 
      price: 'PKR 850/employee/month', 
      coverage: 'PKR 1,000,000',
      features: ['All Basic features', 'Terminal illness benefit', 'Family support services', 'Wellness programs', 'Flexible beneficiary options'] 
    },
    { 
      value: 'premium', 
      label: 'Premium Life Coverage', 
      price: 'PKR 1,200/employee/month', 
      coverage: 'PKR 2,000,000',
      features: ['All Standard features', 'Critical illness coverage', 'Mental health support', 'Employee assistance program', 'Annual health checkups', 'Retirement planning'] 
    },
  ];

  const businessTypes = [
    'Technology/IT',
    'Manufacturing',
    'Healthcare',
    'Education',
    'Financial Services',
    'Retail/E-commerce',
    'Construction',
    'Transportation',
    'Hospitality',
    'Consulting',
    'Other'
  ];

  const resetForm = () => {
    setFormData({
      companyName: '',
      businessType: '',
      numberOfEmployees: '',
      contactPerson: '',
      designation: '',
      contactNumber: '',
      email: '',
      coveragePlan: '',
      currentProvider: '',
      specialRequirements: ''
    });
    setIsSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const selectedPlan = coveragePlans.find(p => p.value === formData.coveragePlan);
      const message = `Employee Life Insurance Request:
Company: ${formData.companyName}
Business Type: ${formData.businessType}
Number of Employees: ${formData.numberOfEmployees}
Contact Person: ${formData.contactPerson} (${formData.designation})
Contact: ${formData.contactNumber}
Email: ${formData.email}
Coverage Plan: ${selectedPlan?.label} - ${selectedPlan?.price}
Coverage Amount: ${selectedPlan?.coverage}
Current Provider: ${formData.currentProvider || 'None'}
Special Requirements: ${formData.specialRequirements || 'None'}`;

      addQuoteLead({
        name: formData.contactPerson,
        email: formData.email,
        phone: formData.contactNumber,
        insuranceType: 'employee-life',
        message: message
      });

      // Also track this as a user service if user is logged in
      if (user?.id) {
        addUserService({
          userId: user.id,
          serviceType: 'employee-life',
          serviceName: `Employee Life Insurance - ${selectedPlan?.label}`,
          status: 'requested',
          details: {
            company: formData.companyName,
            businessType: formData.businessType,
            employees: formData.numberOfEmployees,
            contactPerson: formData.contactPerson,
            plan: selectedPlan?.label,
            price: selectedPlan?.price,
            coverage: selectedPlan?.coverage,
            email: formData.email,
            phone: formData.contactNumber
          }
        });
      }

      setIsSuccess(true);
      
      toast({
        title: "Employee Life Insurance Request Submitted!",
        description: "Our corporate insurance specialists will contact you within 24 hours with a detailed proposal.",
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
            Get Employee Coverage
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
                Our corporate insurance specialists will contact you within 24 hours with a comprehensive proposal tailored to your company's needs.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700 font-medium">What's next?</p>
              <ul className="mt-2 text-sm text-green-600 space-y-1">
                <li>• Detailed needs assessment</li>
                <li>• Customized coverage proposal</li>
                <li>• Competitive pricing analysis</li>
                <li>• Implementation timeline</li>
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
      <div className="bg-gradient-to-r from-orange-500 to-red-600 p-8 rounded-xl text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <UserCheck className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Employee Life Insurance</h1>
            <p className="text-orange-100 text-lg">Comprehensive life coverage for your workforce</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="text-sm">Up to PKR 2M coverage</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span className="text-sm">Group benefits</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            <span className="text-sm">Employee wellness</span>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold">Life Protection</h3>
            </div>
            <p className="text-muted-foreground">Comprehensive life insurance coverage for all employees with competitive premiums.</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Corporate Benefits</h3>
            </div>
            <p className="text-muted-foreground">Attract and retain top talent with comprehensive employee life insurance benefits.</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">Tax Benefits</h3>
            </div>
            <p className="text-muted-foreground">Enjoy tax deductions on premiums and provide tax-free benefits to employees.</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold">Employee Welfare</h3>
            </div>
            <p className="text-muted-foreground">Show your commitment to employee welfare and their families' financial security.</p>
          </CardContent>
        </Card>
      </div>

      {/* Coverage Plans */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Choose Your Coverage Plan</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {coveragePlans.map((plan, index) => (
            <Card key={plan.value} className={`shadow-card hover:shadow-lg transition-all ${index === 1 ? 'ring-2 ring-primary scale-105' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{plan.label}</CardTitle>
                    <CardDescription className="text-lg font-bold text-primary mt-1">{plan.price}</CardDescription>
                    <CardDescription className="text-sm text-muted-foreground">Coverage: {plan.coverage}</CardDescription>
                  </div>
                  {index === 1 && <span className="bg-primary text-white text-xs px-2 py-1 rounded">Recommended</span>}
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
                    <Button className="w-full mt-4 bg-gradient-primary" onClick={() => setFormData({...formData, coveragePlan: plan.value})}>
                      Get Quote for {plan.label}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-xl">
                        <UserCheck className="h-6 w-6 text-primary" />
                        Employee Life Insurance Quote
                      </DialogTitle>
                      <DialogDescription>
                        Provide your company details to receive a customized employee life insurance proposal.
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Company Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Company Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="companyName">Company Name *</Label>
                            <Input
                              id="companyName"
                              value={formData.companyName}
                              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                              placeholder="Enter company name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="businessType">Business Type *</Label>
                            <Select value={formData.businessType} onValueChange={(value) => setFormData({...formData, businessType: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select business type" />
                              </SelectTrigger>
                              <SelectContent>
                                {businessTypes.map((type) => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="numberOfEmployees">Number of Employees *</Label>
                          <Select value={formData.numberOfEmployees} onValueChange={(value) => setFormData({...formData, numberOfEmployees: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select employee count" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-10">1-10 employees</SelectItem>
                              <SelectItem value="11-25">11-25 employees</SelectItem>
                              <SelectItem value="26-50">26-50 employees</SelectItem>
                              <SelectItem value="51-100">51-100 employees</SelectItem>
                              <SelectItem value="101-250">101-250 employees</SelectItem>
                              <SelectItem value="251-500">251-500 employees</SelectItem>
                              <SelectItem value="500+">500+ employees</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Contact Person Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="contactPerson">Contact Person *</Label>
                            <Input
                              id="contactPerson"
                              value={formData.contactPerson}
                              onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                              placeholder="Full name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="designation">Designation *</Label>
                            <Input
                              id="designation"
                              value={formData.designation}
                              onChange={(e) => setFormData({...formData, designation: e.target.value})}
                              placeholder="e.g., HR Manager, CEO"
                              required
                            />
                          </div>
                        </div>
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
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              placeholder="contact@company.com"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>
                        <div className="space-y-2">
                          <Label htmlFor="currentProvider">Current Insurance Provider (Optional)</Label>
                          <Input
                            id="currentProvider"
                            value={formData.currentProvider}
                            onChange={(e) => setFormData({...formData, currentProvider: e.target.value})}
                            placeholder="Current provider name, if any"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="specialRequirements">Special Requirements (Optional)</Label>
                          <Textarea
                            id="specialRequirements"
                            value={formData.specialRequirements}
                            onChange={(e) => setFormData({...formData, specialRequirements: e.target.value})}
                            placeholder="Any specific coverage needs, employee age demographics, or other requirements..."
                            rows={3}
                          />
                        </div>
                      </div>

                      {/* Selected Plan */}
                      {formData.coveragePlan && (
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                          <h4 className="font-semibold text-orange-900 mb-2">Selected Plan</h4>
                          {(() => {
                            const selected = coveragePlans.find(p => p.value === formData.coveragePlan);
                            return selected ? (
                              <div>
                                <p className="text-orange-800 font-medium">{selected.label} - {selected.price}</p>
                                <p className="text-orange-700 text-sm mb-2">Coverage: {selected.coverage}</p>
                                <ul className="text-sm text-orange-700 space-y-1">
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
                          disabled={isLoading || !formData.companyName || !formData.contactPerson || !formData.email}
                        >
                          {isLoading ? 'Submitting Request...' : 'Get Custom Quote'}
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

      {/* Why Choose Us */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Why Choose Our Employee Life Insurance?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Comprehensive Coverage</p>
                  <p className="text-sm text-muted-foreground">Life, accidental death, and terminal illness benefits</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Flexible Plans</p>
                  <p className="text-sm text-muted-foreground">Customizable coverage amounts and benefits</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Easy Claims</p>
                  <p className="text-sm text-muted-foreground">Simple online claims process with quick settlements</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Employee Wellness</p>
                  <p className="text-sm text-muted-foreground">Additional wellness programs and health checkups</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Implementation Process</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                <div>
                  <p className="font-medium">Needs Assessment</p>
                  <p className="text-sm text-muted-foreground">Analyze your company's specific requirements</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                <div>
                  <p className="font-medium">Custom Proposal</p>
                  <p className="text-sm text-muted-foreground">Receive tailored coverage options and pricing</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                <div>
                  <p className="font-medium">Employee Enrollment</p>
                  <p className="text-sm text-muted-foreground">Seamless enrollment process for all employees</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                <div>
                  <p className="font-medium">Ongoing Support</p>
                  <p className="text-sm text-muted-foreground">Dedicated account management and support</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeLifeService;
