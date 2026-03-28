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
import { Send, Mail, Building, MessageSquare, Sparkles } from "lucide-react";

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
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Request sent! We\u0027ll get back to you within 24 hours.");
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
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-lg border-border/40 rounded-2xl">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">Contact Enterprise Sales</DialogTitle>
              <DialogDescription className="mt-1">
                Tell us about your needs and we&apos;ll create a custom solution.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Work Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="h-11 rounded-xl form-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName" className="flex items-center gap-2 text-sm font-medium">
                <Building className="h-4 w-4 text-muted-foreground" />
                Company Name
              </Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Your Company Inc."
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                required
                className="h-11 rounded-xl form-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="request" className="flex items-center gap-2 text-sm font-medium">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                Tell us about your needs
              </Label>
              <Textarea
                id="request"
                placeholder="Describe your organization&apos;s requirements..."
                rows={4}
                value={formData.request}
                onChange={(e) => handleInputChange("request", e.target.value)}
                required
                className="rounded-xl form-input resize-none"
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 h-11 rounded-xl"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 h-11 btn-ai-gradient rounded-xl">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 animate-spin" />Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" />Send Request
                </span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
