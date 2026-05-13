"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Subject {
  id: string;
  name: string;
  questionCount?: number;
  [key: string]: any;
}

interface SubjectSelectorProps {
  subjects: Subject[];
  selectedId: string;
  onSelect: (id: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function SubjectSelector({
  subjects,
  selectedId,
  onSelect,
  placeholder = "Seleciona uma disciplina...",
  className = "",
  disabled = false,
}: SubjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedSubject = subjects.find((s) => s.id === selectedId);

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-10 md:h-12 flex items-center justify-between px-4 rounded-xl border border-white/10 bg-black/50 text-white focus:outline-none focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed",
          isOpen && "border-primary ring-1 ring-primary/20"
        )}
      >
        <span className={cn("truncate", selectedSubject ? "text-white" : "text-muted-foreground")}>
          {selectedSubject ? selectedSubject.name : placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="p-2 border-b border-white/10 flex items-center gap-2 bg-white/5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                placeholder="Pesquisar disciplina..."
                className="w-full bg-transparent border-none focus:ring-0 text-sm text-white py-1 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setIsOpen(false);
                }}
              />
            </div>
            <div className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => {
                      onSelect(subject.id);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 text-left",
                      subject.id === selectedId
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <div className="flex flex-col truncate">
                      <span className="truncate">{subject.name}</span>
                      {subject.questionCount !== undefined && (
                        <span className={cn(
                          "text-[10px] opacity-70",
                          subject.id === selectedId ? "text-primary-foreground" : "text-muted-foreground"
                        )}>
                          {subject.questionCount} questões
                        </span>
                      )}
                    </div>
                    {subject.id === selectedId && <Check className="h-4 w-4 flex-shrink-0" />}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Nenhuma disciplina encontrada.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
