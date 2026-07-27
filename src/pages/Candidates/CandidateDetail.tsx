import React from 'react';
import { Mail, Phone, MapPin, Briefcase, Calendar, DollarSign, FileText, Edit2, Download } from 'lucide-react';
import type { Candidate } from '../../types';
import { formatDate, getInitials, downloadCandidateResume } from '../../utils/helpers';
import { Button } from '../../components/UI/Button';
import { FileUpload } from '../../components/UI/FileUpload';
import { candidateService } from '../../services/candidateService';

const stageColor: Record<string, { bg: string; text: string }> = {
  Applied: { bg: '#241f2e', text: '#c9a6ff' },
  Screening: { bg: '#1e2a3a', text: '#7ec8ff' },
  Interview: { bg: '#3a2440', text: '#e29bff' },
  Offer: { bg: '#2a3a24', text: '#a8e07e' },
  Hired: { bg: '#1c3a2e', text: '#5fe0a8' },
  Rejected: { bg: '#3a1f1f', text: '#ff8b8b' },
};

interface CandidateDetailProps {
  candidate: Candidate;
  onEdit: () => void;
  onRefresh: () => void;
}

export const CandidateDetail: React.FC<CandidateDetailProps> = ({ candidate, onEdit, onRefresh }) => {
  const handleResumeUpload = async (file: File) => {
    await candidateService.updateResume(candidate.id, file.name);
    onRefresh();
  };

  const stageStyle = stageColor[candidate.status] || { bg: '#241f2e', text: '#c9a6ff' };

  return (
    <div className="space-y-5 animate-fade-in text-[#f2f1f5]">
      {/* Header */}
      <div className="flex items-start gap-4 pb-5 border-b border-[#1a1820]">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
          style={{ background: 'rgba(201,77,255,0.15)', color: '#e0b3ff' }}
        >
          {getInitials(candidate.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-[#f2f1f5]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {candidate.name}
              </h3>
              <p className="text-sm mt-0.5" style={{ color: '#8b899a' }}>
                {candidate.role} · {candidate.department}
              </p>
            </div>
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: stageStyle.bg, color: stageStyle.text }}
            >
              {candidate.status}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 mt-3 text-sm" style={{ color: '#8b899a' }}>
            <span className="flex items-center gap-1.5"><Mail size={13} />{candidate.email}</span>
            <span className="flex items-center gap-1.5"><Phone size={13} />{candidate.phone}</span>
            <span className="flex items-center gap-1.5"><MapPin size={13} />{candidate.location}</span>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { icon: <Briefcase size={14} />, label: 'Experience', value: candidate.experience },
          { icon: <DollarSign size={14} />, label: 'Salary Expectation', value: candidate.salary || '—' },
          { icon: <Calendar size={14} />, label: 'Applied Date', value: formatDate(candidate.appliedDate) },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: '#18161e', border: '1px solid #24212c' }}
          >
            <div style={{ color: '#c94dff' }}>{item.icon}</div>
            <div>
              <p className="text-[11px]" style={{ color: '#8b899a' }}>{item.label}</p>
              <p className="text-sm font-medium text-[#f2f1f5]">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      {candidate.skills.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: '#a8a6b3' }}>Skills</p>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: 'rgba(201,77,255,0.12)', color: '#e0b3ff', border: '1px solid rgba(201,77,255,0.2)' }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {candidate.notes && (
        <div>
          <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: '#a8a6b3' }}>
            <FileText size={13} /> Notes
          </p>
          <p
            className="text-xs p-3 rounded-xl leading-relaxed"
            style={{ background: '#18161e', border: '1px solid #24212c', color: '#8b899a' }}
          >
            {candidate.notes}
          </p>
        </div>
      )}

      {/* Resume upload */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium" style={{ color: '#a8a6b3' }}>Resume / CV</p>
          <button
            onClick={() => downloadCandidateResume(candidate)}
            className="flex items-center gap-1 text-xs font-medium text-[#5fe0a8] hover:underline cursor-pointer"
          >
            <Download size={13} /> Download Resume
          </button>
        </div>
        <FileUpload
          onFileSelect={handleResumeUpload}
          currentFile={candidate.resumeFile}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
      {/* Action bar */}
      <div className="flex flex-wrap gap-3 pt-2">
        <Button variant="outline" leftIcon={<Download size={15} />} onClick={() => downloadCandidateResume(candidate)} className="flex-1">
          Download Resume
        </Button>
        <a
          href={`/interviews?schedule=true&candidateId=${candidate.id}`}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all hover:scale-105 cursor-pointer flex-1"
          style={{ background: 'linear-gradient(135deg,#c94dff,#7c3aed)', color: '#0c0b10' }}
        >
          <Calendar size={15} /> Schedule Interview
        </a>
        <Button variant="outline" leftIcon={<Edit2 size={15} />} onClick={onEdit} className="flex-1" id="edit-from-detail">
          Edit Profile
        </Button>
      </div>
    </div>
  );
};
