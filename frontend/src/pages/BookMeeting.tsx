import { Layout } from "@/components/Layout";
import { MeetingScheduler } from "@/components/MeetingScheduler";

const BookMeeting = () => {
  return (
    <Layout>
      <div className="pt-20">
        {/* Page Header */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Book a Meeting</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Schedule a consultation with our team to discuss your construction or interior design project
            </p>
          </div>
        </section>

        {/* Meeting Scheduler */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <MeetingScheduler />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default BookMeeting;
