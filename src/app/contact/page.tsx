"use client";

import React, { useState } from "react";
import { Mail, MapPin, Send, Feather, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center mb-12">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-teal dark:text-teal-400">
          Editorial Desk
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gray-900 dark:text-gray-100 mt-2 mb-3">
          Contact & Submissions
        </h1>
        <div dir="rtl" className="py-2">
          <span className="font-nastaliq text-2xl sm:text-3xl leading-nastaliq text-brand-gold dark:text-amber-400 font-bold">
            رابطہ و ترجمہ نا مونا تروک پن
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Information Card */}
        <div className="md:col-span-5 bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold font-serif text-gray-900 dark:text-gray-100 mb-2">
              Submission Guidelines
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              We warmly welcome Brahui translations of literature, essays, poetry, and research.
              Translations are published with full attribution to original authors and translators.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-brand-teal dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Direct Editorial Email
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
                  Location & Literary Hub
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Quetta / Kalat, Balochistan
                </span>
              </div>
            </div>
          </div>

          <div dir="rtl" className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 text-xs font-nastaliq leading-nastaliq text-gray-700 dark:text-gray-300">
            شما تینا مٹ و بدل آتے ننے ای میل نا کمک ئٹ راہی کننگ کیرے، ننا ایڈیٹوریل بورڈ اوفتے جانچیسہ ویب سائٹ آ شایع کیک۔
          </div>
        </div>

        {/* Right Submission Form */}
        <div className="md:col-span-7 bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            Send a Message or Query
          </h2>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-emerald-800 dark:text-emerald-200 text-base">
                Message Received!
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Thank you for reaching out. Please also feel free to send your manuscripts directly to{" "}
                <strong>editor@brahuitarjuma.org</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Translator Name"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
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
                  Message or Translation Details
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about the translation (original work, author, language, etc.)..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-teal"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-brand-teal text-white hover:bg-brand-teal-light transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Submit Translation Query</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
