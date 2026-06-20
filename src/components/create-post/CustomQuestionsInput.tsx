"use client";

import React from 'react';
import { Plus, Trash2, HelpCircle } from 'lucide-react';

interface CustomQuestionsInputProps {
  questions: string[];
  setQuestions: (qs: string[]) => void;
}

export default function CustomQuestionsInput({ questions, setQuestions }: CustomQuestionsInputProps) {
  const handleAddQuestion = () => {
    if (questions.length < 5) {
      setQuestions([...questions, '']);
    }
  };

  const handleQuestionChange = (index: number, val: string) => {
    const updated = [...questions];
    updated[index] = val;
    setQuestions(updated);
  };

  const handleRemoveQuestion = (index: number) => {
    const updated = questions.filter((_, idx) => idx !== index);
    setQuestions(updated.length === 0 ? [''] : updated);
  };

  return (
    <div className="space-y-2 border-t border-[#1e1e21] pt-3">
      <div className="flex justify-between items-center">
        <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#FF3F3F]" />
          <span>Custom Questions for Helpers</span>
        </label>
        <button
          type="button"
          onClick={handleAddQuestion}
          disabled={questions.length >= 5}
          className={`text-[9px] font-black flex items-center gap-1 px-2 py-1 rounded transition uppercase tracking-wider ${
            questions.length >= 5 ? 'text-zinc-650 cursor-not-allowed' : 'text-[#FF3F3F] hover:bg-[#FF3F3F]/10 cursor-pointer'
          }`}
        >
          <Plus className="w-2.5 h-2.5" />
          <span>Add ({questions.length}/5)</span>
        </button>
      </div>
      <p className="text-[9px] text-zinc-500 font-sans">Ask helpers to answer these questions specifically when they send a quote or offer.</p>
      
      <div className="space-y-2 pt-1">
        {questions.map((question, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <span className="text-[10px] text-zinc-500 font-bold w-4">#{idx+1}</span>
            <input
              id={`question-input-${idx}`}
              type="text"
              placeholder="e.g., Do you provide material warranties?"
              value={question}
              onChange={(e) => handleQuestionChange(idx, e.target.value)}
              className="flex-1 text-xs px-3 py-2 bg-[#0b0b0c] border border-[#232327] text-zinc-100 rounded-lg placeholder-zinc-700 focus:outline-hidden focus:border-[#FF3F3F]"
            />
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveQuestion(idx)}
                className="p-2.5 bg-zinc-900 hover:bg-[#FF3F3F]/10 border border-zinc-800 hover:border-[#FF3F3F]/30 text-zinc-500 hover:text-[#FF3F3F] rounded-lg transition cursor-pointer"
                title="Delete Question"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
