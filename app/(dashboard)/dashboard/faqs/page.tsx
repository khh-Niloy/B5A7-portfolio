"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  Save,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Layout,
  Globe,
} from "lucide-react";
import toast from "react-hot-toast";
import getAbout from "@/helper/getAbout";
import { updateAbout } from "@/actions/about/updateAbout";
import type { PortfolioData, Faq } from "@/interfaces/interface";

export default function FaqManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [aboutId, setAboutId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const { register, handleSubmit, reset, watch } = useForm<{
    question: string;
    answer: string;
    isSidebar: boolean;
    isPublic: boolean;
    order: number;
  }>({
    defaultValues: {
      question: "",
      answer: "",
      isSidebar: true,
      isPublic: true,
      order: 0,
    },
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAbout();
      if (data) {
        setAboutId(data._id || null);
        setFaqs(data.faqs || []);
      }
    } catch (err) {
      console.error("Failed to load FAQs:", err);
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingIndex(null);
    reset({
      question: "",
      answer: "",
      isSidebar: true,
      isPublic: true,
      order: faqs.length + 1,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    const item = faqs[index];
    reset({
      question: item.question,
      answer: item.answer,
      isSidebar: item.isSidebar !== false,
      isPublic: item.isPublic !== false,
      order: item.order ?? index + 1,
    });
    setShowModal(true);
  };

  const handleDelete = async (index: number) => {
    if (!confirm("Are you sure you want to delete this FAQ item?")) return;

    const updated = faqs.filter((_, i) => i !== index);
    setSaving(true);
    try {
      const res = await updateAbout({ faqs: updated }, aboutId || undefined);
      if (res?.success || res?.data) {
        toast.success("FAQ deleted successfully! 🗑️");
        setFaqs(updated);
      } else {
        toast.error("Failed to delete FAQ");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete FAQ");
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= faqs.length) return;

    const copy = [...faqs];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;

    setSaving(true);
    try {
      const res = await updateAbout({ faqs: copy }, aboutId || undefined);
      if (res?.success || res?.data) {
        setFaqs(copy);
        toast.success("Order updated!");
      }
    } catch {
      toast.error("Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (index: number, field: "isSidebar" | "isPublic") => {
    const copy = [...faqs];
    copy[index] = {
      ...copy[index],
      [field]: !copy[index][field],
    };

    setSaving(true);
    try {
      const res = await updateAbout({ faqs: copy }, aboutId || undefined);
      if (res?.success || res?.data) {
        setFaqs(copy);
        toast.success("Visibility updated!");
      }
    } catch {
      toast.error("Failed to update visibility");
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = async (values: any) => {
    setSaving(true);
    try {
      const item: Faq = {
        question: values.question.trim(),
        answer: values.answer.trim(),
        isSidebar: Boolean(values.isSidebar),
        isPublic: Boolean(values.isPublic),
        order: Number(values.order) || 0,
      };

      let updatedList: Faq[];
      if (editingIndex !== null) {
        updatedList = [...faqs];
        updatedList[editingIndex] = item;
      } else {
        updatedList = [...faqs, item];
      }

      const res = await updateAbout({ faqs: updatedList }, aboutId || undefined);

      if (res?.success || res?.data) {
        toast.success(
          editingIndex !== null ? "FAQ updated successfully! 💬" : "FAQ added successfully! 💬"
        );
        setShowModal(false);
        loadData();
      } else {
        toast.error(res?.message || "Failed to save FAQ");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save FAQ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto" />
          <p className="mt-4 text-gray-400">Loading FAQs...</p>
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
            <HelpCircle className="w-8 h-8 text-emerald-400" />
            Frequently Asked Questions (FAQs)
          </h1>
          <p className="mt-2 text-gray-400">
            Manage common engineering questions, rate inquiries, and toggle whether they appear in the left sidebar or the public FAQ accordion.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      {/* FAQs List */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm space-y-4">
        <h2 className="text-xl font-semibold text-white mb-4">
          All Questions ({faqs.length})
        </h2>

        {faqs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No FAQs added yet.</p>
            <Button onClick={handleOpenAdd} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First FAQ
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-white/10 bg-black/30 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-emerald-400 font-semibold">
                      Q{idx + 1}.
                    </span>
                    <h3 className="text-base font-bold text-white">{item.question}</h3>
                  </div>

                  <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed pl-6">
                    {item.answer}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pl-6 pt-2">
                    <button
                      type="button"
                      onClick={() => handleToggle(idx, "isSidebar")}
                      className={`px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5 transition-all ${
                        item.isSidebar !== false
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                          : "bg-white/5 text-gray-500 border border-white/10"
                      }`}
                    >
                      <Layout className="w-3 h-3" />
                      Sidebar Quick FAQ: {item.isSidebar !== false ? "Visible" : "Hidden"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggle(idx, "isPublic")}
                      className={`px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5 transition-all ${
                        item.isPublic !== false
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-white/5 text-gray-500 border border-white/10"
                      }`}
                    >
                      <Globe className="w-3 h-3" />
                      Public Accordion: {item.isPublic !== false ? "Visible" : "Hidden"}
                    </button>
                  </div>
                </div>

                {/* Actions & Reordering */}
                <div className="flex items-center gap-2 self-end md:self-start">
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      disabled={idx === 0 || saving}
                      onClick={() => handleMove(idx, "up")}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 disabled:opacity-20"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === faqs.length - 1 || saving}
                      onClick={() => handleMove(idx, "down")}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 disabled:opacity-20"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenEdit(idx)}
                    className="border-white/10 text-gray-300 hover:bg-white/5 text-xs"
                  >
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(idx)}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#000319] p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                {editingIndex !== null ? "Edit FAQ" : "Add New FAQ"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="question" className="text-gray-300">
                  Question
                </Label>
                <Input
                  id="question"
                  {...register("question")}
                  placeholder="e.g. What is your primary tech stack?"
                  className="mt-1 bg-black/40 border-white/10 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="answer" className="text-gray-300">
                  Answer
                </Label>
                <Textarea
                  id="answer"
                  {...register("answer")}
                  rows={4}
                  placeholder="Detailed, helpful explanation..."
                  className="mt-1 bg-black/40 border-white/10 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-2 p-3 rounded-lg border border-white/10 bg-black/30 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("isSidebar")}
                    className="rounded border-white/20 bg-black/40 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Show in Left Sidebar Quick FAQs</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-lg border border-white/10 bg-black/30 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("isPublic")}
                    className="rounded border-white/20 bg-black/40 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Show in Public FAQ Accordion</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="border-white/10 text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-lg shadow-emerald-500/20"
                >
                  {saving ? "Saving..." : editingIndex !== null ? "Update FAQ" : "Save FAQ"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
