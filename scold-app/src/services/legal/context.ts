interface LegalContextInfo {
  keywords: string[];
  context: string;
}

const LEGAL_KNOWLEDGE_BASE: Record<string, LegalContextInfo[]> = {
  'India': [
    {
      keywords: ['harassment', 'uncomfortable', 'touch', 'inappropriate', 'comments', 'sexual'],
      context: `The POSH Act 2013 (Prevention of Sexual Harassment) mandates that workplaces with 10+ employees must have an Internal Committee (IC). Complaints should ideally be filed within 90 days of the incident. Employees have the right to a safe working environment. Remember to advise documenting the incidents (dates, times, witnesses).`
    },
    {
      keywords: ['fired', 'terminated', 'resigned', 'notice period', 'salary delayed', 'unpaid'],
      context: `Under Indian labor laws, termination must usually be accompanied by a notice period or pay in lieu (as per the employment contract). Unpaid wages can be claimed under the Payment of Wages Act. Employees cannot be unlawfully terminated without due process.`
    }
  ],
  'US': [
    {
      keywords: ['harassment', 'uncomfortable', 'touch', 'inappropriate', 'comments', 'sexual', 'hostile'],
      context: `Title VII of the Civil Rights Act prohibits workplace sexual harassment and creates liability for a hostile work environment. Employees should report incidents to HR immediately. The EEOC (Equal Employment Opportunity Commission) handles federal complaints.`
    },
    {
      keywords: ['fired', 'terminated', 'discrimination', 'race', 'gender', 'age', 'pregnant'],
      context: `While most US employment is "at-will", it is illegal to fire someone due to discrimination based on protected classes (race, color, religion, sex, national origin, age, disability, or genetic information) under EEOC guidelines.`
    }
  ],
  'General': [
    {
      keywords: ['bullying', 'toxic', 'yelling', 'screaming', 'abusive', 'boss', 'manager'],
      context: `Workplace bullying is not always strictly illegal unless tied to a protected class, but it violates standard corporate codes of conduct. Advise the user to document everything (dates, times, exactly what was said) and consider communicating via written channels to create a paper trail. If it escalates, HR involvement may be necessary.`
    }
  ]
};

export const getLegalContext = (location: string = 'General', situation: string): string => {
  const situationLower = situation.toLowerCase();
  const contextSnippets: string[] = [];

  const locationRules = LEGAL_KNOWLEDGE_BASE[location] || [];
  for (const rule of locationRules) {
    if (rule.keywords.some(kw => situationLower.includes(kw))) {
      contextSnippets.push(rule.context);
    }
  }

  for (const rule of LEGAL_KNOWLEDGE_BASE['General']) {
    if (rule.keywords.some(kw => situationLower.includes(kw))) {
      if (!contextSnippets.includes(rule.context)) {
        contextSnippets.push(rule.context);
      }
    }
  }

  if (contextSnippets.length > 0) {
    return contextSnippets.join('\n\n');
  }

  return '';
};
