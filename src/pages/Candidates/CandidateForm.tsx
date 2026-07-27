import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { candidateService } from '../../services/candidateService';
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CandidateFormData>({
    defaultValues: candidate
      ? { ...candidate, skills: candidate.skills.join(', ') }
      : { status: 'Applied', department: 'Engineering' },
  });

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
    <form onSubmit={handleSubmit(onSubmit)} id="candidate-form" className="space-y-4">
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

      <div>
        <p className="text-xs font-medium mb-2 text-[#a8a6b3]">Resume / CV</p>
        <FileUpload
          onFileSelect={setResumeFile}
          currentFile={candidate?.resumeFile}
        />
      </div>

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
