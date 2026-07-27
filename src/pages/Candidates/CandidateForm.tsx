import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Sparkles, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { candidateService } from '../../services/candidateService';
import { aiService } from '../../services/aiService';
import type { Candidate, CandidateFormData, CandidateStatus } from '../../types';
import { Input, Select, Textarea } from '../../components/UI/FormFields';
import { Button } from '../../components/UI/Button';
import { FileUpload } from '../../components/UI/FileUpload';

const STATUS_OPTIONS = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'].map((s) => ({
  value: s, label: s,
}));

const DEPARTMENT_OPTIONS = ['Engineering', 'Product', 'Design', 'Data', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'].map((d) => ({
  value: d, label: d,
}));

interface CandidateFormProps {
  candidate?: Candidate | null;
  onSaved: () => void;
  onCancel: () => void;
}

export const CandidateForm: React.FC<CandidateFormProps> = ({ candidate, onSaved, onCancel }) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [duplicate, setDuplicate] = useState<Candidate | null>(null);
  const [parsedNotice, setParsedNotice] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CandidateFormData>({
    defaultValues: candidate
      ? { ...candidate, skills: candidate.skills.join(', ') }
      : { status: 'Applied', department: 'Engineering' },
  });

  const watchEmail = watch('email');
  const watchPhone = watch('phone');

  useEffect(() => {
    candidateService.getAll().then((res) => setAllCandidates(res.data));
  }, []);

  // Live duplicate checking
  useEffect(() => {
    if (watchEmail || watchPhone) {
      const match = aiService.findDuplicates(watchEmail || '', watchPhone || '', allCandidates, candidate?.id);
      setDuplicate(match);
    } else {
      setDuplicate(null);
    }
  }, [watchEmail, watchPhone, allCandidates, candidate?.id]);

  // Handle file select & AI resume auto-parsing
  const handleFileSelect = (file: File | null) => {
    setResumeFile(file);
    if (file && !candidate) {
      const parsed = aiService.parseResumeFile(file.name);
      setValue('name', parsed.name);
      setValue('email', parsed.email);
      setValue('phone', parsed.phone);
      setValue('role', parsed.role);
      setValue('department', parsed.department);
      setValue('experience', parsed.experience);
      setValue('location', parsed.location);
      setValue('skills', parsed.skills);
      setValue('salary', parsed.salary);
      setValue('notes', parsed.notes);
      setParsedNotice(true);
      setTimeout(() => setParsedNotice(false), 4000);
    }
  };

  const onSubmit = async (data: CandidateFormData) => {
    if (candidate) {
      await candidateService.update(candidate.id, data);
      if (resumeFile) {
        await candidateService.updateResume(candidate.id, resumeFile.name);
      }
    } else {
      const newCandidate = await candidateService.create(data);
      if (resumeFile) {
        await candidateService.updateResume(newCandidate.id, resumeFile.name);
      }
    }
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="candidate-form" className="space-y-4 text-[#f2f1f5]">
      {/* Resume Upload & AI Parsing Banner */}
      <div className="p-4 rounded-2xl bg-[#18161e] border border-[#24212c] space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[#e0b3ff] flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#c94dff]" /> AI Resume Auto-Parser & Dossier Upload
          </p>
          {parsedNotice && (
            <span className="text-xs text-[#5fe0a8] font-medium animate-fade-in flex items-center gap-1">
              <CheckCircle2 size={13} /> Auto-filled from resume!
            </span>
          )}
        </div>
        <FileUpload
          onFileSelect={handleFileSelect}
          currentFile={candidate?.resumeFile}
        />
      </div>

      {/* Duplicate Warning Alert */}
      {duplicate && (
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-400 text-xs flex items-center gap-2 animate-fade-in">
          <AlertTriangle size={16} className="shrink-0" />
          <div>
            <strong>Possible Duplicate Detected:</strong> Candidate <strong>{duplicate.name}</strong> ({duplicate.email}) already exists in database.
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          placeholder="Jordan Lee"
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />
        <Input
          label="Email"
          type="email"
          placeholder="jordan@email.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
          })}
        />
        <Input
          label="Phone"
          placeholder="+1-555-0100"
          {...register('phone')}
        />
        <Input
          label="Location"
          placeholder="San Francisco, CA"
          {...register('location')}
        />
        <Input
          label="Role Applied For"
          placeholder="Frontend Engineer"
          error={errors.role?.message}
          {...register('role', { required: 'Role is required' })}
        />
        <Select
          label="Department"
          options={DEPARTMENT_OPTIONS}
          {...register('department')}
        />
        <Input
          label="Experience"
          placeholder="4 years"
          {...register('experience')}
        />
        <Input
          label="Expected Salary"
          placeholder="$120,000"
          {...register('salary')}
        />
        <Select
          label="Status"
          options={STATUS_OPTIONS}
          {...register('status')}
        />
      </div>

      <Input
        label="Skills (comma-separated)"
        placeholder="React, TypeScript, CSS, GraphQL"
        {...register('skills')}
      />

      <Textarea
        label="Notes"
        placeholder="Additional notes about this candidate..."
        {...register('notes')}
      />

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting} id="save-candidate-btn">
          {candidate ? 'Update Candidate' : 'Add Candidate'}
        </Button>
      </div>
    </form>
  );
};
