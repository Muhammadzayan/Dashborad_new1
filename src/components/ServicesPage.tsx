import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Car, 
  Bike, 
  Heart, 
  Plane, 
  Building2, 
  Activity, 
  UserCheck, 
  Shield, 
  Search,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  Navigation,
  Users,
  TrendingUp
} from 'lucide-react';
import GetQuoteModal from './GetQuoteModal';
import { useAuth } from '@/contexts/AuthContext';

const ServicesPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const services = [
    {
      id: 'car-insurance',
      name: 'Car Insurance',
      category: 'Vehicle',
      icon: Car,
      color: 'bg-blue-500',
      price: 'From PKR 8,000/year',
      rating: 4.8,
      features: ['Comprehensive Coverage', 'Third Party', 'Roadside Assistance', 'Quick Claims'],
      description: 'Protect your vehicle with comprehensive car insurance coverage.',
      benefits: ['Accident coverage', 'Theft protection', '24/7 claim support', 'Cashless repairs'],
      popular: true
    },
    {
      id: 'bike-insurance',
      name: 'Bike Insurance',
      category: 'Vehicle',
      icon: Bike,
      color: 'bg-green-500',
      price: 'From PKR 3,500/year',
      rating: 4.7,
      features: ['Comprehensive Coverage', 'Third Party', 'Personal Accident', 'Zero Depreciation'],
      description: 'Affordable motorcycle insurance with complete protection.',
      benefits: ['Accident coverage', 'Theft protection', 'Personal injury cover', 'Quick settlements']
    },
    {
      id: 'life-insurance',
      name: 'Life Insurance',
      category: 'Life & Health',
      icon: Heart,
      color: 'bg-red-500',
      price: 'From PKR 2,000/month',
      rating: 4.9,
      features: ['Term Life', 'Whole Life', 'Investment Plans', 'Critical Illness'],
      description: 'Secure your family\'s financial future with life insurance.',
      benefits: ['Family protection', 'Tax benefits', 'Flexible premiums', 'Maturity benefits'],
      popular: true
    },
    {
      id: 'travel-insurance',
      name: 'Travel Insurance',
      category: 'Travel',
      icon: Plane,
      color: 'bg-cyan-500',
      price: 'From PKR 500/trip',
      rating: 4.6,
      features: ['Medical Coverage', 'Trip Cancellation', 'Baggage Protection', 'Emergency Evacuation'],
      description: 'Travel with confidence knowing you\'re protected worldwide.',
      benefits: ['Medical emergencies', 'Trip cancellation', 'Lost baggage', '24/7 assistance']
    },
    {
      id: 'corporate-insurance',
      name: 'Corporate Insurance',
      category: 'Business',
      icon: Building2,
      color: 'bg-indigo-500',
      price: 'Custom pricing',
      rating: 4.8,
      features: ['Business Protection', 'Liability Coverage', 'Property Insurance', 'Cyber Security'],
      description: 'Comprehensive business insurance solutions for enterprises.',
      benefits: ['Business continuity', 'Asset protection', 'Liability coverage', 'Risk management']
    },
    {
      id: 'employee-health',
      name: 'Employee Health',
      category: 'Health',
      icon: Activity,
      color: 'bg-pink-500',
      price: 'From PKR 800/employee/month',
      rating: 4.7,
      features: ['Group Health', 'Wellness Programs', 'Preventive Care', 'Cashless Treatment'],
      description: 'Keep your workforce healthy with group health insurance.',
      benefits: ['Employee wellness', 'Cashless treatment', 'Preventive care', 'Family coverage']
    },
    {
      id: 'employee-life',
      name: 'Employee Life',
      category: 'Life & Health',
      icon: UserCheck,
      color: 'bg-orange-500',
      price: 'From PKR 500/employee/month',
      rating: 4.8,
      features: ['Group Life', 'Accidental Death', 'Terminal Illness', 'Family Benefits'],
      description: 'Provide life insurance benefits to your employees.',
      benefits: ['Employee security', 'Tax benefits', 'Group discounts', 'Easy enrollment']
    },
    {
      id: 'car-tracker',
      name: 'Car Tracker Service',
      category: 'Technology',
      icon: Navigation,
      color: 'bg-purple-500',
      price: 'From PKR 2,500/month',
      rating: 4.9,
      features: ['Real-time Tracking', 'Anti-theft Protection', 'Route Monitoring', 'Mobile App'],
      description: 'Advanced GPS tracking and security for your vehicle.',
      benefits: ['Theft protection', 'Real-time location', 'Route optimization', 'Emergency alerts'],
      popular: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Services', count: services.length },
    { id: 'Vehicle', name: 'Vehicle Insurance', count: services.filter(s => s.category === 'Vehicle').length },
    { id: 'Life & Health', name: 'Life & Health', count: services.filter(s => s.category === 'Life & Health').length },
    { id: 'Business', name: 'Business Insurance', count: services.filter(s => s.category === 'Business').length },
    { id: 'Health', name: 'Health Insurance', count: services.filter(s => s.category === 'Health').length },
    { id: 'Travel', name: 'Travel Insurance', count: services.filter(s => s.category === 'Travel').length },
    { id: 'Technology', name: 'Technology Services', count: services.filter(s => s.category === 'Technology').length },
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.features.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-8 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Insurance Services</h1>
            <p className="text-blue-100 text-lg">Explore our comprehensive range of insurance products and services</p>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">{services.length} Services Available</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm">Trusted by 10,000+ customers</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm">Award-winning service</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200 mb-1">Welcome back</div>
            <div className="text-xl font-semibold">{user?.name}</div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search services, features, or benefits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className="whitespace-nowrap"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Services */}
      {selectedCategory === 'all' && !searchTerm && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Popular Services</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {services.filter(s => s.popular).map((service) => (
              <Card key={service.id} className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-yellow-500 text-yellow-900">Popular</Badge>
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center`}>
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(service.rating)}</div>
                        <span className="text-sm text-muted-foreground">({service.rating})</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-primary">{service.price}</span>
                    <Badge variant="outline">{service.category}</Badge>
                  </div>
                  <GetQuoteModal>
                    <Button className="w-full bg-gradient-primary">
                      Get Quote
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </GetQuoteModal>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Services Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {selectedCategory === 'all' ? 'All Services' : `${selectedCategory} Services`}
          <span className="text-lg font-normal text-muted-foreground ml-2">
            ({filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'})
          </span>
        </h2>
        
        {filteredServices.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="text-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No services found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search criteria or browse different categories.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => (
              <Card key={service.id} className="shadow-card hover:shadow-lg transition-all duration-300 hover:scale-105 relative">
                {service.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-yellow-500 text-yellow-900">Popular</Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${service.color} rounded-lg flex items-center justify-center`}>
                      <service.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">{renderStars(service.rating)}</div>
                        <span className="text-xs text-muted-foreground">({service.rating})</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {service.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Benefits:</h4>
                    <div className="flex flex-wrap gap-1">
                      {service.benefits.slice(0, 2).map((benefit, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="font-bold text-primary">{service.price}</span>
                    <Badge variant="outline" className="text-xs">{service.category}</Badge>
                  </div>

                  <GetQuoteModal>
                    <Button className="w-full bg-gradient-primary hover:bg-primary-dark">
                      Request Quote
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </GetQuoteModal>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Why Choose Us */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Why Choose Agent IGI Life Insurance?</CardTitle>
          <CardDescription>
            We're committed to providing exceptional insurance services with unmatched customer support.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Trusted Protection</h4>
              <p className="text-sm text-muted-foreground">15+ years of reliable insurance services</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Quick Claims</h4>
              <p className="text-sm text-muted-foreground">Fast claim processing within 24-48 hours</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Expert Support</h4>
              <p className="text-sm text-muted-foreground">Dedicated insurance advisors available 24/7</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold mb-2">Best Prices</h4>
              <p className="text-sm text-muted-foreground">Competitive rates with maximum coverage</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesPage;
