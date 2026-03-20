import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BuyNow = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    product: "",
    quantity: "",
    specialNotes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: Add form submission logic here
    alert("Thank you for your inquiry! We will contact you shortly.");
    navigate("/");
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Full-screen overlay similar to menu */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-cobalt-deep z-50 flex items-center justify-center overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={() => navigate("/")}
          className="fixed top-6 left-6 md:left-12 flex items-center gap-2 text-foreground tracking-luxury text-sm font-sans uppercase hover:text-gold transition-colors duration-300 z-50"
        >
          <X className="w-5 h-5" />
          <span>Close</span>
        </button>

        {/* Form Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-3xl px-6 py-20 md:py-24"
        >
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-serif text-4xl md:text-6xl text-foreground mb-4"
            >
              Place Your <span className="text-gold">Order</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-foreground/80 font-sans text-sm md:text-base tracking-wide-luxury uppercase"
            >
              Premium Alkaline Spring Water Inquiry
            </motion.p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-foreground/90 font-sans text-sm uppercase tracking-luxury"
              >
                Full Name *
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="bg-background/50 border-gold/30 text-foreground font-sans focus:border-gold transition-colors"
                placeholder="John Doe"
              />
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <Label
                htmlFor="companyName"
                className="text-foreground/90 font-sans text-sm uppercase tracking-luxury"
              >
                Company Name
              </Label>
              <Input
                id="companyName"
                type="text"
                value={formData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                className="bg-background/50 border-gold/30 text-foreground font-sans focus:border-gold transition-colors"
                placeholder="Your Company"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-foreground/90 font-sans text-sm uppercase tracking-luxury"
              >
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="bg-background/50 border-gold/30 text-foreground font-sans focus:border-gold transition-colors"
                placeholder="john@example.com"
              />
            </div>

            {/* Product Selection */}
            <div className="space-y-2">
              <Label
                htmlFor="product"
                className="text-foreground/90 font-sans text-sm uppercase tracking-luxury"
              >
                Product *
              </Label>
              <Select
                value={formData.product}
                onValueChange={(value) => handleChange("product", value)}
                required
              >
                <SelectTrigger className="bg-background/50 border-gold/30 text-foreground font-sans focus:border-gold transition-colors">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent className="bg-card border-gold/30">
                  <SelectItem value="24-pack" className="font-sans">
                    24 Pack
                  </SelectItem>
                  <SelectItem value="individual-bottles" className="font-sans">
                    Individual Bottles
                  </SelectItem>
                  <SelectItem value="pallets" className="font-sans">
                    Pallets
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label
                htmlFor="quantity"
                className="text-foreground/90 font-sans text-sm uppercase tracking-luxury"
              >
                Quantity *
              </Label>
              <Input
                id="quantity"
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                className="bg-background/50 border-gold/30 text-foreground font-sans focus:border-gold transition-colors"
                placeholder="1"
              />
            </div>

            {/* Special Notes */}
            <div className="space-y-2">
              <Label
                htmlFor="specialNotes"
                className="text-foreground/90 font-sans text-sm uppercase tracking-luxury"
              >
                Special Notes
              </Label>
              <Textarea
                id="specialNotes"
                value={formData.specialNotes}
                onChange={(e) => handleChange("specialNotes", e.target.value)}
                className="bg-background/50 border-gold/30 text-foreground font-sans focus:border-gold transition-colors min-h-[120px]"
                placeholder="Any special requests or delivery instructions..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                className="w-full bg-gold hover:bg-gold-light text-cobalt-deep font-sans text-sm uppercase tracking-luxury py-6 transition-all duration-300"
              >
                Submit Inquiry
              </Button>
            </div>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-foreground/60 font-sans text-xs mt-8"
          >
            We will respond to your inquiry within 24-48 business hours.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BuyNow;
