"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Article, CategorySlug, Chapter, Writer, CATEGORIES } from "@/types";
import { generateSlug, formatDate } from "@/lib/utils";
import ArticleRenderer from "@/components/ArticleRenderer";
import {
  Lock,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  CheckCircle,
  AlertCircle,
  FileText,
  BookOpen,
  User,
  Image as ImageIcon,
  Upload,
  ArrowRight,
  Search,
  Check,
  ChevronDown,
  Layers,
  Sparkles,
  Mail,
} from "lucide-react";

export default function AdminPage() {
  // Auth state
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [recoveryStep, setRecoveryStep] = useState<"login" | "request" | "verify">("login");
  const [recoveryOtp, setRecoveryOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");
  const [recoveryBusy, setRecoveryBusy] = useState(false);

  // Navigation tab in admin
  const [activeTab, setActiveTab] = useState<"articles" | "editor" | "writers" | "messages">("articles");

  // Data states
  const [articles, setArticles] = useState<Article[]>([]);
  const [writers, setWriters] = useState<Writer[]>([]);
  const [contactMessages, setContactMessages] = useState<Array<{ id: string; name: string; email: string; message: string; created_at: string }>>([]);
  const [contactMessagesLoading, setContactMessagesLoading] = useState(false);
  const [contactMessagesError, setContactMessagesError] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all");

  // Form State for editing or creating article
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    subtitle: string;
    slug: string;
    category: CategorySlug;
    original_writer_name: string;
    original_title: string;
    translator_name: string;
    cover_image_url: string;
    cover_alt: string;
    body: string;
    original_text: string;
    original_lang: string;
    original_dir: "ltr" | "rtl";
    source_credit: string;
    pdf_url: string;
    meta_description: string;
    status: "draft" | "published";
    chapters: Chapter[];
  }>({
    title: "",
    subtitle: "",
    slug: "",
    category: "fiction",
    original_writer_name: "",
    original_title: "",
    translator_name: "",
    cover_image_url: "/brand-logo-circle.png",
    cover_alt: "",
    body: "",
    original_text: "",
    original_lang: "en",
    original_dir: "ltr",
    source_credit: "",
    pdf_url: "",
    meta_description: "",
    status: "draft",
    chapters: [],
  });

  // Writer form state
  const [writerFormData, setWriterFormData] = useState<{
    id?: string;
    name: string;
    slug: string;
    bio: string;
    photo_url: string;
  }>({
    name: "",
    slug: "",
    bio: "",
    photo_url: "",
  });
  const [editingWriterId, setEditingWriterId] = useState<string | null>(null);

  // Status banners
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingWriterPhoto, setUploadingWriterPhoto] = useState(false);

  // Load auth session
  useEffect(() => {
    async function checkAuth() {
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user.app_metadata?.role === "owner") {
            setSession(data.session);
          } else if (data.session) {
            await supabase.auth.signOut();
            setAuthError("This account is not authorized to access the owner dashboard.");
          }
        } catch (e) {
          console.warn("Auth check error:", e);
        }
      } else {
        // Supabase not configured — do not allow any access
        console.warn("Supabase is not configured. Admin access is unavailable.");
      }
      setAuthLoading(false);
    }
    checkAuth();
  }, []);

  // Keep the dashboard in sync when a session expires or changes in another tab.
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user.app_metadata?.role === "owner") setSession(session);
      else setSession(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load articles and writers
  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured) {
        try {
          const [articlesResult, writersResult] = await Promise.all([
            supabase
              .from("articles")
              .select(`*, writer:writers(*), chapters(*)`)
              .order("created_at", { ascending: false }),
            supabase.from("writers").select("*"),
          ]);

          if (articlesResult.error) throw articlesResult.error;
          if (writersResult.error) throw writersResult.error;
          setArticles(articlesResult.data || []);
          setWriters(writersResult.data || []);
        } catch (e) {
          console.warn("Supabase load error:", e);
          setArticles([]);
          setWriters([]);
        }
      } else {
        setArticles([]);
        setWriters([]);
      }
    }

    if (session) {
      loadData();
    }
  }, [session]);

  useEffect(() => {
    if (!session || !isSupabaseConfigured) return;
    let cancelled = false;
    async function loadContactMessages() {
      setContactMessagesLoading(true);
      setContactMessagesError("");
      const { data, error } = await supabase
        .from("contact_messages")
        .select("id, name, email, message, created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      if (cancelled) return;
      if (error) {
        setContactMessagesError("Could not load messages. Check that the contact_messages table and owner access policy are set up in Supabase.");
      } else {
        setContactMessages(data || []);
      }
      setContactMessagesLoading(false);
    }
    loadContactMessages();
    return () => { cancelled = true; };
  }, [session, activeTab]);

  // Auth handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthError(error.message);
      } else if (data.session?.user.app_metadata?.role === "owner") {
        setSession(data.session);
      } else if (data.session) {
        await supabase.auth.signOut();
        setAuthError("This account is not authorized. Sign in with the designated owner account.");
      }
    } else {
      // Supabase not configured — refuse all logins with a clear message
      setAuthError(
        "Admin access is not available. Supabase credentials have not been configured. Please add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
      );
    }
  };

  const handleRequestPasswordOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setRecoveryMessage("");
    if (!isSupabaseConfigured) {
      setAuthError("Password recovery needs Supabase. Add the Supabase URL and anon key to your local environment first.");
      return;
    }
    setRecoveryBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    setRecoveryBusy(false);
    if (error) {
      setAuthError(error.message);
      return;
    }
    setRecoveryStep("verify");
    setRecoveryMessage("If this email belongs to an account, a reset code has been sent. Check your inbox and spam folder.");
  };

  const handleVerifyPasswordOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setRecoveryMessage("");
    if (newPassword.length < 8) {
      setAuthError("Choose a password with at least 8 characters.");
      return;
    }
    setRecoveryBusy(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: recoveryOtp.trim(),
      type: "recovery",
    });
    if (error) {
      setRecoveryBusy(false);
      setAuthError(error.message);
      return;
    }
    if (data.user?.app_metadata?.role !== "owner") {
      await supabase.auth.signOut();
      setRecoveryBusy(false);
      setAuthError("This account is not authorized to reset the owner password.");
      return;
    }
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setRecoveryBusy(false);
    if (updateError) {
      setAuthError(updateError.message);
      return;
    }
    await supabase.auth.signOut();
    setPassword("");
    setRecoveryOtp("");
    setNewPassword("");
    setRecoveryStep("login");
    setRecoveryMessage("Password updated. Sign in with your new password.");
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem("admin_local_session");
    setSession(null);
  };

  // Article creation / editing handlers
  const handleStartNewArticle = () => {
    setEditingArticleId(null);
    setFormData({
      title: "",
      subtitle: "",
      slug: "",
      category: "fiction",
      original_writer_name: "",
      original_title: "",
      translator_name: "",
      cover_image_url: "/brand-logo-circle.png",
      cover_alt: "",
      body: "",
      original_text: "",
      original_lang: "en",
      original_dir: "ltr",
      source_credit: "",
      pdf_url: "",
      meta_description: "",
      status: "draft",
      chapters: [],
    });
    setActiveTab("editor");
  };

  const handleEditArticle = (art: Article) => {
    setEditingArticleId(art.id);
    setFormData({
      title: art.title,
      subtitle: art.subtitle || "",
      slug: art.slug,
      category: art.category,
      original_writer_name: art.writer?.name || "",
      original_title: art.original_title || "",
      translator_name: art.translator_name || "",
      cover_image_url: art.cover_image_url || "/brand-logo-circle.png",
      cover_alt: art.cover_alt || "",
      body: art.body,
      original_text: art.original_text || "",
      original_lang: art.original_lang || "en",
      original_dir: art.original_dir || "ltr",
      source_credit: art.source_credit || "",
      pdf_url: art.pdf_url || "",
      meta_description: art.meta_description || "",
      status: art.status,
      chapters: art.chapters || [],
    });
    setActiveTab("editor");
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from("articles").delete().eq("id", id);
        if (error) throw error;
      } catch (err) {
        console.error(err);
        alert("Could not delete the article. Check your connection and owner access, then try again.");
        return;
      }
    }

    setArticles((prev) => prev.filter((a) => a.id !== id));
    notifySuccess("Article deleted successfully.");
  };

  const handleTitleChange = (newTitle: string) => {
    setFormData((prev) => {
      // Auto-generate slug if slug is empty or was automatically generated
      const updatedSlug = !prev.slug || prev.slug.startsWith("article-") ? generateSlug(newTitle) : prev.slug;
      return {
        ...prev,
        title: newTitle,
        slug: updatedSlug,
      };
    });
  };

  const handleAutoFillMetaDescription = () => {
    const raw = formData.body.replace(/\n+/g, " ").trim();
    const snippet = raw.slice(0, 150);
    setFormData((prev) => ({
      ...prev,
      meta_description: snippet,
    }));
  };

  // Chapter management for novels
  const handleAddChapter = () => {
    const nextNum = formData.chapters.length + 1;
    const newChapter: Chapter = {
      id: `chap-${Date.now()}`,
      article_id: editingArticleId || "temp",
      chapter_number: nextNum,
      title: `Chapter ${nextNum}`,
      body: "",
    };
    setFormData((prev) => ({
      ...prev,
      chapters: [...prev.chapters, newChapter],
    }));
  };

  const handleUpdateChapter = (index: number, field: "title" | "body", value: string) => {
    setFormData((prev) => {
      const updated = [...prev.chapters];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, chapters: updated };
    });
  };

  const handleRemoveChapter = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((_, idx) => idx !== index),
    }));
  };

  // Save Article (Draft or Published)
  const handleSaveArticle = async (newStatus?: "draft" | "published") => {
    if (!formData.title.trim()) {
      alert("Title in Brahui is required!");
      return;
    }
    if (!formData.original_writer_name.trim()) {
      alert("Original writer name is required!");
      return;
    }
    if (!formData.body.trim()) {
      alert("Brahui body text is required!");
      return;
    }

    const statusToSave = newStatus || formData.status;
    const finalSlug = formData.slug || generateSlug(formData.title);

    // Find or create writer
    let matchedWriter = writers.find(
      (w) => w.name.toLowerCase() === formData.original_writer_name.toLowerCase()
    );

    let writerId = matchedWriter ? matchedWriter.id : null;

    if (!matchedWriter && isSupabaseConfigured) {
      try {
        const { data: newW, error: writerInsertError } = await supabase
          .from("writers")
          .insert({
            name: formData.original_writer_name,
            slug: generateSlug(formData.original_writer_name),
            bio: `Original author of translated work ${formData.original_title || ""}`,
          })
          .select()
          .single();
        if (writerInsertError) throw writerInsertError;
        if (!newW) throw new Error("Supabase did not return the new writer record.");
        if (newW) {
          writerId = newW.id;
          matchedWriter = newW;
          setWriters((prev) => [...prev, newW]);
        }
      } catch (err) {
        console.error("Writer creation failed:", err);
        alert("Could not save the original writer. Check your Supabase connection and owner access, then try again.");
        return;
      }
    }

    const articlePayload: Article = {
      id: editingArticleId || `art-${Date.now()}`,
      title: formData.title,
      subtitle: formData.subtitle || null,
      slug: finalSlug,
      category: formData.category,
      body: formData.body,
      cover_image_url: formData.cover_image_url || "/brand-logo-circle.png",
      cover_alt: formData.cover_alt || formData.title,
      writer_id: writerId,
      writer: matchedWriter || {
        id: writerId || "w-new",
        name: formData.original_writer_name,
        slug: generateSlug(formData.original_writer_name),
      },
      original_title: formData.original_title || null,
      original_text: formData.original_text || null,
      original_lang: formData.original_lang || "en",
      original_dir: formData.original_dir || "ltr",
      source_credit: formData.source_credit || null,
      translator_name: formData.translator_name || null,
      pdf_url: formData.pdf_url || null,
      meta_description: formData.meta_description || formData.body.slice(0, 150),
      status: statusToSave,
      published_at: statusToSave === "published" ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      chapters: formData.chapters,
    };

    if (isSupabaseConfigured) {
      try {
        if (editingArticleId) {
          // Update
          const { error } = await supabase
            .from("articles")
            .update({
              title: articlePayload.title,
              subtitle: articlePayload.subtitle,
              slug: articlePayload.slug,
              category: articlePayload.category,
              body: articlePayload.body,
              cover_image_url: articlePayload.cover_image_url,
              cover_alt: articlePayload.cover_alt,
              writer_id: writerId,
              original_title: articlePayload.original_title,
              original_text: articlePayload.original_text,
              original_lang: articlePayload.original_lang,
              original_dir: articlePayload.original_dir,
              source_credit: articlePayload.source_credit,
              translator_name: articlePayload.translator_name,
              pdf_url: articlePayload.pdf_url,
              meta_description: articlePayload.meta_description,
              status: articlePayload.status,
              published_at: articlePayload.published_at,
              updated_at: new Date().toISOString(),
            })
            .eq("id", editingArticleId);
          if (error) throw error;
        } else {
          // Insert
          const { data: inserted, error } = await supabase
            .from("articles")
            .insert({
              title: articlePayload.title,
              subtitle: articlePayload.subtitle,
              slug: articlePayload.slug,
              category: articlePayload.category,
              body: articlePayload.body,
              cover_image_url: articlePayload.cover_image_url,
              cover_alt: articlePayload.cover_alt,
              writer_id: writerId,
              original_title: articlePayload.original_title,
              original_text: articlePayload.original_text,
              original_lang: articlePayload.original_lang,
              original_dir: articlePayload.original_dir,
              source_credit: articlePayload.source_credit,
              translator_name: articlePayload.translator_name,
              pdf_url: articlePayload.pdf_url,
              meta_description: articlePayload.meta_description,
              status: articlePayload.status,
              published_at: articlePayload.published_at,
            })
            .select()
            .single();

          if (error) throw error;

          if (inserted) {
            articlePayload.id = inserted.id;
          }
        }

        if (editingArticleId) {
          const { error: chapterDeleteError } = await supabase
            .from("chapters")
            .delete()
            .eq("article_id", articlePayload.id);
          if (chapterDeleteError) throw chapterDeleteError;
        }
        if (formData.chapters.length > 0) {
          const { error: chapterInsertError } = await supabase.from("chapters").insert(
            formData.chapters.map((chapter, index) => ({
              article_id: articlePayload.id,
              chapter_number: index + 1,
              title: chapter.title,
              body: chapter.body,
            }))
          );
          if (chapterInsertError) throw chapterInsertError;
        }
      } catch (e) {
        console.error("Save error:", e);
        alert("Could not save the article. Check your connection, database setup, and owner access, then try again.");
        return;
      }
    }

    // Update local state
    setArticles((prev) => {
      const exists = prev.some((a) => a.id === articlePayload.id);
      if (exists) {
        return prev.map((a) => (a.id === articlePayload.id ? articlePayload : a));
      } else {
        return [articlePayload, ...prev];
      }
    });

    notifySuccess(
      statusToSave === "published"
        ? "Article published and instantly live on website!"
        : "Article draft saved successfully."
    );
    setActiveTab("articles");
  };

  // Image upload handler to Supabase storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isSupabaseConfigured) {
      setUploadingImage(true);
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `covers/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("covers")
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from("covers")
          .getPublicUrl(filePath);

        setFormData((prev) => ({
          ...prev,
          cover_image_url: publicUrlData.publicUrl,
        }));
        notifySuccess("Cover image uploaded to Supabase Storage!");
      } catch (err: any) {
        alert(`Storage upload error: ${err.message || "Failed"}. You can also paste an image URL.`);
      } finally {
        setUploadingImage(false);
      }
    } else {
      // Local fallback: create object URL or keep existing
      const localUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        cover_image_url: localUrl,
      }));
      notifySuccess("Local image selected for preview.");
    }
  };

  const handleWriterPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Choose a JPG, PNG, or WebP image for the writer photo.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Writer photos must be 5 MB or smaller.");
      return;
    }
    if (!isSupabaseConfigured) {
      alert("Configure Supabase before uploading and saving writer photos.");
      return;
    }

    setUploadingWriterPhoto(true);
    try {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `writers/${fileName}`;
      const { error } = await supabase.storage.from("covers").upload(filePath, file, {
        contentType: file.type,
        cacheControl: "31536000",
      });
      if (error) throw error;

      const { data } = supabase.storage.from("covers").getPublicUrl(filePath);
      setWriterFormData((prev) => ({ ...prev, photo_url: data.publicUrl }));
      notifySuccess("Writer photo uploaded.");
    } catch (err: any) {
      console.error("Writer photo upload error:", err);
      alert(`Could not upload the writer photo. Check the public covers bucket and owner upload policy. ${err.message || ""}`);
    } finally {
      setUploadingWriterPhoto(false);
    }
  };

  // Writers management handlers
  const handleSaveWriter = async () => {
    if (!writerFormData.name.trim()) {
      alert("Writer name is required!");
      return;
    }

    const payload: Writer = {
      id: editingWriterId || (isSupabaseConfigured ? crypto.randomUUID() : `w-${Date.now()}`),
      name: writerFormData.name,
      slug: writerFormData.slug || generateSlug(writerFormData.name),
      bio: writerFormData.bio,
      photo_url: writerFormData.photo_url || null,
    };

    if (isSupabaseConfigured) {
      try {
        if (editingWriterId) {
          const { error } = await supabase.from("writers").update(payload).eq("id", editingWriterId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("writers").insert(payload);
          if (error) throw error;
        }
      } catch (err) {
        console.error(err);
        alert("Could not save the writer. Check your connection, database setup, and owner access, then try again.");
        return;
      }
    }

    setWriters((prev) => {
      const exists = prev.some((w) => w.id === payload.id);
      if (exists) {
        return prev.map((w) => (w.id === payload.id ? payload : w));
      } else {
        return [...prev, payload];
      }
    });

    setEditingWriterId(null);
    setWriterFormData({ name: "", slug: "", bio: "", photo_url: "" });
    notifySuccess("Writer saved successfully.");
  };

  const handleDeleteWriter = async (id: string, name: string) => {
    if (!confirm(`Delete author "${name}"?`)) return;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from("writers").delete().eq("id", id);
        if (error) throw error;
      } catch (err) {
        console.error(err);
        alert("Could not delete the writer. Check your connection and owner access, then try again.");
        return;
      }
    }
    setWriters((prev) => prev.filter((w) => w.id !== id));
    notifySuccess("Writer deleted.");
  };

  const notifySuccess = (msg: string) => {
    setSaveMessage(msg);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 4000);
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-teal"></div>
      </div>
    );
  }

  // 1. ADMIN LOGIN VIEW
  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="relative w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
              <Image
                src="/brand-logo-circle.png"
                alt="Brahui Matt o badal"
                fill
                sizes="160px"
                unoptimized
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100">
              Admin Portal
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Single-owner administration for Brahui Matt o badal
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {recoveryMessage && <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs">{recoveryMessage}</div>}

          {recoveryStep === "login" ? <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@brahuitarjuma.org"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-teal"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-brand-teal text-white hover:bg-brand-teal-light transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Lock className="w-4 h-4" />
              <span>Secure Admin Sign In</span>
            </button>
            <button type="button" onClick={() => { setAuthError(""); setRecoveryMessage(""); setRecoveryStep("request"); }} className="w-full text-sm font-medium text-brand-teal hover:underline">
              Forgot password?
            </button>
          </form> : recoveryStep === "request" ? <form onSubmit={handleRequestPasswordOtp} className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">Enter your owner account email and we’ll send a one-time reset code.</p>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Admin Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-teal" />
            </div>
            <button type="submit" disabled={recoveryBusy} className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-brand-teal text-white hover:bg-brand-teal-light disabled:opacity-60">{recoveryBusy ? "Sending…" : "Send reset code"}</button>
            <button type="button" onClick={() => { setAuthError(""); setRecoveryStep("login"); }} className="w-full text-sm text-gray-600 dark:text-gray-300 hover:underline">Back to sign in</button>
          </form> : <form onSubmit={handleVerifyPasswordOtp} className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">Enter the code sent to {email}, then choose a new password.</p>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email code</label>
              <input inputMode="numeric" autoComplete="one-time-code" required value={recoveryOtp} onChange={(e) => setRecoveryOtp(e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-teal" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">New password</label>
              <input type="password" minLength={8} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-teal" />
            </div>
            <button type="submit" disabled={recoveryBusy} className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-brand-teal text-white hover:bg-brand-teal-light disabled:opacity-60">{recoveryBusy ? "Updating…" : "Verify code and update password"}</button>
            <button type="button" onClick={() => { setAuthError(""); setRecoveryMessage(""); setRecoveryStep("request"); }} className="w-full text-sm text-gray-600 dark:text-gray-300 hover:underline">Send a new code</button>
          </form>}

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              Note: Public registration is closed. Only the designated editor account can access this panel.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED ADMIN DASHBOARD
  const filteredArticles = articles.filter((art) => {
    const matchesStatus = statusFilter === "all" || art.status === statusFilter;
    const matchesSearch =
      !searchFilter.trim() ||
      art.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      art.slug.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (art.writer?.name && art.writer.name.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Admin Header Bar */}
      <div className="bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-5 sm:p-6 mb-8 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 shrink-0 rounded-full overflow-hidden">
            <Image src="/brand-logo-circle.png" alt="Brahui Matt o badal logo" fill sizes="56px" unoptimized className="object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif text-gray-900 dark:text-gray-100">
              Brahui Matt o badal Admin Desk
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Signed in as: <span className="font-semibold">{session.user?.email || "Editor"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStartNewArticle}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-teal text-white hover:bg-brand-teal-light shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Translation</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Save Notification Banner */}
      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab("articles")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "articles"
              ? "bg-brand-teal text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Articles ({articles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("editor")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "editor"
              ? "bg-brand-teal text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <Edit className="w-4 h-4" />
          <span>{editingArticleId ? "Edit Article" : "New Article Form"}</span>
        </button>

        <button
          onClick={() => setActiveTab("writers")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "writers"
              ? "bg-brand-teal text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Writers Manager ({writers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("messages")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "messages"
              ? "bg-brand-teal text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Messages ({contactMessages.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ARTICLES LIST / DASHBOARD */}
      {/* ======================================================== */}
      {activeTab === "articles" && (
        <div className="space-y-6">
          {/* Controls: Search and Status Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-[#17212F] p-4 rounded-xl border border-[#E8E2D9] dark:border-[#243245]">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search articles by title, author..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-teal"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-gray-500">Status:</span>
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-0.5 bg-gray-50 dark:bg-gray-800">
                {(["all", "published", "draft"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold capitalize ${
                      statusFilter === st
                        ? "bg-white dark:bg-[#17212F] text-brand-teal dark:text-teal-300 shadow-xs"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Articles Table */}
          <div className="bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3.5">Title (Brahui)</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">Original Author</th>
                    <th className="px-6 py-3.5">Translator</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Published</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredArticles.map((art) => (
                    <tr key={art.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-nastaliq text-lg text-gray-900 dark:text-gray-100" dir="rtl">
                          {art.title}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">/article/{art.slug}</div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="capitalize font-medium text-xs px-2.5 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          {art.category}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs font-medium text-gray-800 dark:text-gray-200">
                        {art.writer ? art.writer.name.split("(")[0].trim() : "Unknown"}
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-600 dark:text-gray-400 font-nastaliq" dir="rtl">
                        {art.translator_name || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            art.status === "published"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                          }`}
                        >
                          {art.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatDate(art.published_at)}
                      </td>

                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <Link
                          href={`/article/${art.slug}`}
                          target="_blank"
                          className="p-1.5 text-gray-500 hover:text-brand-teal transition-colors inline-block"
                          title="View live translation"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleEditArticle(art)}
                          className="p-1.5 text-brand-teal hover:text-brand-teal-light transition-colors"
                          title="Edit article"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteArticle(art.id, art.title)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 transition-colors"
                          title="Delete article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredArticles.length === 0 && (
              <div className="py-12 text-center text-gray-500 text-sm">
                No articles match your filter criteria.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: ARTICLE EDITOR FORM (NEW / EDIT) */}
      {/* ======================================================== */}
      {activeTab === "editor" && (
        <div className="bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-6 sm:p-10 shadow-sm space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h2 className="text-xl font-bold font-serif text-gray-900 dark:text-gray-100">
                {editingArticleId ? "Edit Translation Article" : "Create New Translation Article"}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Fill in the details below. Brahui text renders in authentic Nastaliq script.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSaveArticle("draft")}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-all"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => handleSaveArticle("published")}
                className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-teal text-white hover:bg-brand-teal-light shadow-sm transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-brand-gold" />
                <span>Publish Translation</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form inputs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Title (Brahui, Required) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Title (Brahui Nastaliq) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  dir="rtl"
                  lang="brh"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="مٹ و بدل نا سرھال)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-xl font-nastaliq leading-nastaliq text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-teal"
                />
              </div>

              {/* Subtitle (Brahui, Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Subtitle (Brahui Nastaliq, Optional)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  lang="brh"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="شیفی سرھال (اختیاری)"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-base font-nastaliq leading-nastaliq text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-teal"
                />
              </div>

              {/* URL Slug & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    URL Slug <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="your-article-slug"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-xs sm:text-sm font-mono text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CategorySlug })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-teal"
                  >
                    <option value="fiction">Fiction (فکشن - Short Stories, Novels)</option>
                    <option value="poetry">Poetry (شاعری)</option>
                    <option value="criticism">Criticism (نغد)</option>
                    <option value="research">Research (پٹّ و پول)</option>
                    <option value="articles">Articles (نوشتانک - Essays)</option>
                  </select>
                </div>
              </div>

              {/* Original Author & Original Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Original Writer Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.original_writer_name}
                    onChange={(e) => setFormData({ ...formData, original_writer_name: e.target.value })}
                    placeholder="Original writer name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Original Title
                  </label>
                  <input
                    type="text"
                    value={formData.original_title}
                    onChange={(e) => setFormData({ ...formData, original_title: e.target.value })}
                    placeholder="e.g. Toba Tek Singh"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              {/* Translator Name & Cover Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Translator Name
                  </label>
                  <input
                    type="text"
                    value={formData.translator_name}
                    onChange={(e) => setFormData({ ...formData, translator_name: e.target.value })}
                    placeholder="e.g. عبدالرزاق ساسولی"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Cover Image URL / Upload
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.cover_image_url}
                      onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                      placeholder="/brand-logo-circle.png"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-xs font-mono text-gray-900 dark:text-gray-100"
                    />
                    <label className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 cursor-pointer flex items-center shrink-0">
                      <Upload className="w-4 h-4" />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Main Body Textbox in Brahui */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Brahui Translation Body <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs text-gray-400">
                    Paragraph & line breaks preserved exactly
                  </span>
                </div>
                <textarea
                  rows={14}
                  dir="rtl"
                  lang="brh"
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="داڑے براہوئی مٹ و بدل نا عبارت ءِ چسپاں (Paste) کبو..."
                  className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-lg font-nastaliq leading-nastaliq text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-teal"
                />
              </div>

              {/* Original Text Section (Optional) */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Original Source Text (Optional)
                  </span>
                  <span className="text-xs text-gray-500">
                    Displayed on /article/[slug]/original
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">Direction</label>
                    <select
                      value={formData.original_dir}
                      onChange={(e) => setFormData({ ...formData, original_dir: e.target.value as "ltr" | "rtl" })}
                      className="w-full p-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722]"
                    >
                      <option value="ltr">LTR (English, French, etc.)</option>
                      <option value="rtl">RTL (Urdu, Arabic, Persian)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">Language Code</label>
                    <input
                      type="text"
                      value={formData.original_lang}
                      onChange={(e) => setFormData({ ...formData, original_lang: e.target.value })}
                      placeholder="en or ur"
                      className="w-full p-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">Source Citation Credit</label>
                    <input
                      type="text"
                      value={formData.source_credit}
                      onChange={(e) => setFormData({ ...formData, source_credit: e.target.value })}
                      placeholder="Book title, Year"
                      className="w-full p-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722]"
                    />
                  </div>
                </div>

                <textarea
                  rows={8}
                  dir={formData.original_dir}
                  lang={formData.original_lang}
                  value={formData.original_text}
                  onChange={(e) => setFormData({ ...formData, original_text: e.target.value })}
                  placeholder="Paste original source text here..."
                  className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-sm text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Novel Chapters Section (If category is Fiction / Novel) */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      Novel Chapters ({formData.chapters.length})
                    </span>
                    <p className="text-[11px] text-gray-500">
                      For novels: add and reorder multi-part chapters
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddChapter}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-gold/20 text-brand-teal dark:text-amber-300 hover:bg-brand-gold/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Chapter</span>
                  </button>
                </div>

                {formData.chapters.map((chap, idx) => (
                  <div key={chap.id || idx} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-teal">
                        Chapter {chap.chapter_number}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChapter(idx)}
                        className="text-xs text-rose-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    <input
                      type="text"
                      dir="rtl"
                      value={chap.title}
                      onChange={(e) => handleUpdateChapter(idx, "title", e.target.value)}
                      placeholder="Chapter title in Brahui"
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#17212F] text-sm font-nastaliq"
                    />

                    <textarea
                      rows={5}
                      dir="rtl"
                      value={chap.body}
                      onChange={(e) => handleUpdateChapter(idx, "body", e.target.value)}
                      placeholder="Chapter body text in Brahui Nastaliq..."
                      className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#17212F] text-sm font-nastaliq"
                    />
                  </div>
                ))}
              </div>

              {/* PDF Download URL */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Novel / Article PDF Download URL (Optional)
                </label>
                <input
                  type="text"
                  value={formData.pdf_url}
                  onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                  placeholder="https://... or /novel.pdf"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-xs font-mono text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* SEO Meta Description */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    SEO Meta Description
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoFillMetaDescription}
                    className="text-xs text-brand-teal dark:text-teal-400 hover:underline"
                  >
                    Auto-fill from body
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder="Brief summary for Google search results..."
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-xs text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Right Column: Live Nastaliq Preview */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 bg-[#FBF9F5] dark:bg-[#0F1722] rounded-2xl border-2 border-dashed border-brand-gold/40 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-teal dark:text-teal-400">
                    <Eye className="w-4 h-4" />
                    <span>Live Nastaliq Preview</span>
                  </div>
                  <span className="text-xs text-brand-gold font-nastaliq" dir="rtl">
                    پیش منظر
                  </span>
                </div>

                {/* Preview Card */}
                <div className="space-y-4">
                  {formData.title ? (
                    <h3
                      dir="rtl"
                      lang="brh"
                      className="font-nastaliq text-2xl leading-nastaliq font-bold text-gray-900 dark:text-gray-100 text-right"
                    >
                      {formData.title}
                    </h3>
                  ) : (
                    <div className="text-sm italic text-gray-400 text-right font-nastaliq" dir="rtl">
                      عنوان داڑے پیش مریک
                    </div>
                  )}

                  {formData.subtitle && (
                    <h4
                      dir="rtl"
                      lang="brh"
                      className="font-nastaliq text-lg leading-nastaliq text-brand-gold text-right"
                    >
                      {formData.subtitle}
                    </h4>
                  )}

                  {/* Sample Meta line */}
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#17212F] text-[11px] text-gray-500 leading-relaxed font-sans">
                    Original: {formData.original_writer_name || "Author"} • Category: {formData.category}
                  </div>

                  {/* Body Preview */}
                  {formData.body ? (
                    <div className="p-4 rounded-xl bg-white dark:bg-[#17212F] max-h-96 overflow-y-auto">
                      <ArticleRenderer
                        body={formData.body}
                        category={formData.category}
                        fontSize={20}
                      />
                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-gray-400 font-nastaliq" dir="rtl">
                      متن نا پبی پیش منظر داڑے ظاہر مرو۔
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: WRITERS MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === "writers" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Writers List */}
          <div className="lg:col-span-7 bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-bold font-serif text-gray-900 dark:text-gray-100 pb-3 border-b border-gray-100 dark:border-gray-800">
              Original Authors ({writers.length})
            </h2>

            <div className="space-y-3">
              {writers.map((w) => (
                <div
                  key={w.id}
                  className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                      {w.photo_url ? (
                        <Image src={w.photo_url} alt={w.name} fill sizes="48px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-brand-teal">
                          {w.name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {w.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-mono">/writer/{w.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingWriterId(w.id);
                        setWriterFormData({
                          name: w.name,
                          slug: w.slug,
                          bio: w.bio || "",
                          photo_url: w.photo_url || "",
                        });
                      }}
                      className="p-1.5 text-brand-teal hover:text-brand-teal-light"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteWriter(w.id, w.name)}
                      className="p-1.5 text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Add / Edit Writer Form */}
          <div className="lg:col-span-5 bg-white dark:bg-[#17212F] rounded-2xl border border-[#E8E2D9] dark:border-[#243245] p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold font-serif text-gray-900 dark:text-gray-100 pb-3 border-b border-gray-100 dark:border-gray-800">
              {editingWriterId ? "Edit Writer Profile" : "Add New Writer"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                  Writer Name (with Urdu script) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={writerFormData.name}
                  onChange={(e) =>
                    setWriterFormData({
                      ...writerFormData,
                      name: e.target.value,
                      slug: writerFormData.slug || generateSlug(e.target.value),
                    })
                  }
                  placeholder="Original writer name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={writerFormData.slug}
                  onChange={(e) => setWriterFormData({ ...writerFormData, slug: e.target.value })}
                  placeholder="saadat-hasan-manto"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-xs font-mono text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                  Writer Photo
                </label>
                <div className="flex items-center gap-3">
                  {writerFormData.photo_url && (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-brand-gold/50 bg-gray-100 dark:bg-gray-800">
                      <Image src={writerFormData.photo_url} alt="Writer photo preview" fill sizes="56px" unoptimized className="object-cover" />
                    </div>
                  )}
                  <label className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:border-brand-teal ${uploadingWriterPhoto ? "pointer-events-none opacity-60" : ""}`}>
                    <Upload className="h-4 w-4" />
                    <span>{uploadingWriterPhoto ? "Uploading photo…" : writerFormData.photo_url ? "Change photo" : "Choose photo"}</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleWriterPhotoUpload} disabled={uploadingWriterPhoto} className="sr-only" />
                  </label>
                  {writerFormData.photo_url && !uploadingWriterPhoto && (
                    <button type="button" onClick={() => setWriterFormData((prev) => ({ ...prev, photo_url: "" }))} className="text-xs text-rose-600 hover:underline">
                      Remove
                    </button>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">PNG, JPG, or WebP · up to 5 MB</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                  Short Bio
                </label>
                <textarea
                  rows={4}
                  value={writerFormData.bio}
                  onChange={(e) => setWriterFormData({ ...writerFormData, bio: e.target.value })}
                  placeholder="Brief biography and literary significance..."
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-[#FBF9F5] dark:bg-[#0F1722] text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveWriter}
                  disabled={uploadingWriterPhoto}
                  className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs bg-brand-teal text-white hover:bg-brand-teal-light transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingWriterId ? "Update Writer" : "Add Writer"}</span>
                </button>

                {editingWriterId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingWriterId(null);
                      setWriterFormData({ name: "", slug: "", bio: "", photo_url: "" });
                    }}
                    className="py-2.5 px-4 rounded-xl font-semibold text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "messages" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold font-serif text-gray-900 dark:text-gray-100">Visitor Messages</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Messages sent through the website contact form appear here.</p>
            </div>
            <button
              type="button"
              onClick={async () => {
                setContactMessagesLoading(true);
                setContactMessagesError("");
                const { data, error } = await supabase
                  .from("contact_messages")
                  .select("id, name, email, message, created_at")
                  .order("created_at", { ascending: false })
                  .limit(100);
                if (error) setContactMessagesError("Could not load messages. Check the Supabase table and owner access policy.");
                else setContactMessages(data || []);
                setContactMessagesLoading(false);
              }}
              disabled={contactMessagesLoading}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-semibold hover:border-brand-teal disabled:opacity-60"
            >
              {contactMessagesLoading ? "Loading…" : "Refresh"}
            </button>
          </div>

          {contactMessagesError && <p role="alert" className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-sm text-rose-700 dark:text-rose-300">{contactMessagesError}</p>}
          {contactMessagesLoading && contactMessages.length === 0 && <p className="py-10 text-center text-gray-500">Loading messages…</p>}
          {!contactMessagesLoading && !contactMessagesError && contactMessages.length === 0 && (
            <div className="py-12 text-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-500">
              No messages yet. New contact form submissions will appear here.
            </div>
          )}

          <div className="space-y-3">
            {contactMessages.map((item) => (
              <article key={item.id} className="bg-white dark:bg-[#17212F] rounded-xl border border-[#E8E2D9] dark:border-[#243245] p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</h3>
                    <a href={`mailto:${item.email}`} className="text-sm text-brand-teal dark:text-teal-300 hover:underline">{item.email}</a>
                  </div>
                  <time className="text-xs text-gray-500" dateTime={item.created_at}>{new Date(item.created_at).toLocaleString()}</time>
                </div>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">{item.message}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
