import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star, Award, CheckCircle2 } from 'lucide-react';
import type { Candidate, Scorecard } from '../../types';
import { Button } from '../UI/Button';
import { Select, Textarea } from '../UI/FormFields';
import { useAuth } from '../../context/AuthContext';
import { candidateService } from '../../services/candidateService';

interface ScorecardFormProps {
  candidate: Candidate;
  onSaved: () => void;
  onCancel: () => void;
}

interface ScorecardInputs {
  round: string;
  recommendation: 'Strong Hire' | 'Hire' | 'No Hire' | 'Strong No Hire';
  comments: string;
}

function StarRating({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-[#18161e] border border-[#24212c]">
      <span className="text-xs font-semibold text-[#f2f1f5]">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => onChange(star)}
            className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
          >
            <Star
              size={18}
              className={star <= value ? 'text-amber-400 fill-amber-400' : 'text-[#373444]'}
            />
          </button>
        ))}
        <span className="text-xs font-mono text-[#c94dff] ml-1.5 w-4 font-bold">{value}/5</span>
      </div>
    </div>
  );
}

export const ScorecardForm: React.FC<ScorecardFormProps> = ({ candidate, onSaved, onCancel }) => {
  const { user } = useAuth();
  const [technical, setTechnical] = useState(4);
  const [communication, setCommunication] = useState(4);
  const [problemSolving, setProblemSolving] = useState(5);
  const [cultureFit, setCultureFit] = useState(4);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit } = useForm<ScorecardInputs>({
    defaultValues: {
      round: 'Technical Round',
      recommendation: 'Hire',
      comments: '',
    },
  });

  const onSubmit = async (data: ScorecardInputs) => {
    setSubmitting(true);
    try {
      const newScorecard: Scorecard = {
        id: `sc-${Date.now()}`,
        candidateId: candidate.id,
        interviewer: user?.name || 'Yash Pratap Singh',
        round: data.round,
        technicalRating: technical,
        communicationRating: communication,
        problemSolvingRating: problemSolving,
        cultureFitRating: cultureFit,
        recommendation: data.recommendation,
        comments: data.comments,
        date: new Date().toISOString().split('T')[0],
      };

      const updatedScorecards = [...(candidate.scorecards || []), newScorecard];
      await candidateService.update(candidate.id, { scorecards: updatedScorecards });
      onSaved();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-[#f2f1f5]">
      {/* Candidate Banner */}
      <div className="p-3 rounded-xl bg-[#18161e] border border-[#24212c] flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{candidate.name}</p>
          <p className="text-xs text-[#8b899a]">{candidate.role} ({candidate.department})</p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-[#c94dff]/15 text-[#e0b3ff] font-medium border border-[#c94dff]/30">
          Interview Scorecard
        </span>
      </div>

      <Select label="Interview Round" {...register('round', { required: true })}>
        <option value="HR Screening">HR Screening</option>
        <option value="Technical Round">Technical Round</option>
        <option value="System Design">System Design</option>
        <option value="Management Round">Management Round</option>
      </Select>

      {/* 5-Star Ratings */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-[#8b899a]">Structured Competency Ratings</label>
        <StarRating label="Technical Skills" value={technical} onChange={setTechnical} />
        <StarRating label="Communication & Clarity" value={communication} onChange={setCommunication} />
        <StarRating label="Problem Solving & Logic" value={problemSolving} onChange={setProblemSolving} />
        <StarRating label="Culture & Values Fit" value={cultureFit} onChange={setCultureFit} />
      </div>

      {/* Overall Recommendation */}
      <Select label="Overall Recommendation" {...register('recommendation', { required: true })}>
        <option value="Strong Hire">⭐ Strong Hire (High Priority)</option>
        <option value="Hire">✓ Hire</option>
        <option value="No Hire">✗ No Hire</option>
        <option value="Strong No Hire">⛔ Strong No Hire</option>
      </Select>

      {/* Evaluation Comments */}
      <Textarea
        label="Detailed Evaluation Comments"
        placeholder="Specific strengths, code quality assessment, communication observations..."
        rows={3}
        {...register('comments', { required: true })}
      />

      <div className="flex gap-3 pt-2">
        <Button variant="outline" className="flex-1" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" className="flex-1" type="submit" isLoading={submitting}>
          Submit Scorecard
        </Button>
      </div>
    </form>
  );
};
