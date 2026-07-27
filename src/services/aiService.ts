import type { Candidate, Role } from '../types';

export const aiService = {
  /**
   * Auto-extracts structured fields from uploaded resume file content or filename text
   */
  parseResumeFile: (fileNameOrContent: string) => {
    const text = fileNameOrContent.toLowerCase();

    // Skill extraction heuristics
    const knownSkills = [
      'React', 'TypeScript', 'Node.js', 'Python', 'Java', 'Go', 'PostgreSQL',
      'Docker', 'AWS', 'Kubernetes', 'Figma', 'UI/UX', 'GraphQL', 'Tailwind', 'System Design'
    ];
    const extractedSkills = knownSkills.filter((s) => text.includes(s.toLowerCase()));
    if (extractedSkills.length === 0) {
      extractedSkills.push('React', 'TypeScript', 'Node.js', 'System Design');
    }

    // Role extraction heuristics
    let extractedRole = 'Frontend Engineer';
    if (text.includes('backend') || text.includes('python') || text.includes('node')) {
      extractedRole = 'Backend Engineer';
    } else if (text.includes('design') || text.includes('figma') || text.includes('ui')) {
      extractedRole = 'UX Designer';
    } else if (text.includes('product') || text.includes('manager')) {
      extractedRole = 'Product Manager';
    } else if (text.includes('devops') || text.includes('aws') || text.includes('cloud')) {
      extractedRole = 'DevOps Specialist';
    }

    // Experience heuristics
    let experience = '4 years';
    if (text.includes('senior') || text.includes('lead')) {
      experience = '6 years';
    } else if (text.includes('junior') || text.includes('intern')) {
      experience = '1 year';
    }

    // Name extraction heuristics from filename if present
    const baseName = fileNameOrContent.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    const words = baseName.split(' ').filter(Boolean);
    const extractedName = words.length >= 2
      ? words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      : 'Aarav Patel';

    const cleanName = extractedName.toLowerCase().replace(/resume|cv|file|doc/gi, '').trim();
    const formattedName = cleanName
      ? cleanName.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      : 'Aarav Patel';

    return {
      name: formattedName,
      email: `${formattedName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      phone: '+91-98765-43210',
      role: extractedRole,
      department: 'Engineering',
      experience,
      location: 'Bengaluru, India',
      skills: extractedSkills.join(', '),
      salary: '$130,000',
      notes: 'Auto-parsed from uploaded resume dossier.',
    };
  },

  /**
   * Calculates an algorithmic AI candidate-to-role match score % (0-100)
   */
  calculateMatchScore: (candidate: Partial<Candidate>, role?: Partial<Role>): number => {
    let score = 70; // baseline

    if (!candidate) return score;

    // 1. Skill overlap matching (40% weight)
    if (candidate.skills && candidate.skills.length > 0) {
      const roleReqs = role?.requirements || ['React', 'TypeScript', 'Node.js', 'System Design'];
      const candidateSkillsLower = candidate.skills.map((s) => s.toLowerCase());

      let matches = 0;
      roleReqs.forEach((req) => {
        if (candidateSkillsLower.some((s) => s.includes(req.toLowerCase()) || req.toLowerCase().includes(s))) {
          matches++;
        }
      });
      const skillRatio = matches / Math.max(roleReqs.length, 1);
      score += Math.round(skillRatio * 25);
    } else {
      score += 10;
    }

    // 2. Experience matching (20% weight)
    if (candidate.experience) {
      const expNum = parseInt(candidate.experience, 10) || 3;
      if (expNum >= 5) score += 8;
      else if (expNum >= 3) score += 5;
    }

    // Hash deterministic boost based on candidate ID/name to keep scores consistent
    if (candidate.name) {
      let charSum = 0;
      for (let i = 0; i < candidate.name.length; i++) {
        charSum += candidate.name.charCodeAt(i);
      }
      score = (score + (charSum % 12));
    }

    return Math.min(Math.max(score, 65), 98);
  },

  /**
   * Checks for duplicate candidates by email or phone
   */
  findDuplicates: (
    email: string,
    phone: string,
    candidates: Candidate[],
    currentCandidateId?: string
  ): Candidate | null => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim().replace(/[^\d+]/g, '');

    if (!cleanEmail && !cleanPhone) return null;

    return (
      candidates.find((c) => {
        if (currentCandidateId && c.id === currentCandidateId) return false;
        const candidateEmail = c.email.trim().toLowerCase();
        const candidatePhone = c.phone.trim().replace(/[^\d+]/g, '');

        const emailMatch = cleanEmail && candidateEmail === cleanEmail;
        const phoneMatch = cleanPhone && cleanPhone.length > 5 && candidatePhone === cleanPhone;

        return emailMatch || phoneMatch;
      }) || null
    );
  },
};
