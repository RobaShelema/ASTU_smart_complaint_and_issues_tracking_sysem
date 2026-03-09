import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Shield,
  Users,
  ArrowRight,
  Star,
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
  Zap,
  ChevronRight,
  ExternalLink,
  Send,
  Award,
  Layers,
  Globe,
} from 'lucide-react';

/* ─── Data ───────────────────────────────────────────── */

const features = [
  { icon: MessageCircle, color: 'blue',    title: 'Smart Submission',    desc: 'Submit complaints with categories, priorities, and attachments — get an auto-generated ticket ID instantly.' },
  { icon: CheckCircle,   color: 'emerald', title: 'Real-time Tracking',  desc: 'Follow every status change from submission to resolution with live color-coded indicators.' },
  { icon: Users,         color: 'violet',  title: 'Role-based Access',   desc: 'Dedicated dashboards for Students, Staff, and Admins with fine-grained permissions.' },
  { icon: BarChart3,     color: 'amber',   title: 'Analytics & Reports', desc: 'Powerful charts and exportable reports for data-driven campus management.' },
  { icon: Zap,           color: 'rose',    title: 'AI Chatbot Assistant', desc: '24/7 intelligent chatbot to answer FAQs and guide users through every step.' },
  { icon: Shield,        color: 'cyan',    title: 'Secure & Reliable',   desc: 'Enterprise-grade authentication, audit logs, and encrypted data at rest.' },
];

