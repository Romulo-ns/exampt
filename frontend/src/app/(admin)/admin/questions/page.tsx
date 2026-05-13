"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Loader2, Search, X, Filter, BarChart2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useDebounce } from "@/hooks/useDebounce";
import FilterSelector from "@/components/ui/FilterSelector";

export default function QuestionsAdminPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter States
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [subjectId, setSubjectId] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const difficultyOptions = [
    { value: "", label: "All Difficulties" },
    { value: "1", label: "Difficulty 1" },
    { value: "2", label: "Difficulty 2" },
    { value: "3", label: "Difficulty 3" },
    { value: "4", label: "Difficulty 4" },
    { value: "5", label: "Difficulty 5" },
  ];

  // Fetch subjects for the filter
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects`);
        if (res.ok) {
          const data = await res.json();
          setSubjects(data);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, subjectId, difficulty]);

  useEffect(() => {
    fetchQuestions();
  }, [page, debouncedSearch, subjectId, difficulty]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/questions`);
      url.searchParams.append('limit', '20');
      url.searchParams.append('offset', ((page - 1) * 20).toString());
      
      if (debouncedSearch) url.searchParams.append('search', debouncedSearch);
      if (subjectId) url.searchParams.append('subjectId', subjectId);
      if (difficulty) url.searchParams.append('difficulty', difficulty);

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions);
        setTotalPages(Math.ceil(data.total / 20));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (res.ok) {
        setQuestions(questions.filter(q => q.id !== id));
      } else {
        alert("Failed to delete question");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const subjectOptions = [
    { value: "", label: "All Subjects" },
    ...subjects.map(s => ({ value: s.id, label: s.name }))
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Questions Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage all exam questions</p>
        </div>
        
        <Link 
          href="/admin/questions/new"
          className="lg:hidden bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Question
        </Link>
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
              placeholder="Search in question text..."
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

          {/* Subject Filter */}
          <FilterSelector
            options={subjectOptions}
            selectedValue={subjectId}
            onSelect={setSubjectId}
            placeholder="Subject"
            icon={<Filter className="h-3 w-3" />}
          />

          {/* Difficulty Filter */}
          <FilterSelector
            options={difficultyOptions}
            selectedValue={difficulty}
            onSelect={setDifficulty}
            placeholder="Difficulty"
            icon={<BarChart2 className="h-3 w-3" />}
          />

          {(search || subjectId || difficulty) && (
            <button 
              onClick={() => {
                setSearch("");
                setSubjectId("");
                setDifficulty("");
              }}
              className="text-xs text-muted-foreground hover:text-white transition-colors underline underline-offset-4"
            >
              Reset Filters
            </button>
          )}
        </div>

        <Link 
          href="/admin/questions/new"
          className="hidden lg:flex bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Question
        </Link>
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
                  <th className="px-6 py-3 font-medium">Text</th>
                  <th className="px-6 py-3 font-medium">Subject</th>
                  <th className="px-6 py-3 font-medium">Difficulty</th>
                  <th className="px-6 py-3 font-medium">Year</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {questions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No questions found.
                    </td>
                  </tr>
                ) : (
                  questions.map((q) => (
                    <tr key={q.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 truncate max-w-xs">{q.text}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded bg-white/5 text-xs">
                          {q.subject?.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          q.difficulty <= 2 ? "bg-green-500/10 text-green-400" :
                          q.difficulty <= 3 ? "bg-yellow-500/10 text-yellow-400" :
                          "bg-red-500/10 text-red-400"
                        }`}>
                          Lvl {q.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{q.year || "-"}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/admin/questions/${q.id}`}
                            className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-md transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button 
                            onClick={() => deleteQuestion(q.id)}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
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
