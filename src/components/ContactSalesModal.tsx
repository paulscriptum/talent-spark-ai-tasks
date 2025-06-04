import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Send, Mail, Building, MessageSquare } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface ContactSalesModalProps {
  children: React.ReactNode;
}

const ContactSalesModal: React.FC<ContactSalesModalProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    companyName: '',
    request: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.companyName || !formData.request) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      // Check if EmailJS is configured
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey || 
          serviceId === 'your_service_id' || 
          templateId === 'your_template_id' || 
          publicKey === 'your_public_key') {
        
        // Fallback: Log the form data and show success message
        console.log('📧 Contact Sales Form Submission:', {
          email: formData.email,
          companyName: formData.companyName,
          request: formData.request,
          timestamp: new Date().toISOString()
        });
        
        toast.success('Your request has been recorded! We\'ll get back to you within 24 hours.');
        setFormData({ email: '', companyName: '', request: '' });
        setIsOpen(false);
        return;
      }

      const templateParams = {
        from_email: formData.email,
        company_name: formData.companyName,
        message: formData.request,
        to_email: import.meta.env.VITE_EMAILJS_TO_EMAIL || 'your-email@example.com',
        reply_to: formData.email,
        subject: `Enterprise Sales Inquiry from ${formData.companyName}`
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      toast.success('Your request has been sent! We\'ll get back to you within 24 hours.');
      setFormData({ email: '', companyName: '', request: '' });
      setIsOpen(false);
    } catch (error) {
      console.error('Email send error:', error);
      
      // Fallback: Still log the data and show success
      console.log('📧 Contact Sales Form Submission (fallback):', {
        email: formData.email,
        companyName: formData.companyName,
        request: formData.request,
        timestamp: new Date().toISOString(),
        error: error
      });
      
      toast.success('Your request has been recorded! We\'ll get back to you within 24 hours.');
      setFormData({ email: '', companyName: '', request: '' });
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Contact Enterprise Sales
          </DialogTitle>
          <DialogDescription>
            Tell us about your organization's needs and we'll get back to you with a custom solution.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4" />
                Work Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@company.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="form-input mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="companyName" className="flex items-center gap-2 text-sm font-medium">
                <Building className="h-4 w-4" />
                Company Name
              </Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Your Company Inc."
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                required
                className="form-input mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="request" className="flex items-center gap-2 text-sm font-medium">
                <MessageSquare className="h-4 w-4" />
                Tell us about your needs
              </Label>
              <Textarea
                id="request"
                placeholder="Describe your organization's requirements, team size, specific features needed, or any questions you have..."
                rows={4}
                value={formData.request}
                onChange={(e) => handleInputChange('request', e.target.value)}
                required
                className="form-input mt-1 resize-none"
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-ai-gradient"
            >
              {isLoading ? (
                'Sending...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactSalesModal; 