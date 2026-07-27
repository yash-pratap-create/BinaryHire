import React from 'react';
import { useForm } from 'react-hook-form';
import { roleService } from '../../services/roleService';
import type { Role, RoleFormData } from '../../types';
import { Input, Select, Textarea } from '../../components/UI/FormFields';
import { Button } from '../../components/UI/Button';

const STATUS_OPTIONS = ['Open', 'Closed', 'Paused'].map((s) => ({ value: s, label: s }));
const TYPE_OPTIONS = ['Full-time', 'Part-time', 'Contract', 'Internship'].map((t) => ({ value: t, label: t }));
const DEPT_OPTIONS = ['Engineering', 'Product', 'Design', 'Data', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'].map((d) => ({ value: d, label: d }));

interface RoleFormProps {
  role?: Role | null;
  onSaved: () => void;
  onCancel: () => void;
}

export const RoleForm: React.FC<RoleFormProps> = ({ role, onSaved, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormData>({
    defaultValues: role
      ? { ...role, requirements: role.requirements.join(', ') }
      : { status: 'Open', type: 'Full-time', department: 'Engineering' },
  });

  const onSubmit = async (data: RoleFormData) => {
    if (role) {
      await roleService.update(role.id, data);
    } else {
      await roleService.create(data);
    }
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="role-form" className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="Job Title"
            placeholder="Senior Frontend Engineer"
            error={errors.title?.message}
            {...register('title', { required: 'Title is required' })}
          />
        </div>
        <Select label="Department" options={DEPT_OPTIONS} {...register('department')} />
        <Input label="Location" placeholder="Remote / New York, NY" {...register('location')} />
        <Select label="Type" options={TYPE_OPTIONS} {...register('type')} />
        <Select label="Status" options={STATUS_OPTIONS} {...register('status')} />
        <Input label="Salary Range" placeholder="$120,000 - $150,000" {...register('salary')} />
        <Input label="Experience Required" placeholder="4+ years" {...register('experience')} />
        <Input label="Hiring Manager" placeholder="Alex Morgan" {...register('hiringManager')} />
        <Input label="Application Deadline" type="date" {...register('deadline')} />
      </div>

      <Textarea
        label="Job Description"
        placeholder="Describe the role, responsibilities, and team..."
        {...register('description')}
        className="h-24"
      />

      <Input
        label="Requirements (comma-separated)"
        placeholder="React, TypeScript, GraphQL, Testing"
        {...register('requirements')}
      />

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting} id="save-role-btn">
          {role ? 'Update Role' : 'Post Role'}
        </Button>
      </div>
    </form>
  );
};
