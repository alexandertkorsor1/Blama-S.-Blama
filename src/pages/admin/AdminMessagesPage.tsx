import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  MessageSquare,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    setFeedback(null);

    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setFeedback({ type: 'error', text: 'Unable to load messages. Please try again.' });
    } else {
      setMessages(data);
      setSelectedId((current) => (current && data.some((message) => message.id === current) ? current : data[0]?.id ?? null));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  const selectedMessage = useMemo(
    () => messages.find((message) => message.id === selectedId) ?? null,
    [messages, selectedId],
  );
  const unreadCount = messages.filter((message) => message.read_at === null).length;

  const updateReadState = async (message: ContactMessage, markRead: boolean) => {
    if (updatingId || deletingId) return;

    setUpdatingId(message.id);
    setFeedback(null);
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ read_at: markRead ? new Date().toISOString() : null })
      .eq('id', message.id)
      .select()
      .single();

    if (error) {
      setFeedback({ type: 'error', text: 'Unable to update this message. Please try again.' });
    } else {
      setMessages((current) => current.map((currentMessage) => (currentMessage.id === data.id ? data : currentMessage)));
      setFeedback({ type: 'success', text: markRead ? 'Message marked as read.' : 'Message marked as unread.' });
    }
    setUpdatingId(null);
  };

  const deleteMessage = async (message: ContactMessage) => {
    if (deletingId || updatingId) return;
    const descriptor = message.subject.trim() || `message from ${message.name}`;
    if (!window.confirm(`Delete “${descriptor}” from ${message.name}? This cannot be undone.`)) return;

    setDeletingId(message.id);
    setFeedback(null);
    const { error } = await supabase.from('contact_messages').delete().eq('id', message.id);

    if (error) {
      setFeedback({ type: 'error', text: 'Unable to delete this message. Please try again.' });
    } else {
      setMessages((current) => current.filter((currentMessage) => currentMessage.id !== message.id));
      setSelectedId((current) => (current === message.id ? null : current));
      setFeedback({ type: 'success', text: 'Message deleted successfully.' });
    }
    setDeletingId(null);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fadeIn">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link to="/admin" className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-navy-600 transition-colors hover:text-gold-600">
            <ArrowLeft size={14} /> Back to Command Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-500/20 bg-gold-500/10 text-gold-600"><Mail size={24} /></div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-navy-950">Contact Inquiries</h1>
              <p className="mt-1 text-sm text-navy-600">Review and manage portfolio contact submissions securely.</p>
            </div>
          </div>
        </div>
        <button type="button" onClick={() => void loadMessages()} disabled={isLoading} className="btn-secondary self-start !px-4 !py-2.5 !text-xs disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto">
          <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} /> Refresh Inbox
        </button>
      </div>

      {feedback && (
        <div role={feedback.type === 'error' ? 'alert' : 'status'} className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> : <X size={18} className="mt-0.5 shrink-0" />}
          <span>{feedback.text}</span>
          {feedback.type === 'error' && <button type="button" onClick={() => void loadMessages()} className="ml-auto shrink-0 text-xs font-bold underline underline-offset-2">Retry</button>}
        </div>
      )}

      <section className="card overflow-hidden border border-navy-200 shadow-sm" aria-label="Contact messages">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-navy-800"><MessageSquare size={17} className="text-gold-600" /> Inbox</div>
          <div className="flex items-center gap-2 text-xs font-semibold"><span className="rounded-full bg-navy-100 px-3 py-1 text-navy-700">{messages.length} {messages.length === 1 ? 'message' : 'messages'}</span>{unreadCount > 0 && <span className="rounded-full bg-gold-500/15 px-3 py-1 text-gold-700">{unreadCount} unread</span>}</div>
        </div>

        {isLoading ? (
          <div className="grid min-h-[420px] lg:grid-cols-[minmax(310px,0.9fr)_minmax(0,1.5fr)]">
            <div className="space-y-3 border-r border-navy-100 p-5">{[0, 1, 2, 3].map((index) => <div key={index} className="h-20 animate-pulse rounded-xl bg-navy-50" />)}</div>
            <div className="hidden animate-pulse bg-cream-50 p-7 lg:block"><div className="h-8 w-1/2 rounded bg-navy-100" /><div className="mt-5 h-4 w-2/3 rounded bg-navy-100" /><div className="mt-10 h-28 rounded bg-navy-100" /></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="px-6 py-20 text-center sm:px-10"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-600"><Mail size={27} /></div><h2 className="mt-4 font-serif text-xl font-bold text-navy-950">Your inbox is clear</h2><p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-navy-600">New submissions from the public portfolio contact form will appear here.</p></div>
        ) : (
          <div className="grid min-h-[500px] lg:grid-cols-[minmax(310px,0.9fr)_minmax(0,1.5fr)]">
            <div className="max-h-[640px] divide-y divide-navy-100 overflow-y-auto border-b border-navy-100 lg:border-b-0 lg:border-r">
              {messages.map((message) => {
                const unread = message.read_at === null;
                const active = message.id === selectedId;
                return <button key={message.id} type="button" onClick={() => setSelectedId(message.id)} className={`w-full px-5 py-4 text-left transition-colors sm:px-6 ${active ? 'bg-gold-500/10' : 'hover:bg-navy-50/70'} ${unread ? 'bg-cream-50' : ''}`}>
                  <div className="flex items-start gap-3"><span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${unread ? 'bg-gold-500' : 'bg-transparent'}`} aria-label={unread ? 'Unread' : 'Read'} /><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><span className={`truncate text-sm ${unread ? 'font-bold text-navy-950' : 'font-semibold text-navy-700'}`}>{message.name}</span><time className="shrink-0 text-[11px] text-navy-500">{formatDate(message.created_at)}</time></div><p className={`mt-1 truncate text-sm ${unread ? 'font-semibold text-navy-800' : 'text-navy-600'}`}>{message.subject}</p><p className="mt-1 truncate text-xs text-navy-500">{message.email}</p></div><ChevronRight size={16} className={`mt-2 shrink-0 text-navy-400 ${active ? 'text-gold-600' : ''}`} /></div>
                </button>;
              })}
            </div>

            <div className="bg-cream-50 p-5 sm:p-7">
              {selectedMessage ? <MessageDetail message={selectedMessage} isUpdating={updatingId === selectedMessage.id} isDeleting={deletingId === selectedMessage.id} actionsDisabled={Boolean(updatingId || deletingId)} onToggleRead={() => void updateReadState(selectedMessage, selectedMessage.read_at === null)} onDelete={() => void deleteMessage(selectedMessage)} /> : <div className="flex h-full min-h-56 items-center justify-center text-center text-sm text-navy-500">Select a message to view its details.</div>}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function MessageDetail({
  message,
  isUpdating,
  isDeleting,
  actionsDisabled,
  onToggleRead,
  onDelete,
}: {
  message: ContactMessage;
  isUpdating: boolean;
  isDeleting: boolean;
  actionsDisabled: boolean;
  onToggleRead: () => void;
  onDelete: () => void;
}) {
  const unread = message.read_at === null;

  return (
    <article aria-live="polite">
      <div className="flex flex-col gap-4 border-b border-navy-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0"><div className="mb-2 flex flex-wrap gap-2"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${unread ? 'bg-gold-500/15 text-gold-700' : 'bg-navy-100 text-navy-700'}`}>{unread ? 'Unread' : 'Read'}</span>{message.status && <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-navy-600">{message.status}</span>}</div><h2 className="font-serif text-2xl font-bold text-navy-950">{message.subject}</h2><p className="mt-2 text-sm text-navy-600">From <span className="font-semibold text-navy-800">{message.name}</span> · <a href={`mailto:${message.email}`} className="text-gold-700 underline underline-offset-2 hover:text-gold-800">{message.email}</a></p><p className="mt-1 flex items-center gap-1.5 text-xs text-navy-500"><Clock3 size={13} /> {formatDate(message.created_at)}</p></div>
        <div className="flex flex-wrap gap-2 sm:justify-end"><button type="button" onClick={onToggleRead} disabled={actionsDisabled} className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3 py-2 text-xs font-semibold text-navy-700 transition-colors hover:border-gold-400 hover:text-gold-700 disabled:cursor-not-allowed disabled:opacity-50">{isUpdating ? <Loader2 size={14} className="animate-spin" /> : unread ? <Eye size={14} /> : <EyeOff size={14} />}{isUpdating ? 'Updating…' : unread ? 'Mark Read' : 'Mark Unread'}</button><button type="button" onClick={onDelete} disabled={actionsDisabled} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">{isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}{isDeleting ? 'Deleting…' : 'Delete'}</button></div>
      </div>
      <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-navy-700">{message.message}</div>
      {message.replied_at && <p className="mt-7 border-t border-navy-100 pt-4 text-xs text-navy-500">A response was recorded on {formatDate(message.replied_at)}.</p>}
    </article>
  );
}
