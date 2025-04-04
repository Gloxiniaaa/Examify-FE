import { Link } from "react-router-dom";
import Slider from "react-slick";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

const Home = () => {
  const userRole = localStorage.getItem("userRole");
  const forwardPageLink = userRole === "TEACHER" ? "/teacher" : "/student";
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-neutral-50 to-neutral-100">
      <NavBar />

      {/* Hero Section */}
      <section className="flex-grow flex flex-col items-center justify-center max-w-7xl mx-auto py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-neutral-800 mb-6 leading-tight">
          Create and Take Exams <span className="text-primary">Online</span> with Ease
        </h1>
        <p className="text-lg md:text-xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Empowering teachers to create assessments and students to test their
          knowledge through a simple, secure platform.
        </p>
        <div className="space-y-4 md:space-y-0 md:space-x-6">
          <Link to={forwardPageLink} className="inline-block bg-primary text-white px-8 py-4 rounded-lg shadow-md hover:bg-secondary hover:shadow-lg transform hover:-translate-y-1 transition duration-300 text-lg font-medium">
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 text-center mb-12">
            Why Choose <span className="text-primary">Examify</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-neutral-50 rounded-xl p-8 shadow-sm hover:shadow-md transition duration-300 transform hover:-translate-y-2">
              <div className="text-primary text-5xl mb-6 flex justify-center">📝</div>
              <h3 className="text-2xl font-semibold mb-4 text-center">Easy Test Creation</h3>
              <p className="text-neutral-600 text-center">
                Teachers can quickly create exams with our intuitive interface and customizable question types.
              </p>
            </div>
            <div className="bg-neutral-50 rounded-xl p-8 shadow-sm hover:shadow-md transition duration-300 transform hover:-translate-y-2">
              <div className="text-primary text-5xl mb-6 flex justify-center">🔒</div>
              <h3 className="text-2xl font-semibold mb-4 text-center">Secure Access</h3>
              <p className="text-neutral-600 text-center">
                Protected entry with links or passcodes for students ensuring exam integrity.
              </p>
            </div>
            <div className="bg-neutral-50 rounded-xl p-8 shadow-sm hover:shadow-md transition duration-300 transform hover:-translate-y-2">
              <div className="text-primary text-5xl mb-6 flex justify-center">📊</div>
              <h3 className="text-2xl font-semibold mb-4 text-center">Instant Results</h3>
              <p className="text-neutral-600 text-center">
                Get immediate feedback and detailed analytics to track student progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 text-center mb-12">
            Trusted by Educators
          </h2>
          <Slider
            dots={true}
            infinite={true}
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={5000}
            className="testimonial-slider"
          >
            <div className="px-4">
              <div className="bg-white p-8 rounded-xl shadow-md max-w-3xl mx-auto">
                <p className="text-lg text-neutral-600 italic mb-6">
                  "Examify has transformed how I assess my students. The platform is intuitive, reliable, and saves me hours of grading time. My students appreciate the immediate feedback as well."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4">
                    JD
                  </div>
                  <div>
                    <p className="font-semibold">Dr. Jane Doe</p>
                    <p className="text-sm text-neutral-500">Professor of Computer Science</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4">
              <div className="bg-white p-8 rounded-xl shadow-md max-w-3xl mx-auto">
                <p className="text-lg text-neutral-600 italic mb-6">
                  "The automated grading system has made my life so much easier. I can focus more on teaching and less on administrative tasks."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4">
                    MS
                  </div>
                  <div>
                    <p className="font-semibold">Prof. Michael Smith</p>
                    <p className="text-sm text-neutral-500">Mathematics Department</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4">
              <div className="bg-white p-8 rounded-xl shadow-md max-w-3xl mx-auto">
                <p className="text-lg text-neutral-600 italic mb-6">
                  "The platform's flexibility allows me to create diverse question types that truly test my students' understanding."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-4">
                    SK
                  </div>
                  <div>
                    <p className="font-semibold">Dr. Sarah Kim</p>
                    <p className="text-sm text-neutral-500">Biology Instructor</p>
                  </div>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 mb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-white opacity-90 mb-8">
            Join thousands of educators and students who are already using Examify.
          </p>
          <Link to={forwardPageLink} className="inline-block bg-white text-primary px-8 py-4 rounded-lg shadow-md hover:bg-neutral-100 transition duration-300 text-lg font-medium">
            Create Your First Exam
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;