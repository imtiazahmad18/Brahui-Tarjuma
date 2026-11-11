"use client";

import React, { useState } from "react";
import { Mail, MapPin, Send, Feather, CheckCircle } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";

export default function ContactPage() {
  const { locale, t } = useLocale();
  const isBrh = locale === "brh";
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(t("contact.error"));
        return;
      }
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setError(t("contact.networkError"));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center mb-12">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-teal dark:text-teal-400">
          {t("contact.eyebrow")}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gray-900 dark:text-gray-100 mt-2 mb-3">
          {t("contact.heading")}
        </h1>
        {isBrh && <div dir="rtl" className="py-2">
          <span className="font-nastaliq text-2xl sm:text-3xl leading-nastaliq text-brand-gold dark:text-amber-400 font-bold">
            رابطہ و ترجمہ نا مونا تروک پن
          </span>
        </div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Information Card */}
        <div className="md:col-span-5 bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold font-serif text-gray-900 dark:text-gray-100 mb-2">
              {t("contact.guidelines")}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {t("contact.guidelinesText")}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-brand-teal dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {t("contact.email")}
                </span>
                <a
                  href="mailto:editor@brahuitarjuma.org"
                  className="text-sm font-medium text-brand-teal dark:text-teal-300 hover:underline"
                >
                  editor@brahuitarjuma.org
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {t("contact.location")}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Quetta / Kalat, Balochistan
                </span>
              </div>
            </div>
          </div>

          <div dir="rtl" className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 text-xs font-nastaliq leading-nastaliq text-gray-700 dark:text-gray-300">
             {isBrh ? "تینا مٹ و بدل ءَ ای میل نا کمک ءَ روانہ کن؛ اداری بورڈ اوفتے جانچیت ءُ شایع کنت۔" : ""}
          </div>
        </div>

        {/* Right Submission Form */}
        <div className="md:col-span-7 bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            {t("contact.send")}
          </h2>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-emerald-800 dark:text-emerald-200 text-base">
                {t("contact.received")}
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                {t("contact.thanks")} {" "}
                <strong>editor@brahuitarjuma.org</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("contact.name")}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t("contact.namePlaceholder")}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("contact.emailLabel")}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("contact.message")}
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t("contact.messagePlaceholder")}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-teal"
                />
              </div>

              {error && (
                <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-brand-teal text-white hover:bg-brand-teal-light transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>{sending ? t("contact.sending") : t("contact.submit")}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
