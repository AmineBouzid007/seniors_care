import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Heart, Activity, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    { title: "Personal Companion & Daily Care", rate: "$28 / hr", desc: "Assistance with meal preparation, light housekeeping, mobility support, and friendly interaction." },
    { title: "Specialized Medical & Vitals Oversight", rate: "$45 / hr", desc: "Registered nurses monitoring medication compliance, blood pressure, insulin, and clinical status." },
    { title: "24/7 Dementia & Alzheimer's Care", rate: "$55 / hr", desc: "Dedicated, compassionate cognitive care trained specifically for memory care environments." },
    { title: "Post-Operative Rehabilitation Support", rate: "$40 / hr", desc: "In-home assistance during recovery from surgeries, stroke, or physical therapy sessions." }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full space-y-10">
        <div>
          <h1 className="text-4xl font-extrabold text-white">Caregiver Services Catalog</h1>
          <p className="text-slate-400 mt-2">Transparent pricing and specialized medical capabilities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((s, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white">{s.title}</h3>
                  <span className="text-sm font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">{s.rate}</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800 flex justify-end">
                <Link href="/book" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1">
                  <span>Book This Service</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
