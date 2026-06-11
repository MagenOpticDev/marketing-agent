"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import CampaignForm from "./CampaignForm";
import CampaignDetail from "./CampaignDetail";
import type { Campaign } from "@/types";
import { formatDate } from "@/lib/utils/format";
import {
  PlusIcon,
  MegaphoneIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const CHANNEL_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  email: "אימייל",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  website: "אתר",
  sales_agent: "סוכן",
};

export default function CampaignsClient({
  initialCampaigns,
}: {
  initialCampaigns: Campaign[];
}) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [viewingCampaign, setViewingCampaign] = useState<Campaign | null>(null);
  const [filter, setFilter] = useState("all");
  const supabase = createClient();

  const handleSave = (campaign: Campaign) => {
    if (editingCampaign) {
      setCampaigns((prev) => prev.map((c) => (c.id === campaign.id ? campaign : c)));
    } else {
      setCampaigns((prev) => [campaign, ...prev]);
    }
    setShowForm(false);
    setEditingCampaign(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("למחוק קמפיין זה?")) return;
    const { error } = await supabase.from("campaigns").delete().eq("id", id);
    if (error) { toast.error("שגיאה במחיקה"); return; }
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    toast.success("הקמפיין נמחק");
  };

  const filtered =
    filter === "all" ? campaigns : campaigns.filter((c) => c.status === filter);

  const statusCounts = {
    all: campaigns.length,
    draft: campaigns.filter((c) => c.status === "draft").length,
    active: campaigns.filter((c) => c.status === "active").length,
    completed: campaigns.filter((c) => c.status === "completed").length,
  };

  return (
    <>
      <div className="space-y-5">
        {/* Status filter tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-200">
            {[
              { key: "all", label: "הכל" },
              { key: "active", label: "פעיל" },
              { key: "draft", label: "טיוטה" },
              { key: "completed", label: "הסתיים" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === tab.key
                    ? "bg-brand-600 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label} ({statusCounts[tab.key as keyof typeof statusCounts] || 0})
              </button>
            ))}
          </div>
          <Button
            onClick={() => { setEditingCampaign(null); setShowForm(true); }}
            icon={<PlusIcon className="h-4 w-4" />}
          >
            קמפיין חדש
          </Button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<MegaphoneIcon className="h-12 w-12" />}
            title="אין קמפיינים"
            description="צור קמפיין חדש כדי להתחיל"
            action={{ label: "צור קמפיין ראשון", onClick: () => setShowForm(true) }}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((campaign) => (
              <Card key={campaign.id} hover padding="sm" className="group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <MegaphoneIcon className="h-5 w-5 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {campaign.name}
                      </h3>
                      <StatusBadge status={campaign.status} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                      {campaign.target_audience && (
                        <span>קהל: {campaign.target_audience}</span>
                      )}
                      {campaign.start_date && (
                        <span>
                          {formatDate(campaign.start_date)}
                          {campaign.end_date && ` – ${formatDate(campaign.end_date)}`}
                        </span>
                      )}
                    </div>
                    {campaign.channels && campaign.channels.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {campaign.channels.map((ch) => (
                          <span
                            key={ch}
                            className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                          >
                            {CHANNEL_LABELS[ch] || ch}
                          </span>
                        ))}
                      </div>
                    )}
                    {(campaign.leads_generated !== undefined && campaign.leads_generated > 0) && (
                      <div className="flex gap-4 mt-2 text-xs text-slate-500">
                        <span>{campaign.leads_generated} לידים</span>
                        {campaign.meetings_booked && campaign.meetings_booked > 0 && (
                          <span>{campaign.meetings_booked} פגישות</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => setViewingCampaign(campaign)}
                      className="p-1.5 rounded text-slate-400 hover:text-brand-600 hover:bg-brand-50"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => { setEditingCampaign(campaign); setShowForm(true); }}
                      className="p-1.5 rounded text-slate-400 hover:text-brand-600 hover:bg-brand-50"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(campaign.id)}
                      className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingCampaign(null); }}
        title={editingCampaign ? "עריכת קמפיין" : "קמפיין חדש"}
        size="lg"
      >
        <CampaignForm
          campaign={editingCampaign}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingCampaign(null); }}
        />
      </Modal>

      {viewingCampaign && (
        <Modal
          isOpen={!!viewingCampaign}
          onClose={() => setViewingCampaign(null)}
          title={viewingCampaign.name}
          size="xl"
        >
          <CampaignDetail campaign={viewingCampaign} />
        </Modal>
      )}
    </>
  );
}
