import { useState } from 'react';
import { Mail, Linkedin, MapPin, Send, AlertCircle, CheckCircle } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { supabase } from '@/lib/supabase';
import { usePublicContent } from '@/context/PublicContentContext';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const initialForm: FormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export default function ContactSection() {
  const { profile, settings } = usePublicContent();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Please enter your name';
    if (!form.email.trim()) {
      e.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Please enter a valid email address';
    }
    if (!form.subject.trim()) e.subject = 'Please enter a subject';
    if (!form.message.trim()) {
      e.message = 'Please enter a message';
    } else if (form.message.trim().length < 10) {
      e.message = 'Message must be at least 10 characters';
    }
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus('error');
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    const { error } = await supabase.from('contact_messages').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    });
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setForm(initialForm);
    }
    setIsSubmitting(false);
  };

  const handleChange = (field: keyof FormState) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: ev.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full rounded-lg border bg-white px-4 py-3 text-sm text-navy-900 placeholder-navy-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/20 ${
      errors[field] ? 'border-red-300 focus:border-red-400' : 'border-navy-200 focus:border-gold-500'
    }`;

  return (
    <section id="contact" className="section-padding py-20 lg:py-28 bg-cream-200">
      <div className="site-container">
        <div className="reveal">
          <SectionHeading
            eyebrow="Contact"
            title="Let's connect professionally"
            description="For professional inquiries, collaborations, or fellowship-related communications, please use the form below or reach out directly."
            align="center"
          />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="reveal space-y-6">
            <div className="card p-6">
              <h3 className="font-serif text-lg font-bold text-navy-900">Direct Contact</h3>
              <div className="mt-5 space-y-4">
                <a
                  href={`mailto:${profile?.email ?? ''}`}
                  className="flex items-center gap-4 text-sm text-navy-700 transition-colors hover:text-gold-600"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-50 text-navy-800">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">Email</p>
                    <p className="font-medium">{profile?.email ?? 'Email available on request'}</p>
                  </div>
                </a>

                <a
                  href={profile?.linkedin ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-sm text-navy-700 transition-colors hover:text-gold-600"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-50 text-navy-800">
                    <Linkedin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">LinkedIn</p>
                    <p className="font-medium">Connect on LinkedIn</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 text-sm text-navy-700">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-50 text-navy-800">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">Location</p>
                    <p className="font-medium">{profile?.location ?? ''}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gold-200 bg-gold-50 p-6">
              <p className="text-sm leading-relaxed text-navy-700">
                <span className="font-semibold">Professional note:</span> Messages are delivered securely to the portfolio administrator. For verified professional inquiries only — please allow time for a response.
              </p>
            </div>
          </div>

          <div className="reveal" style={{ transitionDelay: '0.1s' }}>
            {settings?.contact_form_enabled !== false ? <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5" noValidate>
              <div>
                <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-navy-500">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  className={`mt-2 ${inputClass('name')}`}
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle size={12} />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-navy-500">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  className={`mt-2 ${inputClass('email')}`}
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle size={12} />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-semibold uppercase tracking-wider text-navy-500">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange('subject')}
                  className={`mt-2 ${inputClass('subject')}`}
                  placeholder="Subject of your message"
                  aria-invalid={!!errors.subject}
                  aria-describedby={errors.subject ? 'subject-error' : undefined}
                />
                {errors.subject && (
                  <p id="subject-error" className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle size={12} />
                    {errors.subject}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-navy-500">
                  Message
                </label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={handleChange('message')}
                  rows={5}
                  className={`mt-2 ${inputClass('message')} resize-none`}
                  placeholder="Your professional message..."
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle size={12} />
                    {errors.message}
                  </p>
                )}
              </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60">
                  <Send size={16} />
                  {isSubmitting ? 'Sending…' : 'Send Message'}
                </button>

              {status === 'success' && (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800 border border-green-200">
                  <CheckCircle size={16} className="text-green-600" />
                  Thank you. Your message has been received securely.
                </div>
              )}
              {status === 'error' && Object.keys(errors).length > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle size={16} />
                  Please correct the highlighted fields above.
                </div>
              )}
            </form> : <div className="card p-8 text-center"><Mail className="mx-auto text-gold-600" size={28} /><h3 className="mt-4 font-serif text-xl font-bold text-navy-900">Contact form temporarily unavailable</h3><p className="mt-2 text-sm text-navy-600">Please use the direct contact details when they are available.</p></div>}
          </div>
        </div>
      </div>
    </section>
  );
}
