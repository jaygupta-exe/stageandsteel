"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Send,
  Eye,
  RefreshCw,
  CheckCircle2,
  Clock,
  ShoppingCart,
  Users,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ScannedUserRecord {
  id?: string;
  userId?: string;
  name?: string;
  email?: string;
  status?: string;
  reason?: string;
  reminderStatus?: string;
  lastActiveAt?: any;
  lastReminderSentAt?: any;
  lastPurchasedAt?: any;
  viewedProducts?: any[];
  cartItems?: any[];
  cartSubtotal?: number;
}

export default function VisitorRemindersAdminPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [users, setUsers] = useState<ScannedUserRecord[]>([]);
  const [testEmailAddress, setTestEmailAddress] = useState<string>("");
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Set default test email from logged-in admin
  useEffect(() => {
    if (user?.email && !testEmailAddress) {
      setTestEmailAddress(user.email);
    }
  }, [user?.email, testEmailAddress]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Run dry-run to inspect candidate users without sending emails
      const res = await fetch("/api/cron/visitor-reminder?dryRun=true&minInactiveMinutes=0");
      if (res.ok) {
        const data = await res.json();
        setExecutionResult(data);
        if (Array.isArray(data.results)) {
          setUsers(data.results);
        }
      }
    } catch (err) {
      console.warn("Failed to load reminder scan stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Trigger manual reminder scan
  const handleTriggerRun = async () => {
    setTriggering(true);
    setFeedbackMessage(null);
    try {
      const res = await fetch("/api/cron/visitor-reminder?minInactiveMinutes=30", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMessage({
          type: "success",
          text: `Scan finished: ${data.sentCount || 0} reminder email(s) sent, ${data.skippedCount || 0} skipped.`,
        });
        loadData();
      } else {
        setFeedbackMessage({
          type: "error",
          text: data.error || "Failed to trigger scan.",
        });
      }
    } catch (err: any) {
      setFeedbackMessage({
        type: "error",
        text: err.message || "Failed to trigger reminder run.",
      });
    } finally {
      setTriggering(false);
    }
  };

  // Send a test email copy to admin's inbox
  const handleSendTestEmail = async () => {
    if (!testEmailAddress || !testEmailAddress.includes("@")) {
      setFeedbackMessage({ type: "error", text: "Please enter a valid test email address." });
      return;
    }

    setSendingTest(true);
    setFeedbackMessage(null);
    try {
      const res = await fetch(
        `/api/cron/visitor-reminder?testEmail=${encodeURIComponent(
          testEmailAddress
        )}&minInactiveMinutes=0&dryRun=false`,
        { method: "POST" }
      );
      const data = await res.json();
      if (res.ok && data.sentCount > 0) {
        setFeedbackMessage({
          type: "success",
          text: `Sample reminder email successfully sent to ${testEmailAddress}! Check your inbox.`,
        });
      } else {
        setFeedbackMessage({
          type: "error",
          text: data.error || data.results?.[0]?.reason || "Email could not be dispatched.",
        });
      }
    } catch (err: any) {
      setFeedbackMessage({
        type: "error",
        text: err.message || "Failed to send test email.",
      });
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#596238]/20 border border-[#9DB25E]/40 text-[#9DB25E]">
              AUTOMATED RETENTION SYSTEM
            </span>
            <span className="flex items-center gap-1.5 text-xs text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Cron Active (Every 30m)
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-2 text-white">
            Visitor Reminders &amp; Recovery
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Automatically sends branded recovery emails to visitors who signed in, browsed products, or added items to cart but left without buying.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/admin/preview-reminder-email"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-sm font-semibold text-neutral-200 hover:text-white hover:border-neutral-700 transition"
          >
            <Eye className="w-4 h-4 text-[#9DB25E]" />
            Preview HTML Template
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>

          <button
            onClick={handleTriggerRun}
            disabled={triggering}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#596238] hover:bg-[#687342] text-white text-sm font-bold tracking-wider transition disabled:opacity-50"
          >
            <Send className={`w-4 h-4 ${triggering ? "animate-spin" : ""}`} />
            {triggering ? "Scanning..." : "Run Inactivity Check Now"}
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            feedbackMessage.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
              : "bg-red-950/40 border-red-500/30 text-red-300"
          }`}
        >
          <div className="flex items-center gap-3">
            {feedbackMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span className="text-sm font-medium">{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-xs uppercase tracking-wider font-bold opacity-60 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Workflow Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#111210] border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>REGISTERED PROSPECTS</span>
            <Users className="w-4 h-4 text-[#9DB25E]" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-3">
            {executionResult?.scannedTotal ?? 0}
          </div>
          <div className="text-xs text-neutral-500 mt-1">Users tracked in Firestore</div>
        </div>

        <div className="p-5 rounded-xl bg-[#111210] border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>INACTIVITY WINDOW</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-3">30–60 Min</div>
          <div className="text-xs text-neutral-500 mt-1">Trigger threshold for reminders</div>
        </div>

        <div className="p-5 rounded-xl bg-[#111210] border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>SPAM GUARD COOLDOWN</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-3">24 Hours</div>
          <div className="text-xs text-neutral-500 mt-1">Max 1 reminder per customer/day</div>
        </div>

        <div className="p-5 rounded-xl bg-[#111210] border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>DISPATCH PROVIDER</span>
            <Mail className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-3">Resend API</div>
          <div className="text-xs text-neutral-500 mt-1">Dark luxury HTML email</div>
        </div>
      </div>

      {/* Test Email Box */}
      <div className="p-6 rounded-2xl bg-[#141512] border border-[#2b2d26] space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#9DB25E]" />
          <h2 className="text-base font-bold text-white">Send a Test Copy to Your Inbox</h2>
        </div>
        <p className="text-xs text-neutral-400">
          Send a live copy of the Stage &amp; Steel reminder email (with sample viewed products and cart items) to test how it renders in Gmail / Apple Mail.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <input
            type="email"
            value={testEmailAddress}
            onChange={(e) => setTestEmailAddress(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-4 py-2.5 rounded-lg bg-[#0b0c0a] border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#596238]"
          />
          <button
            onClick={handleSendTestEmail}
            disabled={sendingTest}
            className="px-5 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm font-bold text-white tracking-wider transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Send className={`w-4 h-4 ${sendingTest ? "animate-spin" : ""}`} />
            {sendingTest ? "Sending..." : "Send Test Email"}
          </button>
        </div>
      </div>

      {/* Users & Recent Scan State */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Candidate Visitors Status</h2>
            <button
              onClick={loadData}
              disabled={loading}
              className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
              title="Refresh scan stats"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            Last scan run: {executionResult?.timestamp ? new Date(executionResult.timestamp).toLocaleTimeString() : "Pending"}
          </span>
        </div>

        <div className="rounded-xl border border-neutral-800 overflow-hidden bg-[#111210]">
          {loading ? (
            <div className="p-12 text-center text-neutral-400 text-sm">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#9DB25E]" />
              Scanning visitor documents...
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-neutral-400 text-sm space-y-2">
              <p className="font-semibold text-neutral-300">No visitors logged in yet or no browsing activity.</p>
              <p className="text-xs text-neutral-500">
                When visitors log in with Google and browse products, their activity will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-900/80 text-neutral-400 font-mono border-b border-neutral-800">
                    <th className="p-3.5">USER</th>
                    <th className="p-3.5">EMAIL</th>
                    <th className="p-3.5">STATUS</th>
                    <th className="p-3.5">REASON / NOTES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-sans">
                  {users.map((u, i) => (
                    <tr key={u.userId || i} className="hover:bg-neutral-900/40 transition">
                      <td className="p-3.5 font-medium text-white">
                        {u.name || "Athlete"}
                      </td>
                      <td className="p-3.5 text-neutral-300 font-mono">{u.email}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono uppercase ${
                            u.status === "sent"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : u.status === "ready"
                              ? "bg-[#596238]/30 text-[#9DB25E] border border-[#596238]/50"
                              : "bg-neutral-800 text-neutral-400"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-neutral-400">{u.reason || "Eligible for reminder"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
