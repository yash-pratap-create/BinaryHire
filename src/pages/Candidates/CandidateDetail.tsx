import React, { useState } from 'react';
import {
  Mail, Phone, MapPin, Briefcase, Calendar, DollarSign, FileText,
  Edit2, Download, Star, MessageSquare, Award, CheckCircle2, Plus, Send, Globe, ShieldCheck
} from 'lucide-react';
import type { Candidate, Scorecard, CandidateComment, OfferApprovalStage } from '../../types';
import { formatDate, getInitials, downloadCandidateResume } from '../../utils/helpers';
import { Button } from '../../components/UI/Button';
import { FileUpload } from '../../components/UI/FileUpload';
import { candidateService } from '../../services/candidateService';
import { ScorecardForm } from '../../components/Candidates/ScorecardForm';
import { Modal } from '../../components/UI/Modal';
import { useAuth } from '../../context/AuthContext';

const stageColor: Record<string, { bg: string; text: string }> = {
  Applied: { bg: '#241f2e', text: '#c9a6ff' },
  Screening: { bg: '#1e2a3a', text: '#7ec8ff' },
  Interview: { bg: '#3a2440', text: '#e29bff' },
  Offer: { bg: '#2a3a24', text: '#a8e07e' },
  Hired: { bg: '#1c3a2e', text: '#5fe0a8' },
  Rejected: { bg: '#3a1f1f', text: '#ff8b8b' },
};

const OFFER_STAGES: OfferApprovalStage[] = ['Draft', 'Manager Approved', 'HR Approved', 'Offer Extended'];

interface CandidateDetailProps {
  candidate: Candidate;
  onEdit: () => void;
  onRefresh: () => void;
}

