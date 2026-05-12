"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, ShieldAlert, KeyRound, Loader2 } from "lucide-react";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Form State
  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("FREE");
  const [role, setRole] = useState("USER");
  const [planExpiresAt, setPlanExpiresAt] = useState("");
  
  // Password Reset State
  const [newPassword, setNewPassword] = useState("");
  const [resettingPassword, setResettingPassword] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      // Temporary workaround: since we don't have a GET /users/admin/:id,
      // we can fetch the list and find the user or just reuse the existing findById.
      // Actually, since we didn't build GET /users/admin/:id, let's use the list for now
      // or we can just fetch the user if the backend supports it.
      // Wait, we need a way to get one user. Let's just fetch all and find it for this demo.
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/admin?limit=100`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      if (res.ok) {
        const data = await res.json();
        const foundUser = data.users.find((u: any) => u.id === unwrappedParams.id);
        if (foundUser) {
          setUser(foundUser);
          setNick(foundUser.nick);
          setEmail(foundUser.email);
          setPlan(foundUser.plan);
          setRole(foundUser.role);
          setPlanExpiresAt(foundUser.planExpiresAt ? new Date(foundUser.planExpiresAt).toISOString().split('T')[0] : "");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/admin/${unwrappedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          nick,
          email,
          plan,
          role,
          planExpiresAt: planExpiresAt ? new Date(planExpiresAt).toISOString() : null,
        }),
      });

      if (res.ok) {
        alert("User updated successfully!");
        router.push("/admin/users");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update user");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    if (!confirm("Are you sure you want to force reset this user's password?")) return;

    try {
      setResettingPassword(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/admin/${unwrappedParams.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (res.ok) {
        alert("Password reset successfully!");
        setNewPassword("");
      } else {
        alert("Failed to reset password");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setResettingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <div>User not found</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/users" className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit User</h1>
          <p className="text-muted-foreground text-sm">Update user details, roles, and plan.</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nick</label>
            <input 
              type="text" 
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Plan</label>
            <select 
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary"
            >
              <option value="FREE">FREE</option>
              <option value="PREMIUM">PREMIUM</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Plan Expires At</label>
            <input 
              type="date" 
              value={planExpiresAt}
              onChange={(e) => setPlanExpiresAt(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-red-400">
          <ShieldAlert className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Danger Zone: Reset Password</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Force a new password for this user. They will need to use this new password to login.
        </p>
        <div className="flex items-end gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-red-200">New Password</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full bg-black/50 border border-red-500/30 rounded-md px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>
          <button 
            onClick={handleResetPassword}
            disabled={resettingPassword || newPassword.length < 6}
            className="flex items-center gap-2 bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-md hover:bg-red-500/30 transition-colors disabled:opacity-50 h-[42px]"
          >
            {resettingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}
