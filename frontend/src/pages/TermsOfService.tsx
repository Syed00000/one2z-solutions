import { Link } from "react-router-dom";
import { Building2, MapPin, Phone, Mail, FileText } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last Updated: October 2, 2025</p>

        <div className="prose prose-lg max-w-none">
          {/* Company Information */}
          <section className="mb-12 p-6 bg-card rounded-lg border border-border">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-primary" />
              Company Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <Building2 className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Legal Business Name:</h3>
                  <p>One2Z Solution Construction & interior</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Registered Office Address:</h3>
                  <p>123 Construction Avenue, Building City, BC 12345, India</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Contact Number:</h3>
                  <p>+91 1234567890</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Email:</h3>
                  <p>one2zsolution2410@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <FileText className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">GSTIN:</h3>
                  <p>29AABCU9603R1ZX</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing or using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">2. Services Provided</h2>
            <p className="mb-4">One2Z Solutions provides the following services:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Residential and Commercial Construction</li>
              <li>Interior Design and Execution</li>
              <li>Renovation and Remodeling Services</li>
              <li>Architectural Services</li>
              <li>Project Management</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">3. Payments and Pricing</h2>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>All prices are quoted in INR (Indian Rupees) unless otherwise specified</li>
              <li>Payment terms will be outlined in individual project contracts</li>
              <li>GST @ 18% will be applicable on all services as per government regulations</li>
              <li>Advance payment may be required before commencement of work</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">4. Project Timelines</h2>
            <p className="mb-4">
              Project timelines are estimates and may be affected by factors beyond our control including but not limited to weather conditions, material availability, and regulatory approvals.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">5. Warranties and Guarantees</h2>
            <p className="mb-4">
              We provide a 5-year structural warranty on all our construction projects, subject to terms and conditions. Specific warranty details will be provided in your project contract.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p className="mb-4">
              One2Z Solutions shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from the use of our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">7. Governing Law</h2>
            <p className="mb-4">
              These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Building City.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new Terms of Service on this page.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <p className="mb-2">
              <span className="font-medium">Email:</span> one2zsolution2410@gmail.com
            </p>
            <p>
              <span className="font-medium">Phone:</span> +91 1234567890
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
