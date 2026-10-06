import { Link } from 'react-router-dom';
import { Image as ImageIcon, ArrowLeft, Clock, ShieldCheck } from 'lucide-react';

export default function AdminGalleryPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-600 hover:text-gold-600 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Command Dashboard</span>
        </Link>
      </div>

      <div className="card p-8 sm:p-10 border border-navy-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-navy-100">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-600 border border-gold-500/20 shadow-xs">
              <ImageIcon size={28} />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-100 px-3 py-0.5 text-xs font-semibold text-navy-800">
                <Clock size={12} />
                Scheduled for Phase 10
              </span>
              <h1 className="font-serif text-2xl font-bold text-navy-950 mt-1">
                Media Gallery Management
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <ShieldCheck size={14} />
            <span>Storage Bucket Ready</span>
          </div>
        </div>

        <div className="py-8 space-y-4">
          <p className="text-sm text-navy-700 leading-relaxed">
            This module provides full digital asset curation and portfolio media management:
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-navy-600">
            <li className="flex items-center gap-2 p-3 rounded-xl bg-navy-50/60 border border-navy-100">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              <span>Multi-File Direct Upload to Supabase Storage</span>
            </li>
            <li className="flex items-center gap-2 p-3 rounded-xl bg-navy-50/60 border border-navy-100">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              <span>Image Titles, Captions, and Contextual Descriptions</span>
            </li>
            <li className="flex items-center gap-2 p-3 rounded-xl bg-navy-50/60 border border-navy-100">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              <span>Category Filtering (Events, Leadership, Fieldwork, Academics)</span>
            </li>
            <li className="flex items-center gap-2 p-3 rounded-xl bg-navy-50/60 border border-navy-100">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              <span>Date Taken & Location Metadata</span>
            </li>
            <li className="flex items-center gap-2 p-3 rounded-xl bg-navy-50/60 border border-navy-100">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              <span>Featured Spotlight Image Toggles</span>
            </li>
            <li className="flex items-center gap-2 p-3 rounded-xl bg-navy-50/60 border border-navy-100">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              <span>Display Sort Order Management</span>
            </li>
          </ul>
        </div>

        <div className="pt-6 border-t border-navy-100 flex items-center justify-between">
          <p className="text-xs text-navy-500 italic">
            Full media storage uploading and gallery CRUD will be activated in Phase 10.
          </p>
          <Link to="/admin" className="btn-secondary !py-2 !px-4 !text-xs">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
