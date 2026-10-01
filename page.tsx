import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Shield, Heart, Clock, Award, ArrowRight, UserCheck, Activity } from 'lucide-react';

export default function HomePage() {
  const features = [
    { icon: Heart, title: "Personalized Daily Care", desc: "Assistance with daily living, companionship, and customized physical wellness routines." },
    { icon: Shield, title: "Licensed Health Caregivers", desc: "Background-checked professionals with specialized geriatric care certifications." },
    { icon: Clock, title: "24/7 Family Telemetry", desc: "Real-time daily updates, vitals logging, and continuous emergency readiness." },
    { icon: Award, title: "Clinical Excellence", desc: "Partnered with leading hospitals to deliver seamless post-operative senior recovery." }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="relative pt-24 pb-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase mb-8">
              <UserCheck className="w-4 h-4" />
              <span>Next-Gen Eldercare Management Platform</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
              Compassionate Senior Care, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">Intelligently Managed</span>
            </h1>
            <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Elevate the quality of life for your loved ones with dedicated caregivers, transparent scheduling, and continuous health tracking.
            </p>
            <div className="mt-10 flex items-center justify-center space-x-4">
              <Link href="/book" className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-8 py-4 rounded-xl text-base shadow-lg shadow-cyan-500/25 transition-all">
                <span>Schedule a Caregiver</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/services" className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold px-8 py-4 rounded-xl text-base transition-colors">
                Explore Services
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-slate-800/60 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors">
                <f.icon className="w-8 h-8 text-cyan-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        © 2026 SeniorCare AI Platform. All rights reserved.
      </footer>
    </div>
  );
}
