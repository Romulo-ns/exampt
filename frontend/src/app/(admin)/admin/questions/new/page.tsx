"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2, Loader2 } from "lucide-react";

export default function NewQuestionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);

  // Form State
  const [subjectId, setSubjectId] = useState("");
  const [text, setText] = useState("");
  const [difficulty, setDifficulty] = useState(3);
  const [year, setYear] = useState("");
  const [hint, setHint] = useState("");
  const [explanation, setExplanation] = useState("");
  const [options, setOptions] = useState([
    { label: "A", text: "", isCorrect: true, position: 1 },
    { label: "B", text: "", isCorrect: false, position: 2 },
    { label: "C", text: "", isCorrect: false, position: 3 },
    { label: "D", text: "", isCorrect: false, position: 4 },
  ]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subjects`);
      if (res.ok) {
        const data = await res.json();
        setSubjects(data);
        if (data.length > 0) setSubjectId(data[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOptionChange = (index: number, field: string, value: any) => {
    const newOptions = [...options];
    if (field === 'isCorrect') {
      newOptions.forEach(o => o.isCorrect = false); // Only one correct answer for MCQ
      newOptions[index].isCorrect = value;
    } else {
      (newOptions[index] as any)[field] = value;
    }
    setOptions(newOptions);
  };

  const handleSave = async () => {
    if (!text || !subjectId || options.some(o => !o.text)) {
      alert("Please fill in all required fields (Text, Subject, and all Option texts)");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          subjectId,
          text,
          difficulty,
          year: year ? parseInt(year) : undefined,
          hint,
          explanation,
          type: "MCQ",
          options: options.map(o => ({
            label: o.label,
            text: o.text,
            isCorrect: o.isCorrect,
            position: o.position
          }))
        }),
      });

      if (res.ok) {
        router.push("/admin/questions");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to save question");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/questions" className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">New Question</h1>
          <p className="text-muted-foreground text-sm">Create a new multiple choice question</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-8">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b border-white/10 pb-2">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject *</label>
              <select 
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary"
              >
                <option value="" disabled>Select a subject</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty (1-5)</label>
              <input 
                type="number" min="1" max="5"
                value={difficulty}
                onChange={(e) => setDifficulty(parseInt(e.target.value))}
                className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Year (Optional)</label>
              <input 
                type="number" 
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Question Text & Hint */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Question Text *</label>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary resize-y"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Hint (Optional)</label>
            <input 
              type="text" 
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Explanation (Shown after answering)</label>
            <textarea 
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={2}
              className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary resize-y"
            />
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b border-white/10 pb-2">Options</h2>
          <div className="space-y-3">
            {options.map((opt, idx) => (
              <div key={idx} className={`flex items-start gap-4 p-4 rounded-lg border ${opt.isCorrect ? 'border-primary bg-primary/5' : 'border-white/10 bg-black/50'}`}>
                <div className="pt-2">
                  <input 
                    type="radio" 
                    name="correctOption" 
                    checked={opt.isCorrect}
                    onChange={() => handleOptionChange(idx, 'isCorrect', true)}
                    className="w-4 h-4 accent-primary"
                  />
                </div>
                <div className="w-12 pt-1 font-bold text-lg text-center text-muted-foreground">{opt.label}</div>
                <div className="flex-1">
                  <textarea 
                    value={opt.text}
                    onChange={(e) => handleOptionChange(idx, 'text', e.target.value)}
                    placeholder={`Option ${opt.label} text...`}
                    rows={2}
                    className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary resize-y"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Question
          </button>
        </div>

      </div>
    </div>
  );
}
