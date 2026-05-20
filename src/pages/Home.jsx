import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { mockTutors } from '../data/mockTutors';

export default function Home() {
  useDocumentTitle('Home');
  const navigate = useNavigate();

  // We preview only the 6 tutors
  const previewTutors = mockTutors.slice(0, 6);

  const handleBookSession = (tutorId) => {
    navigate(`/tutor/${tutorId}`);
  };

  return (
    <div className="flex-grow">
      {/* 1. Hero / Banner Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Medical team collaborating"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDARDnykd9IqkUDBIgqIkid1Pb4g1op62_pMu7qfU4XlFewzdVBW5sXFVoEl9cIpITGiNMu0e_cOxJPQhpumw7ceXCkyp7P85cGnoKm4S-p7NuiqPPZBNhLG0eFt99kAZXk3lvsnd7AVpZgU33QpWIJBNyLsCHBB8-GTFFYQrdIWUnpIp0G8aOGGmQSNiDDQ0DriHVJTiZTV3ivzPLVvMrVKQrIBu5xhmfqLGuxlEhdiBhr__TtXy63C--oOe6DbpmjOSZ1MHni_oE"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent dark:from-on-surface dark:via-on-surface/90"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary dark:text-primary-fixed-dim font-label-md text-label-md mb-6 border border-primary/20">
              Elite Medical Tutoring
            </span>
            <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl font-bold text-on-surface mb-6 leading-tight">
              Find Your Perfect <span className="text-primary dark:text-primary-fixed-dim">Medical Tutor</span>
            </h1>
            <p className="font-body-lg text-lg text-on-surface-variant dark:text-surface-variant mb-10 leading-relaxed">
              Connect with experienced doctors and medical students for personalized 1-on-1 sessions. Master USMLE, MCAT, and clinical rotations with precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/tutors"
                className="px-10 py-4 bg-primary text-on-secondary rounded-xl font-title-md text-title-md text-center hover:opacity-90 transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg"
              >
                Find Tutors
              </Link>
              <a
                href="#how-it-works"
                className="px-10 py-4 border-2 border-primary text-primary dark:text-primary-fixed-dim dark:border-primary-fixed-dim rounded-xl font-title-md text-title-md text-center hover:bg-primary/5 transition-all active:scale-95"
              >
                How it Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Available Tutors Catalog Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest" id="tutors">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="font-headline-lg text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Meet Our Expert Tutors</h2>
              <p className="font-body-md text-body-md text-gray-600 dark:text-gray-300">Highly rated professionals from top medical institutions.</p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/tutors"
                className="px-6 py-3 bg-surface-container-high text-on-surface-variant dark:bg-inverse-surface/40 dark:text-inverse-on-surface rounded-xl font-label-md text-label-md hover:bg-surface-container-highest transition-colors flex items-center gap-2"
              >
                View All Tutors
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {previewTutors.map((tutor) => (
              <div
                key={tutor.id}
                className="group bg-white dark:bg-slate-800 rounded-3xl p-6 tutor-card-shadow border border-outline-variant/30 dark:border-white/10 hover:border-primary/30 dark:hover:border-primary-fixed-dim/30 transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/10 shrink-0 relative bg-primary/5 flex items-center justify-center">
                    {tutor.image ? (
                      <img alt={tutor.name} className="w-full h-full object-cover" src={tutor.image} />
                    ) : (
                      <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim text-4xl">person</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-title-md text-title-md font-bold text-gray-900 dark:text-gray-100">
                      {tutor.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 font-semibold">
                      {tutor.institution}
                    </p>
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      <span className="material-symbols-outlined text-sm fill-[1]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-label-md text-label-md ml-1 font-semibold">{tutor.rating} ({tutor.reviewsCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6 h-12 overflow-hidden">
                  {tutor.subjects.map((sub, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 rounded-full text-xs font-semibold"
                    >
                      {sub}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 line-clamp-2 h-10">
                  {tutor.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-outline-variant/30 dark:border-white/10 mt-auto">
                  <span className="font-title-md text-title-md font-bold text-gray-900 dark:text-gray-100">
                    ${tutor.price}
                    <span className="text-gray-500 dark:text-gray-400 text-label-md font-normal">/hr</span>
                  </span>
                  <button
                    onClick={() => handleBookSession(tutor.id)}
                    className="px-6 py-2.5 bg-primary text-on-secondary dark:bg-primary-container dark:text-on-primary-container rounded-xl font-label-md text-label-md font-semibold hover:opacity-90 transition-all active:scale-95"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How it Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface" id="how-it-works">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-headline-lg text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Start Your Learning Journey</h2>
            <p className="font-body-md text-body-md text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              Three simple steps to achieve clinical and academic excellence with MediQueue.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative p-10 bg-surface-container-low dark:bg-slate-800 rounded-3xl text-center group border border-outline-variant/10 h-full flex flex-col">
              <div className="w-16 h-16 bg-primary text-on-secondary rounded-2xl flex items-center justify-center mx-auto mb-8 transform group-hover:rotate-6 transition-transform shrink-0">
                <span className="material-symbols-outlined text-3xl">search</span>
              </div>
              <h3 className="font-title-md text-title-md font-bold text-gray-900 dark:text-gray-100 mb-4">1. Search Tutors</h3>
              <p className="font-body-md text-body-md text-gray-600 dark:text-gray-300 mt-auto">
                Filter by specialty, institution, and availability to find your perfect match.
              </p>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-outline-variant"></div>
            </div>
            {/* Step 2 */}
            <div className="relative p-10 bg-surface-container-low dark:bg-slate-800 rounded-3xl text-center group border border-outline-variant/10 h-full flex flex-col">
              <div className="w-16 h-16 bg-secondary text-on-secondary rounded-2xl flex items-center justify-center mx-auto mb-8 transform group-hover:-rotate-6 transition-transform shrink-0">
                <span className="material-symbols-outlined text-3xl">event_available</span>
              </div>
              <h3 className="font-title-md text-title-md font-bold text-gray-900 dark:text-gray-100 mb-4">2. Book a Session</h3>
              <p className="font-body-md text-body-md text-gray-600 dark:text-gray-300 mt-auto">
                Schedule a 1-on-1 session that fits perfectly into your demanding schedule.
              </p>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-outline-variant"></div>
            </div>
            {/* Step 3 */}
            <div className="p-10 bg-surface-container-low dark:bg-slate-800 rounded-3xl text-center group border border-outline-variant/10 h-full flex flex-col">
              <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-2xl flex items-center justify-center mx-auto mb-8 transform group-hover:scale-110 transition-transform shrink-0">
                <span className="material-symbols-outlined text-3xl">school</span>
              </div>
              <h3 className="font-title-md text-title-md font-bold text-gray-900 dark:text-gray-100 mb-4">3. Start Learning</h3>
              <p className="font-body-md text-body-md text-gray-600 dark:text-gray-300 mt-auto">
                Join the interactive classroom and accelerate your medical understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary dark:bg-primary-container overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-[100px] opacity-20 -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-on-primary-fixed-variant rounded-full blur-[100px] opacity-30 -ml-48 -mb-48"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="font-display-lg text-4xl lg:text-5xl font-bold text-on-secondary dark:text-on-primary-container mb-8 leading-tight">
                Why medical students trust <span className="text-secondary-container dark:text-primary">MediQueue</span>
              </h2>
              <p className="font-body-lg text-lg text-on-secondary/80 dark:text-on-primary-container/80 mb-10 leading-relaxed">
                We provide more than just tutoring. We provide a structured roadmap to your medical career with the support of those who have been where you are.
              </p>
              
              {/* Checklist */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-8 h-8 bg-on-secondary text-primary rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">check</span>
                  </div>
                  <div>
                    <h4 className="font-title-md text-title-md font-bold text-on-secondary dark:text-on-primary-container mb-1">Certified Professionals</h4>
                    <p className="font-body-md text-body-md text-on-secondary/70 dark:text-on-primary-container/70">All tutors undergo rigorous credential verification and teaching assessments.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-8 h-8 bg-on-secondary text-primary rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">check</span>
                  </div>
                  <div>
                    <h4 className="font-title-md text-title-md font-bold text-on-secondary dark:text-on-primary-container mb-1">Flexible Scheduling</h4>
                    <p className="font-body-md text-body-md text-on-secondary/70 dark:text-on-primary-container/70">Book sessions 24/7 across multiple time zones to match your hospital rotations.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-8 h-8 bg-on-secondary text-primary rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">check</span>
                  </div>
                  <div>
                    <h4 className="font-title-md text-title-md font-bold text-on-secondary dark:text-on-primary-container mb-1">Personalized Curriculum</h4>
                    <p className="font-body-md text-body-md text-on-secondary/70 dark:text-on-primary-container/70">Custom study plans tailored specifically to your weak areas and learning style.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Grid */}
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="bg-white/10 dark:bg-inverse-surface/30 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <span className="font-display-lg text-4xl lg:text-5xl font-bold block mb-2 text-on-secondary dark:text-on-primary-container">98%</span>
                  <span className="font-label-md text-label-md uppercase tracking-widest text-on-secondary/60 dark:text-on-primary-container/60">Pass Rate</span>
                </div>
                <div className="bg-white/10 dark:bg-inverse-surface/30 backdrop-blur-lg rounded-2xl p-6 border border-white/10 h-64 overflow-hidden relative">
                  <img
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                    alt="A detailed, macro shot of a modern stethoscope lying on a wooden desk alongside medical textbooks, with soft natural light streaming through a nearby window in a professional medical office. The color palette consists of warm wood tones, clean white, and surgical steel silver."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAva-EhyVYjKRYnDv0C8edcu_aTG2fylvcyEd5IZCIAlX6mCRAzRYvMYbrBOlNJ3AjfSXkmElVEoMQ0uUBIb0TNxBEwmaeYF6BSfsuSVTfmYnSIyxA02ispPSbjmBC-AnwDRfcm3icp56oWLV-T042Cum9FCTbrFAbPH0sFMV4nIy7-9mO5sVYjQZQ8RAbimsQUrh5KIJB79Naw15fMiZieIPuyMY7CLqsYnMz8TmRyLfo4vr1TXosiWCF4nDaXYNUQTVyw0tTJ504"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-secondary-container dark:bg-secondary rounded-2xl p-6 text-on-secondary-container dark:text-on-secondary">
                  <span className="font-display-lg text-4xl lg:text-5xl font-bold block mb-2">15k+</span>
                  <span className="font-label-md text-label-md uppercase tracking-widest opacity-70">Active Students</span>
                </div>
                <div className="bg-white/10 dark:bg-inverse-surface/30 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <span className="font-display-lg text-4xl lg:text-5xl font-bold block mb-2 text-on-secondary dark:text-on-primary-container">500+</span>
                  <span className="font-label-md text-label-md uppercase tracking-widest text-on-secondary/60 dark:text-on-primary-container/60">Expert Tutors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
