import { Link } from "react-router-dom";
import { Building2, Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-24">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-8 h-8 text-primary" />
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-tight">One2Z Solutions</span>
                <span className="text-xs text-muted-foreground">Constructions & Interiors</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Building spaces that last — design, execute, deliver. Residential, commercial & institutional construction
              with complete interior design solutions.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Home
              </Link>
              <Link to="/projects" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Projects
              </Link>
              <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Services
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Contact
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Services</h3>
            <nav className="flex flex-col gap-2">
              <span className="text-muted-foreground text-sm">Residential Construction</span>
              <span className="text-muted-foreground text-sm">Commercial Projects</span>
              <span className="text-muted-foreground text-sm">Interior Design</span>
              <span className="text-muted-foreground text-sm">Renovations & Remodeling</span>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">123 Construction Ave, Building City, BC 12345</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground text-sm">one2zsolution2410@gmail.com</span>
              </div>
            </div>
            {/* <div className="pt-2">
              <p className="text-xs text-muted-foreground">GST: 29AABCU9603R1ZX</p>
            </div> */}
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          {/* Copyright and Links - Bottom Aligned */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© {currentYear} One2Z Solutions. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
          
          {/* Developer Credit - Centered */}
          <div className="mt-6   text-center">
            <div className="text-xs text-muted-foreground">
              Developed by{' '}
              <a 
                href="https://www.linkedin.com/in/syed-hassan-8619162b9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Syed Imran Hassan
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