export const CandidateDetail: React.FC<CandidateDetailProps> = ({ candidate, onEdit, onRefresh }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'scorecards' | 'comments' | 'offer'>('overview');
  const [showScorecardModal, setShowScorecardModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commenting, setCommenting] = useState(false);

  const handleResumeUpload = async (file: File) => {
    await candidateService.updateResume(candidate.id, file.name);
    onRefresh();
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommenting(true);
    try {
      const commentObj: CandidateComment = {
        id: `cm-${Date.now()}`,
        candidateId: candidate.id,
        author: user?.name || 'Ananya Sharma',
        text: newComment,
        date: new Date().toISOString().split('T')[0],
      };

      const updatedComments = [...(candidate.comments || []), commentObj];
      await candidateService.update(candidate.id, { comments: updatedComments });
      setNewComment('');
      onRefresh();
    } finally {
      setCommenting(false);
    }
  };

  const handleAdvanceOfferStage = async (nextStage: OfferApprovalStage) => {
    const approval = candidate.offerApproval || { stage: 'Draft' };
    const updatedApproval = {
      ...approval,
      stage: nextStage,
      managerApprovedBy: nextStage === 'Manager Approved' || nextStage === 'HR Approved' || nextStage === 'Offer Extended'
        ? (approval.managerApprovedBy || user?.name || 'Yash Pratap Singh')
        : approval.managerApprovedBy,
      hrApprovedBy: nextStage === 'HR Approved' || nextStage === 'Offer Extended'
        ? (approval.hrApprovedBy || user?.name || 'Ananya Sharma')
        : approval.hrApprovedBy,
      salaryOffered: approval.salaryOffered || candidate.salary || '$125,000',
    };

    await candidateService.update(candidate.id, {
      offerApproval: updatedApproval,
      status: nextStage === 'Offer Extended' ? 'Offer' : candidate.status,
    });
    onRefresh();
  };

  const stageStyle = stageColor[candidate.status] || { bg: '#241f2e', text: '#c9a6ff' };
  const currentOfferStage = candidate.offerApproval?.stage || 'Draft';
  const offerStepIndex = OFFER_STAGES.indexOf(currentOfferStage);

  // Calculate average rating from scorecards
  const scorecards = candidate.scorecards || [];
  const avgRating = scorecards.length > 0
    ? (scorecards.reduce((acc, sc) => acc + (sc.technicalRating + sc.communicationRating + sc.problemSolvingRating + sc.cultureFitRating) / 4, 0) / scorecards.length).toFixed(1)
    : null;

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
            <div className="flex items-center gap-2">
              {candidate.source && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#18161e] border border-[#24212c] text-[#5ce1e6] flex items-center gap-1 font-medium">
                  <Globe size={12} /> {candidate.source}
                </span>
              )}
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ background: stageStyle.bg, color: stageStyle.text }}
              >
                {candidate.status}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-3 text-sm" style={{ color: '#8b899a' }}>
            <span className="flex items-center gap-1.5"><Mail size={13} />{candidate.email}</span>
            <span className="flex items-center gap-1.5"><Phone size={13} />{candidate.phone}</span>
            <span className="flex items-center gap-1.5"><MapPin size={13} />{candidate.location}</span>
          </div>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1a1820] pb-2">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'scorecards', label: `Scorecards (${scorecards.length})` },
          { key: 'comments', label: `Comments & @Mentions (${(candidate.comments || []).length})` },
          { key: 'offer', label: `Offer Approval (${currentOfferStage})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'bg-[#c94dff] text-[#0c0b10]'
                : 'text-[#8b899a] hover:text-[#f2f1f5] hover:bg-[#18161e]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: <Briefcase size={14} />, label: 'Experience', value: candidate.experience },
              { icon: <DollarSign size={14} />, label: 'Salary Expectation', value: candidate.salary || '—' },
              { icon: <Calendar size={14} />, label: 'Applied Date', value: formatDate(candidate.appliedDate) },
              { icon: <Star size={14} />, label: 'Interviewer Rating', value: avgRating ? `${avgRating} / 5.0 ⭐` : 'No scorecards yet' },
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

          {/* Resume Upload */}
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
        </div>
      )}

      {/* TAB 2: SCORECARDS */}
      {activeTab === 'scorecards' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#f2f1f5]">Interview Evaluations</h4>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => setShowScorecardModal(true)}
            >
              Add Scorecard
            </Button>
          </div>

          {scorecards.length === 0 ? (
            <div className="p-8 text-center text-[#8b899a] bg-[#18161e] rounded-2xl border border-[#24212c]">
              <Star size={32} className="mx-auto mb-2 opacity-30 text-[#c94dff]" />
              <p className="text-sm font-medium">No scorecards submitted yet</p>
              <p className="text-xs mt-1">Submit structured interviewer feedback after evaluating this candidate.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scorecards.map((sc) => (
                <div key={sc.id} className="p-4 rounded-2xl bg-[#18161e] border border-[#24212c] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#f2f1f5]">{sc.round}</p>
                      <p className="text-xs text-[#8b899a]">Evaluated by <strong>{sc.interviewer}</strong> on {formatDate(sc.date)}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      sc.recommendation.includes('Hire') ? 'bg-[#1c3a2e] text-[#5fe0a8]' : 'bg-[#3a1f1f] text-[#ff8b8b]'
                    }`}>
                      {sc.recommendation}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-[#111116]">
                      <span className="text-[#8b899a] block">Technical</span>
                      <strong className="text-amber-400">{sc.technicalRating} / 5 ⭐</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-[#111116]">
                      <span className="text-[#8b899a] block">Communication</span>
                      <strong className="text-amber-400">{sc.communicationRating} / 5 ⭐</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-[#111116]">
                      <span className="text-[#8b899a] block">Problem Solving</span>
                      <strong className="text-amber-400">{sc.problemSolvingRating} / 5 ⭐</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-[#111116]">
                      <span className="text-[#8b899a] block">Culture Fit</span>
                      <strong className="text-amber-400">{sc.cultureFitRating} / 5 ⭐</strong>
                    </div>
                  </div>

                  {sc.comments && (
                    <p className="text-xs text-[#a8a6b3] italic bg-[#111116] p-3 rounded-xl border border-[#24212c]">
                      "{sc.comments}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COMMENTS & @MENTIONS */}
      {activeTab === 'comments' && (
        <div className="space-y-4">
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Leave a note or mention someone (e.g. @Yash Pratap Singh)..."
              className="flex-1 px-4 py-2.5 rounded-xl text-xs outline-none bg-[#18161e] border border-[#24212c] text-[#f2f1f5]"
            />
            <Button type="submit" variant="primary" size="sm" isLoading={commenting} leftIcon={<Send size={14} />}>
              Post
            </Button>
          </form>

          {(candidate.comments || []).length === 0 ? (
            <div className="p-8 text-center text-[#8b899a] bg-[#18161e] rounded-2xl border border-[#24212c]">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-30 text-[#5ce1e6]" />
              <p className="text-sm font-medium">No comments yet</p>
              <p className="text-xs mt-1">Leave team notes and tag recruiters or hiring managers.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {(candidate.comments || []).map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl bg-[#18161e] border border-[#24212c] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <strong className="text-[#e0b3ff]">{c.author}</strong>
                    <span className="text-[#8b899a] text-[11px]">{formatDate(c.date)}</span>
                  </div>
                  <p className="text-xs text-[#f2f1f5] leading-relaxed">
                    {c.text.split(' ').map((word, idx) => (
                      word.startsWith('@') ? (
                        <span key={idx} className="text-[#5ce1e6] font-bold bg-[#5ce1e6]/10 px-1 py-0.5 rounded mr-1">
                          {word}{' '}
                        </span>
                      ) : (
                        word + ' '
                      )
                    ))}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: OFFER APPROVAL WORKFLOW */}
      {activeTab === 'offer' && (
        <div className="space-y-5 p-4 rounded-2xl bg-[#18161e] border border-[#24212c]">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#f2f1f5] flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#5fe0a8]" /> Offer Approval Chain
            </h4>
            <span className="text-xs px-3 py-1 rounded-full bg-[#1c3a2e] text-[#5fe0a8] font-bold">
              Current: {currentOfferStage}
            </span>
          </div>

          {/* Stepper Timeline */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {OFFER_STAGES.map((st, idx) => {
              const isPassed = idx <= offerStepIndex;
              return (
                <div key={st} className="flex flex-col items-center text-center gap-1.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isPassed ? 'bg-[#c94dff] text-[#0c0b10]' : 'bg-[#111116] text-[#8b899a] border border-[#24212c]'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className={`text-[11px] font-medium ${isPassed ? 'text-[#f2f1f5]' : 'text-[#8b899a]'}`}>
                    {st}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-[#111116] text-xs space-y-1 text-[#8b899a]">
            <p><strong>Salary Offered:</strong> {candidate.offerApproval?.salaryOffered || candidate.salary || '$125,000'}</p>
            {candidate.offerApproval?.managerApprovedBy && (
              <p><strong>Hiring Manager Approval:</strong> Verified by {candidate.offerApproval.managerApprovedBy}</p>
            )}
            {candidate.offerApproval?.hrApprovedBy && (
              <p><strong>HR Executive Approval:</strong> Verified by {candidate.offerApproval.hrApprovedBy}</p>
            )}
          </div>

          {/* Action Buttons for Next Step */}
          <div className="flex flex-wrap gap-2 pt-1">
            {currentOfferStage === 'Draft' && (
              <Button size="sm" variant="primary" onClick={() => handleAdvanceOfferStage('Manager Approved')}>
                Approve as Hiring Manager
              </Button>
            )}
            {currentOfferStage === 'Manager Approved' && (
              <Button size="sm" variant="primary" onClick={() => handleAdvanceOfferStage('HR Approved')}>
                Approve as HR Manager
              </Button>
            )}
            {currentOfferStage === 'HR Approved' && (
              <Button size="sm" variant="primary" onClick={() => handleAdvanceOfferStage('Offer Extended')}>
                Extend Official Offer
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-wrap gap-3 pt-3 border-t border-[#1a1820]">
        <Button variant="outline" leftIcon={<Download size={15} />} onClick={() => downloadCandidateResume(candidate)} className="flex-1">
          Download Resume
        </Button>
        <a
          href={`/interviews?schedule=true&candidateId=${candidate.id}`}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all hover:scale-105 cursor-pointer flex-1"
          style={{ background: 'linear-gradient(135deg,#c94dff,#7c3aed)', color: '#0c0b10' }}
        >
          <Calendar size={15} /> Schedule Interview
        </a>
        <Button variant="outline" leftIcon={<Edit2 size={15} />} onClick={onEdit} className="flex-1">
          Edit Profile
        </Button>
      </div>

      {/* Scorecard Modal */}
      <Modal
        isOpen={showScorecardModal}
        onClose={() => setShowScorecardModal(false)}
        title="Submit Interview Scorecard"
        size="lg"
      >
        <ScorecardForm
          candidate={candidate}
          onSaved={() => { setShowScorecardModal(false); onRefresh(); }}
          onCancel={() => setShowScorecardModal(false)}
        />
      </Modal>
    </div>
  );
};
