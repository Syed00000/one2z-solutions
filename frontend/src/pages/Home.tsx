import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { StatsSection } from "@/components/StatsSection";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";
import { BrandsSection } from "@/components/BrandsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { AddReview } from "@/components/AddReview";

const Home = () => {
  return (
    <Layout>
      <Hero />
      <StatsSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsShowcase />
      <BrandsSection />
      <TestimonialsSection />
      <AddReview />
    </Layout>
  );
};

export default Home;