const gradientMap = {
  blue:    { badge: 'bg-blue-500/10 text-blue-600 ring-blue-500/20',    glow: 'group-hover:shadow-blue-500/20' },
  emerald: { badge: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20', glow: 'group-hover:shadow-emerald-500/20' },
  violet:  { badge: 'bg-violet-500/10 text-violet-600 ring-violet-500/20',  glow: 'group-hover:shadow-violet-500/20' },
  amber:   { badge: 'bg-amber-500/10 text-amber-600 ring-amber-500/20',   glow: 'group-hover:shadow-amber-500/20' },
  rose:    { badge: 'bg-rose-500/10 text-rose-600 ring-rose-500/20',    glow: 'group-hover:shadow-rose-500/20' },
  cyan:    { badge: 'bg-cyan-500/10 text-cyan-600 ring-cyan-500/20',    glow: 'group-hover:shadow-cyan-500/20' },
};

const steps = [
  { icon: Send,   num: '01', title: 'Submit',  desc: 'Describe your issue, select a category, and attach evidence.' },
  { icon: Layers, num: '02', title: 'Assign',   desc: 'Your complaint is auto-routed to the right department.' },
  { icon: Clock,  num: '03', title: 'Track',    desc: 'Monitor real-time updates and communicate with staff.' },
  { icon: Award,  num: '04', title: 'Resolve',  desc: 'Get your resolution, provide feedback, and rate the service.' },
];

const testimonials = [
  { name: 'Abebe Kebede', dept: 'Computer Science, Year 3', quote: 'The system made it so easy to report issues in my dormitory. I got a response within 24 hours!' },
  { name: 'Sara Hailu',   dept: 'Engineering, Year 2',      quote: 'Finally a system that actually works! The chatbot helped me submit my first complaint effortlessly.' },
  { name: 'Tekle Berhan', dept: 'Business, Year 4',         quote: 'Great transparency — I could track my complaint every step of the way until resolution.' },
];

const stats = [
  { value: '5,200+', label: 'Complaints Resolved' },
  { value: '98%',    label: 'Satisfaction Rate' },
  { value: '<24h',   label: 'Avg. Response Time' },
  { value: '12',     label: 'Departments Connected' },
];

const navLinks = [
  { label: 'Features',     href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact',      href: '#contact' },
];

/* ─── Component ──────────────────────────────────────── */

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased scroll-smooth">

      {/* ═══════ Navbar ═══════ */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-sm shadow-gray-200/60 border-b border-gray-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 sm:h-[72px] px-5 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <span className="text-white font-extrabold text-sm leading-none">A</span>
            </div>
            <span className="font-bold text-gray-900 hidden sm:inline text-[15px]">
              ASTU <span className="text-blue-600">Complaint</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="px-3.5 py-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100/70 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2.5">
            <Link
              to="/login"
              className="text-[13px] font-semibold text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100/70 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-[13px] font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all"
            >
              Register
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -mr-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 px-5 pb-5 pt-3 space-y-1">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-gray-700 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="flex gap-3 pt-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center text-sm font-semibold border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl py-2.5 shadow-md shadow-blue-600/20"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════ Hero ═══════ */}
      <section className="relative pt-32 sm:pt-40 lg:pt-48 pb-20 sm:pb-28 lg:pb-36 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-gradient-to-br from-blue-100/80 via-indigo-50/60 to-transparent blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-100/50 to-transparent blur-3xl" />
          <div className="absolute top-1/4 -left-32 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-cyan-100/40 to-transparent blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-full px-4 py-1.5 mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-blue-700 tracking-wide">Serving 5,000+ ASTU students</span>
            </div>

            {/* Headline */}
            <h1 className="text-[2.5rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold tracking-tight">
              <span className="block text-gray-900">Campus Issues?</span>
              <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                We Handle It.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 text-base sm:text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Submit, track, and resolve campus complaints in one unified platform.
              Built for students, powered by smart automation, trusted&nbsp;by&nbsp;ASTU.
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/register"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl shadow-blue-600/25 hover:shadow-2xl hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all text-sm"
              >
                Create Free Account
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white border border-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-2xl hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md transition-all text-sm"
              >
                Sign In to Dashboard
                <ExternalLink className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 sm:mt-24 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="relative bg-white/70 backdrop-blur-sm border border-gray-200/70 rounded-2xl px-5 py-5 text-center hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/40 transition-all"
                >
                  <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {s.value}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ Features ═══════ */}
      <section id="features" className="py-20 sm:py-28 lg:py-32 bg-gray-50/80">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
              <Layers className="h-3.5 w-3.5" />
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-extrabold tracking-tight leading-tight">
              Everything you need to manage <br className="hidden sm:block" />campus complaints
            </h2>
            <p className="mt-4 text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
              A complete toolkit designed for students, staff, and administrators.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((f) => {
              const palette = gradientMap[f.color];
              return (
                <div
                  key={f.title}
                  className={`group relative bg-white rounded-2xl border border-gray-100 p-7 hover:shadow-xl ${palette.glow} transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ring-1 ${palette.badge} mb-5`}>
                    <f.icon className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ How It Works ═══════ */}
      <section id="how-it-works" className="py-20 sm:py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
              <Globe className="h-3.5 w-3.5" />
              Process
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-extrabold tracking-tight leading-tight">
              Four steps from complaint <br className="hidden sm:block" />to resolution
            </h2>
            <p className="mt-4 text-gray-500 text-base sm:text-lg">
              A streamlined process designed for speed and transparency.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-[3.25rem] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
              {steps.map((s, i) => {
                const StepIcon = s.icon;
                return (
                  <div key={s.num} className="relative text-center group">
                    {/* Step circle */}
                    <div className="relative inline-flex items-center justify-center h-[4.25rem] w-[4.25rem] rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/20 mb-6 mx-auto group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-blue-600/30 transition-all duration-300">
                      <StepIcon className="h-7 w-7" />
                      <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white text-[11px] font-bold text-blue-600 border-2 border-blue-100 flex items-center justify-center shadow-sm">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1.5">{s.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-[220px] mx-auto">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ Testimonials ═══════ */}
      <section id="testimonials" className="py-20 sm:py-28 lg:py-32 bg-gray-50/80">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
              <Star className="h-3.5 w-3.5" />
              Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-extrabold tracking-tight">
              Loved by ASTU students
            </h2>
            <p className="mt-4 text-gray-500 text-base sm:text-lg">
              Hear what our community has to say about the platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="relative bg-white rounded-2xl border border-gray-100 p-7 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Large quote mark */}
                <svg className="absolute top-5 right-6 h-10 w-10 text-gray-100" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[15px] text-gray-600 leading-relaxed mb-6 relative z-10">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-500/20 shrink-0">
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{t.name}</p>
                    <p className="text-xs text-gray-500 truncate">{t.dept}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Decorative orbs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-5 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Ready to make your <br className="hidden sm:block" />campus better?
          </h2>
          <p className="mt-5 text-blue-100 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Join thousands of ASTU students already using our smart complaint management platform.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/register"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-blue-700 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-0.5 transition-all text-sm"
            >
              Start for Free
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/10 hover:border-white/50 transition-all text-sm"
            >
              Sign In Instead
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ Footer ═══════ */}
      <footer id="contact" className="bg-gray-950 text-gray-400">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Brand — wider */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <span className="text-white font-extrabold text-sm">A</span>
                </div>
                <span className="font-bold text-white text-[15px]">ASTU Complaint System</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Adama Science and Technology University — empowering students to make their campus better through transparent complaint management.
              </p>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2 lg:col-start-6">
              <h4 className="text-white font-semibold text-sm mb-5">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                {navLinks.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="hover:text-white transition-colors">{l.label}</a>
                  </li>
                ))}
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="lg:col-span-3">
              <h4 className="text-white font-semibold text-sm mb-5">Contact Us</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-gray-500 shrink-0" />
                  <span>support@astu.edu.et</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-gray-500 shrink-0" />
                  <span>+251-22-111-0000</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-gray-500 shrink-0 mt-0.5" />
                  <span>Adama, Ethiopia</span>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div className="lg:col-span-3">
              <h4 className="text-white font-semibold text-sm mb-5">Follow Us</h4>
              <div className="flex gap-2.5">
                {[
                  { abbr: 'Fb', full: 'Facebook' },
                  { abbr: 'Tw', full: 'Twitter' },
                  { abbr: 'Li', full: 'LinkedIn' },
                  { abbr: 'Yt', full: 'YouTube' },
                ].map((s) => (
                  <a
                    key={s.full}
                    href="#"
                    title={s.full}
                    className="h-9 w-9 rounded-lg bg-gray-800/80 hover:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 hover:text-white transition-colors"
                  >
                    {s.abbr}
                  </a>
                ))}
              </div>
              <p className="mt-5 text-xs leading-relaxed text-gray-600">
                Stay connected for the latest updates and campus news.
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} ASTU Complaint System. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
