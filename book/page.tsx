import Navbar from '@/components/Navbar';
import { createBooking } from '@/app/actions/bookings';
import { Calendar, User, Phone, MapPin, FileText, CheckCircle2 } from 'lucide-react';

export default function BookCarePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Book Caregiver Service</h1>
          <p className="text-slate-400 mt-2 text-sm">Complete the form below to request a dedicated caregiver for your senior family member.</p>
        </div>

        <form action={createBooking} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-cyan-400 border-b border-slate-800 pb-2 flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Client Information</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Full Name</label>
              <input name="fullName" required placeholder="e.g. Robert Smith" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Email Address</label>
                <input type="email" name="email" required placeholder="robert@example.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Phone Number</label>
                <input type="tel" name="phone" required placeholder="+1 (555) 000-0000" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Home Address</label>
              <input name="address" required placeholder="123 Care Street, Suite 4B" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h2 className="text-lg font-semibold text-cyan-400 border-b border-slate-800 pb-2 flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Care Schedule & Details</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Scheduled Date & Time</label>
                <input type="datetime-local" name="scheduledAt" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Duration (Hours)</label>
                <input type="number" name="durationHours" defaultValue="4" min="1" max="24" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Special Medical Notes or Instructions</label>
              <textarea name="specialNotes" rows={3} placeholder="Dietary restrictions, mobility assistance needs, or medication times..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" />
            </div>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-4 rounded-xl text-base shadow-lg transition-all flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Confirm Care Request</span>
          </button>
        </form>
      </main>
    </div>
  );
}
