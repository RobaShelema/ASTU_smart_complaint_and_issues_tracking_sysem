import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Shield, MessageSquare, BarChart3, Clock } from 'lucide-react';

const features = [
  { icon: MessageSquare, title: 'Submit Complaints', desc: 'Report issues quickly and easily' },
  { icon: Clock, title: 'Real-time Tracking', desc: 'Monitor your complaint status live' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Insights for informed decisions' },
  { icon: Shield, title: 'Secure & Private', desc: 'Your data is protected at all times' },
];

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel — branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] relative flex-col justify-between bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white p-10 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-white/5" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Top — logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
              <span className="text-white font-extrabold text-sm tracking-wide">ASTU</span>
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">ASTU Complaint System</h2>
              <p className="text-blue-200 text-xs">Smart Campus Management</p>
            </div>
          </Link>
        </div>

        {/* Center — hero text + features */}
        <div className="relative z-10 space-y-8 -mt-4">
          <div>
            <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight">
              Your Voice <br /> Matters Here
            </h1>
            <p className="mt-3 text-blue-200 text-sm leading-relaxed max-w-sm">
              Submit, track, and resolve campus complaints efficiently.
              Built for students, staff, and administrators.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/15 transition-colors"
              >
                <f.icon className="h-5 w-5 text-blue-300 mb-2" />
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="text-xs text-blue-300 mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — footer */}
        <div className="relative z-10 text-xs text-blue-300/70">
          <p>&copy; {new Date().getFullYear()} Adama Science and Technology University</p>
        </div>
      </div>

      {/* Right Panel — form area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header (visible on < lg) */}
        <div className="lg:hidden bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-5 text-white">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
              <span className="text-white font-extrabold text-xs">ASTU</span>
            </div>
            <div>
              <h2 className="font-bold text-base">ASTU Complaint System</h2>
              <p className="text-blue-200 text-xs">Smart Campus Management</p>
            </div>
          </Link>
        </div>

        {/* Scrollable form container */}
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center px-5 py-10 sm:px-8 bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-[440px]">
              <Outlet />

              {/* Bottom links */}
              <div className="mt-8 text-center text-xs text-gray-400 space-y-1">
                <p>&copy; {new Date().getFullYear()} Adama Science and Technology University</p>
                <div className="flex justify-center gap-4">
                  <Link to="/" className="hover:text-gray-600 transition-colors">Home</Link>
                  <span className="text-gray-300">|</span>
                  <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
                  <span className="text-gray-300">|</span>
                  <a href="#" className="hover:text-gray-600 transition-colors">Help</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
