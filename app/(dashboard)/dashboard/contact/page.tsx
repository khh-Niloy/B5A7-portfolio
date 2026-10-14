"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Inbox,
  Send,
  Trash2,
  ExternalLink,
  Plus,
  Save,
  MessageSquare,
  Clock,
  User,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import getAbout from "@/helper/getAbout";
import { updateAbout } from "@/actions/about/updateAbout";
import { getContactMessages } from "@/actions/contact/getContactMessages";
import { deleteContactMessage } from "@/actions/contact/deleteContactMessage";
import type { PortfolioData, Contact } from "@/interfaces/interface";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
}

type TabType = "inbox" | "channels";

export default function ContactManagement() {
  const [activeTab, setActiveTab] = useState<TabType>("inbox");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [aboutData, setAboutData] = useState<PortfolioData | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<{
    email: string;
    contacts: Contact[];
  }>({
    defaultValues: {
      email: "",
      contacts: [],
    },
  });

  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact,
  } = useFieldArray({
    control,
    name: "contacts",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [aboutRes, messagesRes] = await Promise.allSettled([
        getAbout(),
        getContactMessages(),
      ]);

      if (aboutRes.status === "fulfilled" && aboutRes.value) {
        setAboutData(aboutRes.value);
        reset({
          email: aboutRes.value.aboutInfo?.email || "",
          contacts: aboutRes.value.contacts || [],
        });
      }

      if (messagesRes.status === "fulfilled") {
        setMessages(messagesRes.value || []);
      }
    } catch (err) {
      console.error("Failed to load contact data:", err);
      toast.error("Failed to load contact details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteMessage = async (id: string, senderName: string) => {
    if (!confirm(`Are you sure you want to delete message from ${senderName}?`)) return;

    try {
      const res = await deleteContactMessage(id);
      if (res?.success) {
        toast.success("Message deleted successfully! 🗑️");
        setMessages((prev) => prev.filter((m) => m._id !== id));
      } else {
        toast.error(res?.message || "Failed to delete message");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete message");
    }
  };

  const onSubmitChannels = async (values: { email: string; contacts: Contact[] }) => {
    setSaving(true);
    try {
      const payload: Partial<PortfolioData> = {
        contacts: values.contacts,
        aboutInfo: {
          email: values.email,
          sampleText: aboutData?.aboutInfo?.sampleText || [],
        },
      };

      const res = await updateAbout(payload, aboutData?._id);

      if (res?.success || res?.data) {
        toast.success("Contact channels updated successfully! 📬");
        loadData();
      } else {
        toast.error(res?.message || "Failed to update contact channels");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save contact channels");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto" />
          <p className="mt-4 text-gray-400">Loading inbox & contact channels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Mail className="w-8 h-8 text-emerald-400" />
            Contact Channels & Visitor Inbox
          </h1>
          <p className="mt-2 text-gray-400">
            View inquiries submitted through your website's contact form and manage direct contact links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("inbox")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "inbox"
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                : "bg-white/[0.04] text-gray-400 hover:text-white"
            }`}
          >
            <Inbox className="w-4 h-4" />
            Visitor Inquiries ({messages.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("channels")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "channels"
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                : "bg-white/[0.04] text-gray-400 hover:text-white"
            }`}
          >
            <Send className="w-4 h-4" />
            Direct Channels
          </button>
        </div>
      </div>

      {/* TAB 1: Visitor Inquiries Inbox */}
      {activeTab === "inbox" && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-semibold text-white">Received Messages ({messages.length})</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              className="border-white/10 text-gray-300 hover:bg-white/5 text-xs"
            >
              Refresh Inbox
            </Button>
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Inbox className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No messages received yet. Visitor form submissions will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className="p-5 rounded-xl border border-white/10 bg-black/30 hover:border-white/20 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                        {msg.name ? msg.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{msg.name}</h4>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-xs text-emerald-400 hover:underline"
                        >
                          {msg.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(msg.createdAt).toLocaleString()}</span>
                      </div>

                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(
                          msg.subject || "Your Portfolio Inquiry"
                        )}`}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs border border-white/10 transition-all"
                      >
                        Reply
                      </a>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteMessage(msg._id, msg.name)}
                        className="text-red-400 hover:bg-red-500/10 h-7 w-7 p-0"
                        title="Delete message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {msg.subject && (
                    <p className="text-xs font-semibold text-gray-300">
                      Subject: <span className="font-normal text-white">{msg.subject}</span>
                    </p>
                  )}

                  <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Direct Contact Channels */}
      {activeTab === "channels" && (
        <form onSubmit={handleSubmit(onSubmitChannels)} className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-semibold text-white">Direct Email & Contact Links</h2>
              <p className="text-xs text-gray-400">
                Primary email address and instant communication channels (WhatsApp, Telegram, Calendly).
              </p>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-300">
                Primary Contact Email
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="e.g. niloy@example.com"
                className="mt-1.5 bg-black/40 border-white/10 text-white max-w-md"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300 font-semibold text-base">
                  Direct Communication Channels
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendContact({ name: "", link: "" })}
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Contact Channel
                </Button>
              </div>

              <div className="space-y-3">
                {contactFields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-black/20"
                  >
                    <Input
                      {...register(`contacts.${idx}.name` as const)}
                      placeholder="Channel (e.g. WhatsApp, Telegram, Calendly)"
                      className="bg-black/40 border-white/10 text-white text-sm w-1/3"
                      required
                    />
                    <Input
                      {...register(`contacts.${idx}.link` as const)}
                      placeholder="URL (e.g. https://wa.me/... or https://t.me/...)"
                      className="bg-black/40 border-white/10 text-white text-sm flex-1"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeContact(idx)}
                      className="text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {contactFields.length === 0 && (
                  <p className="text-sm text-gray-500 italic py-2">
                    No custom channels added. Click "Add Contact Channel" to add links.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <Button
              type="submit"
              disabled={saving || !isDirty}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2.5 font-medium shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Contact Channels"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
