import React from 'react';
import Navbar from '@/components/Navbar';
import { Users, Calendar, Clock, DollarSign, Activity, CheckCircle, Clock3 } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: "Active Clients", value: "128", icon: Users, change: "+12%" },
    { label: "Scheduled Care Visits", value: "42", icon: Calendar, change: "+5%" },
    { label: "Total Care Hours", value: "1,240 hrs", icon: Clock, change: "+18%" },
    { label: "Monthly Revenue", value: "$48,500", icon: DollarSign, change: "+8%" }
  ];

  const recentBookings = [
    { id: "BK-9012", client: "Eleanor Vance", service: "Personal Daily Assistance", time: "Today, 2:00 PM", status: "CONFIRMED" },
    { id: "BK-9013", client: "Arthur Pendelton", service: "Medical Oversight & Vitals", time: "Tomorrow, 9:00 AM", status: "PENDING" },
    { id: "BK-9014", client: "Margaret Higgins", service: "Post-Op Recovery Companion", time: "Oct 4, 10:00 AM", status: "IN_PROGRESS" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full space-y-8">
        <header className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Care Operations Center</h1>
            <p className="text-slate-400 text-sm mt-1">Real-time caregiver allocation and client booking telemetry</p>
          </div>
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">Live Services Dispatch</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-medium uppercase">{s.label}</span>
                <s.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">{s.value}</div>
              <span className="text-xs text-emerald-400 font-medium">{s.change} from last month</span>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Active & Incoming Care Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Booking ID</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Service Requested</th>
                  <th className="px-4 py-3">Scheduled Time</th>
                  <th className="px-4 py-3 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-4 font-mono text-cyan-400">{b.id}</td>
                    <td className="px-4 py-4 font-semibold text-white">{b.client}</td>
                    <td className="px-4 py-4">{b.service}</td>
                    <td className="px-4 py-4 text-slate-400">{b.time}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        b.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        b.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      }`}>
                        {b.status === 'CONFIRMED' ? <CheckCircle className="w-3 h-3" /> : <Clock3 className="w-3 h-3" />}
                        <span>{b.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
