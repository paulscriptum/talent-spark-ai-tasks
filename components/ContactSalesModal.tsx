"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Send, Mail, Building, MessageSquare } from "lucide-react";

interface ContactSalesModalProps {
  children: React.ReactNode;
}

export default function ContactSalesModal({ children }: ContactSalesModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    companyName: "",
    request: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.companyName || !formData.request) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    // Simulate form submission
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Your request has been recorded! We'll get back to you within 24 hours.");
    setFormData({ email: "", companyName: "", request: "" });
    setIsOpen(false);
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Contact Enterprise Sales
          </DialogTitle>
          <DialogDescription>
            Tell us about your organization&apos;s needs and we&apos;ll get back to you with a custom solution.
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
                onChange={(e) => handleInputChange("email", e.target.value)}
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
                onChange={(e) => handleInputChange("companyName", e.target.value)}
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
                placeholder="Describe your organization's requirements..."
                rows={4}
                value={formData.request}
                onChange={(e) => handleInputChange("request", e.target.value)}
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
            <Button type="submit" disabled={isLoading} className="flex-1 btn-ai-gradient">
              {isLoading ? (
                "Sending..."
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
}
