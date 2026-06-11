"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import EmptyState from "@/components/ui/EmptyState";
import LeadForm from "./LeadForm";
import LeadDetail from "./LeadDetail";
import type { Lead } from "@/types";
import { formatDate } from "@/lib/utils/format";
import {
  PlusIcon,
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  PencilIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const STATUS_PIPELINE = [
  { key: "new", label: "חדש", color: "bg-purple-500" },
  { key: "contacted", label: "נוצר קשר", color: "bg-blue-500" },
  { key: "meeting_scheduled", label: "נקבעה פגישה", color: "bg-indigo-500" },
  { key: "proposal_sent", label: "הצעה נשלחה", color: "bg-orange-500" },
  { key: "waiting", label: "ממתין", color: "bg-yellow-500" },
  { key: "won", label: "נסגר ✓", color: "bg-green-500" },
  { key: "lost", label: "אבוד", color: "bg-red-400" },
];

export default function LeadsClient({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const supabase = createClient();

  const handleSave = (lead: Lead) => {
    if (editingLead) {
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? lead : l)));
    } else {
      setLeads((prev) => [lead, ...prev]);
    }
    setShowForm(false);
    setEditingLead(null);
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus })
      .eq("id", leadId);
    if (error) { toast.error("שגיאה בעדכון סטטוס"); return; }
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus as Lead["status"] } : l))
    );
  };

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      l.name.toLowerCase().includes(q) ||
      l.company?.toLowerCase().includes(q) ||
      l.contact_person?.toLowerCase().includes(q) ||
      l.phone?.includes(q);
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusOptions = [
    { value: "all", label: "כל הסטטוסים" },
    ...STATUS_PIPELINE.map((s) => ({ value: s.key, label: s.label })),
  ];

  const stats = STATUS_PIPELINE.reduce((acc, s) => {
    acc[s.key] = leads.filter((l) => l.status === s.key).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <div className="space-y-5">
        {/* Pipeline overview */}
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {STATUS_PIPELINE.map((s) => (
            <Card
              key={s.key}
              padding="sm"
              className="text-center cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setFilterStatus(s.key === filterStatus ? "all" : s.key)}
            >
              <p className="text-xl font-bold text-slate-900">{stats[s.key] || 0}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex gap-3 flex-wrap items-end">
          <div className="flex-1 min-w-[200px]">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חיפוש ליד..."
              startIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
            />
          </div>
          <div className="w-44">
            <Select
              options={statusOptions}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            />
          </div>
          <Button
            onClick={() => { setEditingLead(null); setShowForm(true); }}
            icon={<PlusIcon className="h-4 w-4" />}
          >
            ליד חדש
          </Button>
        </div>

        {/* Leads table */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={<UserGroupIcon className="h-12 w-12" />}
            title="אין לידים"
            description="הוסף לידים ומשימות למעקב"
            action={{ label: "הוסף ליד ראשון", onClick: () => setShowForm(true) }}
          />
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">שם / חברה</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">קשר</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">עניין</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">מעקב</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">סטטוס</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((lead) => {
                  const today = new Date().toDateString();
                  const followUpDate = lead.follow_up_date ? new Date(lead.follow_up_date) : null;
                  const isOverdue = followUpDate && followUpDate < new Date() && followUpDate.toDateString() !== today;
                  const isToday = followUpDate && followUpDate.toDateString() === today;

                  return (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{lead.name}</p>
                        {lead.company && <p className="text-xs text-slate-500">{lead.company}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          {lead.phone && (
                            <span className="flex items-center gap-1 text-xs text-slate-600">
                              <PhoneIcon className="h-3 w-3" />
                              {lead.phone}
                            </span>
                          )}
                          {lead.email && (
                            <span className="flex items-center gap-1 text-xs text-slate-600">
                              <EnvelopeIcon className="h-3 w-3" />
                              {lead.email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-slate-600 max-w-[150px] truncate">
                          {lead.product_interest || lead.category_interest || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {lead.follow_up_date ? (
                          <span className={`text-xs font-medium ${
                            isOverdue ? "text-red-600" : isToday ? "text-orange-600" : "text-slate-600"
                          }`}>
                            {isOverdue ? "⚠️ " : isToday ? "⏰ " : ""}
                            {formatDate(lead.follow_up_date)}
                          </span>
                        ) : <span className="text-xs text-slate-400">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className="text-xs border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {STATUS_PIPELINE.map((s) => (
                            <option key={s.key} value={s.key}>{s.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setViewingLead(lead)}
                            className="p-1 rounded text-slate-400 hover:text-brand-600"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => { setEditingLead(lead); setShowForm(true); }}
                            className="p-1 rounded text-slate-400 hover:text-brand-600"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingLead(null); }}
        title={editingLead ? "עריכת ליד" : "ליד חדש"}
        size="lg"
      >
        <LeadForm lead={editingLead} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingLead(null); }} />
      </Modal>

      {viewingLead && (
        <Modal
          isOpen={!!viewingLead}
          onClose={() => setViewingLead(null)}
          title={`${viewingLead.name} – ${viewingLead.company || "ליד"}`}
          size="lg"
        >
          <LeadDetail lead={viewingLead} />
        </Modal>
      )}
    </>
  );
}
