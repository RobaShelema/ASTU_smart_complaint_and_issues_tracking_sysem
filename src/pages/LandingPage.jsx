import React, { useState } from 'react';
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
} from 'lucide-react';

const features = [
  { icon: MessageCircle, color: 'blue', title: 'Smart Submission', desc: 'Submit complaints with categories, priorities, and attachments — get an auto-generated ticket ID instantly.' },
  { icon: CheckCircle, color: 'emerald', title: 'Real-time Tracking', desc: 'Follow every status change from submission to resolution with live color-coded indicators.' },
  { icon: Users, color: 'violet', title: 'Role-based Access', desc: 'Dedicated dashboards for Students, Staff, and Admins with fine-grained permissions.' },
  { icon: BarChart3, color: 'amber', title: 'Analytics & Reports', desc: 'Powerful charts and exportable reports for data-driven campus management.' },
  { icon: Zap, color: 'rose', title: 'AI Chatbot Assistant', desc: '24/7 intelligent chatbot to answer FAQs and guide users through every step.' },
  { icon: Shield, color: 'indigo', title: 'Secure & Reliable', desc: 'Enterprise-grade authentication, audit logs, and encrypted data at rest.' },
];

const colorMap = {
  blue: 'bg-blue-100 text-blue-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  violet: 'bg-violet-100 text-violet-600',
  amber: 'bg-amber-100 text-amber-600',
  rose: 'bg-rose-100 text-rose-600',
  indigo: 'bg-indigo-100 text-indigo-600',
};

const steps = [
  { num: '01', title: 'Submit', desc: 'Describe your issue and attach evidence' },
  { num: '02', title: 'Assign', desc: 'Auto-routed to the right department' },
  { num: '03', title: 'Track', desc: 'Monitor live updates and communicate' },
  { num: '04', title: 'Resolve', desc: 'Get your resolution and rate the service' },
];

const testimonials = [
  { name: 'Abebe Kebede', dept: 'Computer Science, Year 3', quote: 'The system made it so easy to report issues in my dormitory. Got a response within 24 hours!' },
  { name: 'Sara Hailu', dept: 'Engineering, Year 2', quote: 'Finally a system that actually works! The chatbot helped me submit my first complaint with ease.' },
  { name: 'Tekle Berhan', dept: 'Business, Year 4', quote: 'Great transparency — I could track my complaint every step of the way until resolution.' },
];

const stats = [
  { value: '5,200+', label: 'Complaints Resolved' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '<24h', label: 'Avg. Response Time' },
  { value: '12', label: 'Departments Connected' },
];

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      {/* ───── Navbar ───── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-5 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold text-xs tracking-wider">A</span>
            </div>
            <span className="font-bold text-gray-900 hidden sm:inline text-[15px]">
              ASTU <span className="text-blue-600">Complaint System</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-gray-900 transition-colors">Testimonials</a>
            <a href="#contact" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 transition-colors">
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-sm transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 -mr-2 text-gray-600">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-5 pb-5 pt-3 space-y-3">
            {['Features', 'How It Works', 'Testimonials', 'Contact'].map((t) => (
              <a
                key={t}
                href={`#${t.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-gray-700 py-1.5"
              >
                {t}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="flex-1 text-center text-sm font-medium border border-gray-200 rounded-lg py-2.5 hover:bg-gray-50">
                Sign In
              </Link>
              <Link to="/register" className="flex-1 text-center text-sm font-semibold text-white bg-blue-600 rounded-lg py-2.5 hover:bg-blue-700">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ───── Hero ───── */}
      <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-blue-50 opacity-60 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-50 opacity-50 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-5 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <span className="text-xs font-semibold text-blue-700">Now serving 5,000+ ASTU students</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Campus Issues?
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              We Handle It.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Submit, track, and resolve campus complaints in one place.
            Built for students, powered by smart automation, trusted by ASTU.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-blue-600/30 transition-all text-sm"
            >
              Create Free Account
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-sm"
            >
              Sign In to Dashboard
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">{s.value}</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Features ───── */}
      <section id="features" className="py-20 sm:py-28 bg-gray-50/70">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">Features</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Everything you need to manage complaints
            </h2>
            <p className="mt-3 text-gray-500">
              A complete toolkit for students, staff, and administrators.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all"
              >
                <div className={`inline-flex items-center justify-center h-11 w-11 rounded-xl ${colorMap[f.color]} mb-4`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── How It Works ───── */}
      <section id="how-it-works" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">Process</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              How it works
            </h2>
            <p className="mt-3 text-gray-500">Four simple steps from complaint to resolution</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className="relative text-center group">
                {/* Connector line (not on last item) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[60%] w-[calc(100%-20%)] h-px bg-gradient-to-r from-blue-200 to-transparent" />
                )}
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-600 text-white text-lg font-bold shadow-lg shadow-blue-600/20 mb-4 mx-auto group-hover:scale-110 transition-transform">
                  {s.num}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Testimonials ───── */}
      <section id="testimonials" className="py-20 sm:py-28 bg-gray-50/70">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Loved by ASTU students
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.dept}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }} />

        <div className="relative max-w-3xl mx-auto px-5 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to get started?
          </h2>
          <p className="mt-4 text-blue-100 text-base sm:text-lg max-w-xl mx-auto">
            Join thousands of ASTU students already using our smart complaint management platform.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-sm shadow-lg"
            >
              Create Free Account
              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer id="contact" className="bg-gray-950 text-gray-400">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-extrabold text-xs">A</span>
                </div>
                <span className="font-bold text-white text-sm">ASTU Complaint System</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Adama Science and Technology University — empowering students to make their campus better.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-500" /> support@astu.edu.et</li>
                <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-500" /> +251-22-111-0000</li>
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-500" /> Adama, Ethiopia</li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Follow Us</h4>
              <div className="flex gap-3">
                {['Facebook', 'Twitter', 'LinkedIn'].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="h-9 w-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 hover:text-white transition-colors"
                  >
                    {s[0]}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>&copy; {new Date().getFullYear()} ASTU Complaint System. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
