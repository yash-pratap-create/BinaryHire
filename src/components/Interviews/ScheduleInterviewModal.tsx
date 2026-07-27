import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, Video, User, Briefcase, FileText } from 'lucide-react';
import { candidateService } from '../../services/candidateService';
import { interviewService } from '../../services/interviewService';
import type { Candidate, Interview, InterviewFormData, InterviewType } from '../../types';
import { Button } from '../UI/Button';
import { Input, Select, Textarea } from '../UI/FormFields';
import { useAuth } from '../../context/AuthContext';

interface ScheduleInterviewModalProps {
  candidate?: Candidate | null;
  interviewToEdit?: Interview | null;
  onSaved: () => void;
  onCancel: () => void;
}

const INTERVIEW_TYPES: InterviewType[] = [
  'HR Screening',
  'Technical Round',
  'System Design',
  'Management Round',
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '10:30 AM', '11:30 AM',
  '01:30 PM', '02:00 PM', '03:30 PM', '04:30 PM', '05:30 PM'
];

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  candidate,
  interviewToEdit,
  onSaved,
  onCancel,
}) => {
  const { user } = useAuth();
  const [candidatesList, setCandidatesList] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(candidate || null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<InterviewFormData>({
    defaultValues: {
      candidateId: candidate?.id || interviewToEdit?.candidateId || '',
      candidateName: candidate?.name || interviewToEdit?.candidateName || '',
      candidateRole: candidate?.role || interviewToEdit?.candidateRole || '',
      interviewer: interviewToEdit?.interviewer || user?.name || 'Yash Pratap Singh',
      type: interviewToEdit?.type || 'Technical Round',
      date: interviewToEdit?.date || new Date().toISOString().split('T')[0],
      time: interviewToEdit?.time || '10:30 AM',
      meetingUrl: interviewToEdit?.meetingUrl || 'https://meet.google.com/bin-hire-meet',
      status: interviewToEdit?.status || 'Scheduled',
      notes: interviewToEdit?.notes || '',
    },
  });

  useEffect(() => {
    if (!candidate) {
      candidateService.getAll().then((res) => {
        setCandidatesList(res.data);
        if (res.data.length > 0 && !interviewToEdit) {
          const first = res.data[0];
          setSelectedCandidate(first);
          setValue('candidateId', first.id);
          setValue('candidateName', first.name);
          setValue('candidateRole', first.role);
        }
      });
    }
  }, [candidate, interviewToEdit, setValue]);

  const handleCandidateChange = (candId: string) => {
    const found = candidatesList.find((c) => c.id === candId);
    if (found) {
      setSelectedCandidate(found);
      setValue('candidateId', found.id);
      setValue('candidateName', found.name);
      setValue('candidateRole', found.role);
    }
  };

  const onSubmit = async (data: InterviewFormData) => {
    setLoading(true);
    try {
      if (interviewToEdit) {
        await interviewService.update(interviewToEdit.id, data);
      } else {
        await interviewService.create(data);
        // Also update candidate status to 'Interview' if candidate is selected
        if (data.candidateId) {
          await candidateService.update(data.candidateId, { status: 'Interview' });
        }
      }
      onSaved();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-[#f2f1f5]">
      {/* Candidate Selector */}
      {!candidate && !interviewToEdit ? (
        <div>
          <label className="block text-xs font-semibold mb-1 text-[#8b899a]">
            Select Candidate
          </label>
          <select
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-[#08070b] border border-[#24212c] text-[#f2f1f5]"
            value={selectedCandidate?.id || ''}
            onChange={(e) => handleCandidateChange(e.target.value)}
          >
            {candidatesList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.role} ({c.department})
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-[#18161e] border border-[#24212c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#c94dff]/15 text-[#c94dff]">
              <User size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">{selectedCandidate?.name || interviewToEdit?.candidateName}</p>
              <p className="text-xs text-[#8b899a] flex items-center gap-1">
                <Briefcase size={12} /> {selectedCandidate?.role || interviewToEdit?.candidateRole}
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#3a2440] text-[#e29bff] font-medium">
            Candidate
          </span>
        </div>
      )}

      {/* Hidden candidate fields */}
      <input type="hidden" {...register('candidateId')} />
      <input type="hidden" {...register('candidateName')} />
      <input type="hidden" {...register('candidateRole')} />

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Interview Type */}
        <Select
          label="Interview Round Type"
          {...register('type', { required: true })}
        >
          {INTERVIEW_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>

        {/* Assigned Interviewer */}
        <Select
          label="Assigned Interviewer"
          {...register('interviewer', { required: true })}
        >
          <option value="Yash Pratap Singh">Yash Pratap Singh (Admin)</option>
          <option value="Ananya Sharma">Ananya Sharma (Recruiter)</option>
        </Select>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Date */}
        <Input
          label="Interview Date"
          type="date"
          {...register('date', { required: 'Date is required' })}
          error={errors.date?.message}
        />

        {/* Time Slot */}
        <Select
          label="Time Slot"
          {...register('time', { required: true })}
        >
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </Select>
      </div>

      {/* Meeting URL */}
      <Input
        label="Meeting URL (Google Meet / Zoom)"
        type="url"
        placeholder="https://meet.google.com/abc-defg-hij"
        {...register('meetingUrl', { required: 'Meeting URL is required' })}
        error={errors.meetingUrl?.message}
      />

      {/* Notes / Agenda */}
      <Textarea
        label="Interview Agenda / Evaluation Notes"
        placeholder="Key technical topics, coding questions, and evaluation criteria..."
        rows={3}
        {...register('notes')}
      />

      {/* Buttons */}
      <div className="flex gap-3 pt-3">
        <Button variant="outline" className="flex-1" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" className="flex-1" type="submit" isLoading={loading}>
          {interviewToEdit ? 'Save Changes' : 'Schedule Interview'}
        </Button>
      </div>
    </form>
  );
};
