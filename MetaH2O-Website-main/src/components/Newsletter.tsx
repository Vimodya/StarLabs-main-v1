import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";

const Newsletter = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Welcome to Meta H2O",
      description: "Thank you for subscribing to our newsletter.",
    });
    setEmail("");
  };

  return (
    <section
      ref={ref}
      id="sustainability"
      className="py-24 md:py-32 px-6 md:px-12 bg-background border-t border-border"
    >
      <div className="max-w-2xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-serif text-2xl md:text-3xl text-foreground mb-4"
        >
          Discover The World of Meta H2O
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-muted-foreground text-sm md:text-base mb-10"
        >
          Exclusive content, promotions, offers, and more from Meta H2O® Alkaline Spring Water.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-6 py-4 bg-secondary border border-border text-foreground placeholder:text-muted-foreground font-sans text-sm focus:outline-none focus:border-gold transition-colors duration-300"
          />
          <button
            type="submit"
            className="px-8 py-4 bg-gold text-cobalt-deep font-sans text-sm uppercase tracking-luxury hover:bg-gold-light transition-colors duration-300"
          >
            Subscribe
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default Newsletter;