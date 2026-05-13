"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Loader2, ShieldAlert, BadgeCheck, Search, X, Filter, UserPlus } from "lucide-react";
import FilterSelector from "@/components/ui/FilterSelector";
import { useDebounce } from "@/hooks/useDebounce";

export default function UsersAdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [role, setRole] = useState("");
  const [plan, setPlan] = useState("");

  const roleOptions = [
    { value: "", label: "All Roles" },
    { value: "USER", label: "USER" },
    { value: "ADMIN", label: "ADMIN", icon: <ShieldAlert className="h-3 w-3 text-red-400" /> },
  ];

  const planOptions = [
    { value: "", label: "All Plans" },
    { value: "FREE", label: "FREE" },
    { value: "PREMIUM", label: "PREMIUM", icon: <BadgeCheck className="h-3 w-3 text-primary" /> },
  ];

  // Reset to first page on search or filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, role, plan]);

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch, role, plan]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/users/admin`);
      url.searchParams.append('limit', '20');
      url.searchParams.append('page', page.toString());
      if (debouncedSearch) url.searchParams.append('search', debouncedSearch);
      if (role) url.searchParams.append('role', role);
      if (plan) url.searchParams.append('plan', plan);

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setTotalPages(Math.ceil(data.total / 20));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage platform users, roles, and subscriptions</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative w-full md:w-64 lg:w-80">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search by nick or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Role Filter */}
          <FilterSelector
            options={roleOptions}
            selectedValue={role}
            onSelect={setRole}
            placeholder="Role"
            icon={<Filter className="h-3 w-3" />}
          />

          {/* Plan Filter */}
          <FilterSelector
            options={planOptions}
            selectedValue={plan}
            onSelect={setPlan}
            placeholder="Plan"
            icon={<BadgeCheck className="h-3 w-3" />}
          />

          {(role || plan || search) && (
            <button 
              onClick={() => {
                setRole("");
                setPlan("");
                setSearch("");
              }}
              className="text-xs text-muted-foreground hover:text-white transition-colors underline underline-offset-4"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/10 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Nick</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Plan</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium">{u.nick}</td>
                      <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                      <td className="px-6 py-4">
                        {u.role === 'ADMIN' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium">
                            <ShieldAlert className="w-3 h-3" /> ADMIN
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-white/5 text-muted-foreground text-xs font-medium">
                            USER
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {u.plan === 'PREMIUM' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            <BadgeCheck className="w-3 h-3" /> PREMIUM
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-white/5 text-muted-foreground text-xs font-medium">
                            FREE
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/admin/users/${u.id}`}
                          className="inline-flex p-2 text-blue-400 hover:bg-blue-400/10 rounded-md transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 rounded-md bg-white/5 disabled:opacity-50 hover:bg-white/10 transition-colors"
          >
            Prev
          </button>
          <span className="px-3 py-1 text-sm flex items-center">
            Page {page} of {totalPages}
          </span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 rounded-md bg-white/5 disabled:opacity-50 hover:bg-white/10 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
