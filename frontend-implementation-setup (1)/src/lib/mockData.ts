import type {
  Claim, ClaimStatus, ClaimType, RiskLevel, RiskFactor, AIAnalysis,
  Policy, PolicyType, PolicyStatus, User, DashboardStats, ClaimsTrendData,
  RiskDistribution, RecentActivity, FraudAlert, AuditLogEntry, ClaimNote,
  AppNotification, PolicyRule, CustomerPolicy, CustomerClaim, CustomerPayment,
} from '@/types';

const rid = () => Math.random().toString(36).substring(2, 9);
const randomDate = (daysAgo: number) => { const d = new Date(); d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo)); return d.toISOString(); };
const claimTypes: ClaimType[]   = ['auto_collision','auto_theft','property_damage','medical','liability','natural_disaster'];
const statuses:   ClaimStatus[] = ['submitted','under_review','pending_info','approved','rejected','escalated'];
const names = ['John Smith','Emily Johnson','Michael Brown','Sarah Davis','David Wilson','Jennifer Martinez','Robert Anderson','Lisa Thomas','William Jackson','Maria Garcia'];
const descs = [
  'Vehicle collision at intersection. Front bumper and hood damage reported.',
  'Rear-end collision in parking lot. Minor bumper and trunk damage.',
  'Water damage from burst pipe. Kitchen flooring and cabinets affected.',
  'Theft of vehicle from parking garage. Police report filed.',
  'Hail damage to roof. Multiple shingles damaged. Gutters dented.',
  'Medical claim for emergency surgery following automobile accident.',
  'Property damage from fallen tree during storm. Roof partially collapsed.',
  'Liability claim: third-party injury on insured property.',
];

const generateRiskFactors = (riskScore: number): RiskFactor[] => {
  const f: RiskFactor[] = [];
  if (riskScore > 20) f.push({ id: rid(), name: 'High Claim Amount',      description: 'Amount is above average for this claim type',    impact: riskScore > 60 ? 'high' : 'medium', score: Math.floor(riskScore * 0.25), category: 'financial'  });
  if (riskScore > 40) f.push({ id: rid(), name: 'Multiple Recent Claims', description: 'Several claims filed in the past two years',       impact: 'medium', score: Math.floor(riskScore * 0.2),  category: 'historical' });
  if (riskScore > 60) f.push({ id: rid(), name: 'Document Mismatch',      description: 'Dates or amounts in documents do not match',      impact: 'high',   score: Math.floor(riskScore * 0.25), category: 'document'   });
  if (riskScore > 75) f.push({ id: rid(), name: 'Recent Policy Change',   description: 'Claim filed shortly after coverage was updated',  impact: 'high',   score: Math.floor(riskScore * 0.3),  category: 'behavioral' });
  return f;
};

const generateAI = (riskScore: number, submittedAt: string): AIAnalysis => {
  const riskLevel: RiskLevel = riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 40 ? 'medium' : 'low';
  return {
    riskScore,
    fraudProbability: Math.min(Math.max(riskScore + Math.floor(Math.random() * 15) - 7, 0), 99),
    confidence: 75 + Math.floor(Math.random() * 20),
    riskLevel,
    recommendation: riskScore >= 70 ? 'investigate' : riskScore >= 40 ? 'review' : 'approve',
    factors: generateRiskFactors(riskScore),
    modelVersion: 'v2.4.1',
    analyzedAt: new Date(new Date(submittedAt).getTime() + 5000).toISOString(),
    processingTimeMs: 1500 + Math.floor(Math.random() * 2000),
  };
};

export const mockClaims: Claim[] = Array.from({ length: 52 }, (_, i) => {
  const riskScore  = Math.floor(Math.random() * 100);
  const status     = statuses[Math.floor(Math.random() * statuses.length)];
  const submittedAt = randomDate(90);
  const name       = names[Math.floor(Math.random() * names.length)];
  const claimType  = claimTypes[Math.floor(Math.random() * claimTypes.length)];
  const riskLevel: RiskLevel = riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 40 ? 'medium' : 'low';
  return {
    id: `claim_${i + 1}`,
    claimNumber: `CLM-2024-${String(i + 1001).padStart(4, '0')}`,
    policyNumber: `POL-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    claimant: { name, email: `${name.toLowerCase().replace(' ', '.')}@email.com`, phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}` },
    type: claimType,
    description: descs[Math.floor(Math.random() * descs.length)],
    amount: Math.floor(Math.random() * 45000) + 5000,
    status, riskScore, riskLevel,
    fraudProbability: Math.min(Math.max(riskScore + Math.floor(Math.random() * 15) - 7, 0), 99),
    submittedAt, updatedAt: randomDate(30),
    assignedToName: status !== 'submitted' ? ['Sarah Chen','Mike Ross','Emily Wang'][Math.floor(Math.random() * 3)] : undefined,
    documents: [
      { id: rid(), name: 'damage_photos.zip', type: 'application/zip',  size: 4500000, uploadedAt: submittedAt },
      { id: rid(), name: 'police_report.pdf',  type: 'application/pdf', size: 250000,  uploadedAt: submittedAt },
    ],
    timeline: [
      { id: rid(), type: 'status_change', title: 'Claim Submitted',       description: 'Claim submitted by policyholder',               timestamp: submittedAt, userName: 'System'    },
      { id: rid(), type: 'ai_analysis',   title: 'AI Analysis Complete',  description: `Risk score: ${riskScore}/100 — ${riskLevel} risk`, timestamp: new Date(new Date(submittedAt).getTime() + 5000).toISOString(), userName: 'AI Engine' },
    ],
    aiAnalysis: generateAI(riskScore, submittedAt),
  };
});

export const mockUsers: User[] = [
  { id: 'user_1', email: 'admin@insurai.com',        name: 'Maruthi',       role: 'admin',    department: 'Administration',    isActive: true,  createdAt: '2023-01-15T00:00:00Z', lastLogin: new Date().toISOString() },
  { id: 'user_2', email: 'sarah.chen@insurai.com',   name: 'Sarah Chen',    role: 'manager',  department: 'Claims Management', isActive: true,  createdAt: '2023-02-20T00:00:00Z', lastLogin: new Date(Date.now() - 3600000).toISOString() },
  { id: 'user_3', email: 'mike.ross@insurai.com',    name: 'Mike Ross',     role: 'analyst',  department: 'Risk Analysis',     isActive: true,  createdAt: '2023-03-10T00:00:00Z' },
  { id: 'user_4', email: 'emily.wang@insurai.com',   name: 'Emily Wang',    role: 'analyst',  department: 'Fraud Detection',   isActive: true,  createdAt: '2023-04-05T00:00:00Z' },
  { id: 'user_5', email: 'james.wilson@insurai.com', name: 'James Wilson',  role: 'agent',    department: 'Claims Processing', isActive: true,  createdAt: '2023-05-15T00:00:00Z' },
  { id: 'user_6', email: 'priya.patel@insurai.com',  name: 'Priya Patel',   role: 'agent',    department: 'Claims Processing', isActive: false, createdAt: '2023-06-01T00:00:00Z' },
];

export const getCurrentUser = (): User => mockUsers[0];

export const mockCustomerUser: User = {
  id: 'customer_1', email: 'customer@insurai.com', name: 'Maruthi',
  role: 'customer', department: 'Policyholder', isActive: true,
  createdAt: '2023-06-01T00:00:00Z', lastLogin: new Date().toISOString(),
};

export const mockCustomerPolicies: CustomerPolicy[] = [
  { id: 'cpol_1', policyNumber: 'POL-7821', type: 'auto',   status: 'active',  coverageAmount: 150000, premium: 1200, deductible: 1000, startDate: new Date(Date.now() - 180*86400000).toISOString(), endDate: new Date(Date.now() + 185*86400000).toISOString(), nextPaymentDate: new Date(Date.now() + 15*86400000).toISOString(), nextPaymentAmount: 1200 },
  { id: 'cpol_2', policyNumber: 'POL-4392', type: 'home',   status: 'active',  coverageAmount: 450000, premium: 2400, deductible: 2500, startDate: new Date(Date.now() - 90*86400000).toISOString(),  endDate: new Date(Date.now() + 275*86400000).toISOString(), nextPaymentDate: new Date(Date.now() + 22*86400000).toISOString(), nextPaymentAmount: 2400 },
  { id: 'cpol_3', policyNumber: 'POL-1157', type: 'health', status: 'pending', coverageAmount: 100000, premium: 800,  deductible: 500,  startDate: new Date(Date.now() + 10*86400000).toISOString(),  endDate: new Date(Date.now() + 375*86400000).toISOString(), nextPaymentDate: new Date(Date.now() + 10*86400000).toISOString(), nextPaymentAmount: 800  },
];

export const mockCustomerClaims: CustomerClaim[] = [
  { id: 'cclaim_1', claimNumber: 'CLM-2024-0042', policyNumber: 'POL-7821', type: 'auto_collision',  status: 'under_review',  amount: 8500,  submittedAt: new Date(Date.now()-5*86400000).toISOString(),  updatedAt: new Date(Date.now()-2*86400000).toISOString(),  description: 'Rear-end collision at traffic light. Bumper and trunk damage.'        },
  { id: 'cclaim_2', claimNumber: 'CLM-2024-0031', policyNumber: 'POL-7821', type: 'auto_theft',      status: 'approved',      amount: 3200,  submittedAt: new Date(Date.now()-22*86400000).toISOString(), updatedAt: new Date(Date.now()-15*86400000).toISOString(), description: 'Stolen vehicle accessories. Police report filed.'                      },
  { id: 'cclaim_3', claimNumber: 'CLM-2024-0018', policyNumber: 'POL-4392', type: 'property_damage', status: 'pending_info',  amount: 12000, submittedAt: new Date(Date.now()-35*86400000).toISOString(), updatedAt: new Date(Date.now()-28*86400000).toISOString(), description: 'Water damage from burst pipe in kitchen.'                              },
  { id: 'cclaim_4', claimNumber: 'CLM-2023-0094', policyNumber: 'POL-7821', type: 'auto_collision',  status: 'rejected',      amount: 1500,  submittedAt: new Date(Date.now()-60*86400000).toISOString(), updatedAt: new Date(Date.now()-55*86400000).toISOString(), description: 'Minor fender scratch — below deductible threshold.'                   },
];

export const mockCustomerPayments: CustomerPayment[] = [
  { id: 'pay_1', policyNumber: 'POL-7821', amount: 1200, dueDate: new Date(Date.now()+15*86400000).toISOString(), status: 'upcoming' },
  { id: 'pay_2', policyNumber: 'POL-4392', amount: 2400, dueDate: new Date(Date.now()+22*86400000).toISOString(), status: 'upcoming' },
  { id: 'pay_3', policyNumber: 'POL-7821', amount: 1200, dueDate: new Date(Date.now()-15*86400000).toISOString(), status: 'paid', paidAt: new Date(Date.now()-15*86400000).toISOString() },
  { id: 'pay_4', policyNumber: 'POL-4392', amount: 2400, dueDate: new Date(Date.now()-20*86400000).toISOString(), status: 'paid', paidAt: new Date(Date.now()-20*86400000).toISOString() },
];

const pTypes: PolicyType[]   = ['auto','home','health','life','business'];
const pStatuses: PolicyStatus[] = ['active','expired','cancelled','pending'];

export const mockPolicies: Policy[] = Array.from({ length: 30 }, (_, i) => {
  const name   = names[Math.floor(Math.random() * names.length)];
  const type   = pTypes[Math.floor(Math.random() * pTypes.length)];
  const status = pStatuses[Math.floor(Math.random() * pStatuses.length)];
  return { id: `policy_${i+1}`, policyNumber: `POL-${String(Math.floor(Math.random()*9000)+1000)}`, type, holderName: name, holderEmail: `${name.toLowerCase().replace(' ','.')}@email.com`, coverageAmount: Math.floor(Math.random()*500000)+100000, premium: Math.floor(Math.random()*3000)+500, deductible: Math.floor(Math.random()*2000)+500, startDate: new Date(Date.now()-Math.random()*365*86400000).toISOString(), endDate: new Date(Date.now()+Math.random()*365*86400000).toISOString(), status, claimsCount: Math.floor(Math.random()*5), totalClaimsAmount: Math.floor(Math.random()*50000) };
});

export const getDashboardStats = (): DashboardStats => {
  const total    = mockClaims.length;
  const approved = mockClaims.filter(c => c.status === 'approved').length;
  const pending  = mockClaims.filter(c => ['submitted','under_review','pending_info'].includes(c.status)).length;
  const highRisk = mockClaims.filter(c => ['high','critical'].includes(c.riskLevel)).length;
  const totalAmount = mockClaims.reduce((s,c) => s + c.amount, 0);
  return { totalClaims: total, claimsChange: 12.5, pendingReview: pending, pendingChange: -5.2, approvalRate: Math.round((approved/total)*100), approvalChange: 3.1, avgProcessingTime: 2.4, processingChange: -15.3, fraudDetected: highRisk, fraudChange: 8.7, totalPayout: totalAmount, payoutChange: 22.4 };
};

export const getClaimsTrend = (days = 30): ClaimsTrendData[] =>
  Array.from({ length: days }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (days - 1 - i));
    return { date: d.toISOString().split('T')[0], submitted: 5+Math.floor(Math.random()*10), approved: Math.floor(Math.random()*8), rejected: Math.floor(Math.random()*3), flagged: Math.floor(Math.random()*4) };
  });

export const getRiskDistribution = (): RiskDistribution[] => {
  const counts = { low: mockClaims.filter(c=>c.riskLevel==='low').length, medium: mockClaims.filter(c=>c.riskLevel==='medium').length, high: mockClaims.filter(c=>c.riskLevel==='high').length, critical: mockClaims.filter(c=>c.riskLevel==='critical').length };
  const total  = Object.values(counts).reduce((a,b)=>a+b,0);
  return [
    { level: 'low',      count: counts.low,      percentage: Math.round((counts.low/total)*100),      color: '#10B981' },
    { level: 'medium',   count: counts.medium,   percentage: Math.round((counts.medium/total)*100),   color: '#3B82F6' },
    { level: 'high',     count: counts.high,      percentage: Math.round((counts.high/total)*100),     color: '#F59E0B' },
    { level: 'critical', count: counts.critical, percentage: Math.round((counts.critical/total)*100), color: '#EF4444' },
  ];
};

export const getRecentActivity = (): RecentActivity[] => [
  { id:'1', type:'claim_approved',   title:'Claim Approved',   description:'CLM-2024-1042 approved for $12,500',         timestamp: new Date(Date.now()-300000).toISOString(),   iconColor:'emerald' },
  { id:'2', type:'fraud_alert',      title:'Fraud Alert',      description:'CLM-2024-1038 flagged as high risk',          timestamp: new Date(Date.now()-900000).toISOString(),   iconColor:'red'     },
  { id:'3', type:'claim_submitted',  title:'New Claim',        description:'CLM-2024-1051 submitted by Maria Garcia',     timestamp: new Date(Date.now()-1800000).toISOString(),  iconColor:'blue'    },
  { id:'4', type:'ai_analysis',      title:'AI Analysis Done', description:'15 claims reviewed by AI model',             timestamp: new Date(Date.now()-3600000).toISOString(),  iconColor:'purple'  },
  { id:'5', type:'claim_escalated',  title:'Claim Escalated',  description:'CLM-2024-1029 sent for further review',       timestamp: new Date(Date.now()-7200000).toISOString(),  iconColor:'amber'   },
];

export const getFraudAlerts = (): FraudAlert[] => [
  { id:'1', claimId:'claim_5',  claimNumber:'CLM-2024-1005', severity:'critical', type:'Duplicate Claim',      description:'Similar claims filed across multiple policies in a short period', indicators:['Same repair shop in 3 claims','Matching photo metadata','Claims 2 days apart'],    detectedAt: new Date(Date.now()-1800000).toISOString(),  status:'active'        },
  { id:'2', claimId:'claim_12', claimNumber:'CLM-2024-1012', severity:'high',     type:'High Repair Estimate', description:'Repair cost is well above average for the reported damage',         indicators:['Parts cost above market','Extra labor hours billed','Shop flagged previously'], detectedAt: new Date(Date.now()-7200000).toISOString(),  status:'investigating' },
  { id:'3', claimId:'claim_19', claimNumber:'CLM-2024-1019', severity:'medium',   type:'Timing Issue',         description:'Claim filed shortly after a coverage change',                       indicators:['Coverage changed 6 days before claim','No prior claims','Location unclear'],    detectedAt: new Date(Date.now()-18000000).toISOString(), status:'active'        },
];

export const getAuditLog = (): AuditLogEntry[] => [
  { id:'1', action:'approve',   entityType:'claim',  entityId:'claim_3',   userId:'user_2', userName:'Sarah Chen',    userRole:'manager', description:'Approved claim CLM-2024-1003 for $18,200',                   timestamp: new Date(Date.now()-600000).toISOString()    },
  { id:'2', action:'login',     entityType:'user',   entityId:'user_1',    userId:'user_1', userName:'Maruthi',        userRole:'admin',   description:'Administrator login from new device',                         timestamp: new Date(Date.now()-1200000).toISOString()   },
  { id:'3', action:'escalate',  entityType:'claim',  entityId:'claim_7',   userId:'user_3', userName:'Mike Ross',     userRole:'analyst', description:'Escalated CLM-2024-1007 — fraud indicators detected',         timestamp: new Date(Date.now()-3600000).toISOString()   },
  { id:'4', action:'reject',    entityType:'claim',  entityId:'claim_11',  userId:'user_2', userName:'Sarah Chen',    userRole:'manager', description:'Rejected CLM-2024-1011 — insufficient documentation',         timestamp: new Date(Date.now()-7200000).toISOString()   },
  { id:'5', action:'update',    entityType:'policy', entityId:'policy_4',  userId:'user_4', userName:'Emily Wang',    userRole:'analyst', description:'Updated risk tier for policy POL-2847',                       timestamp: new Date(Date.now()-14400000).toISOString()  },
  { id:'6', action:'create',    entityType:'user',   entityId:'user_6',    userId:'user_1', userName:'Maruthi',        userRole:'admin',   description:'Created new agent account for Priya Patel',                  timestamp: new Date(Date.now()-86400000).toISOString()  },
];

export const getClaimById     = (id: string)     => mockClaims.find(c => c.id === id);
export const getPolicyById    = (id: string)     => mockPolicies.find(p => p.id === id);
export const getUserById      = (id: string)     => mockUsers.find(u => u.id === id);

export const getClaimNotes = (claimId: string): ClaimNote[] => [
  { id:'note_1', claimId, authorId:'user_2', authorName:'Sarah Chen', authorRole:'manager', content:'Spoke with the claimant. Repair estimate looks consistent with the damage.', createdAt: new Date(Date.now()-3600000*5).toISOString()  },
  { id:'note_2', claimId, authorId:'user_3', authorName:'Mike Ross',  authorRole:'analyst', content:'Cross-referenced with police report. Incident date and location match.', createdAt: new Date(Date.now()-3600000*2).toISOString()  },
  { id:'note_3', claimId, authorId:'user_4', authorName:'Emily Wang', authorRole:'analyst', content:'Requested additional photos from the claimant. Awaiting response.', createdAt: new Date(Date.now()-1800000).toISOString()        },
];

export const getNotifications = (): AppNotification[] => [
  { id:'n1', type:'error',   title:'Fraud Alert',      message:'CLM-2024-1005 flagged as critical risk',     read:false, link:'/claims/claim_5', createdAt: new Date(Date.now()-300000).toISOString()   },
  { id:'n2', type:'success', title:'Claim Approved',   message:'CLM-2024-1042 approved for $12,500',         read:false, link:'/claims/claim_1', createdAt: new Date(Date.now()-900000).toISOString()   },
  { id:'n3', type:'warning', title:'Pending Review',   message:'8 claims awaiting review over 48 hours',     read:false, link:'/claims',         createdAt: new Date(Date.now()-3600000).toISOString()  },
  { id:'n4', type:'info',    title:'AI Analysis Done', message:'15 new claims analyzed by AI model',         read:true,  link:'/claims',         createdAt: new Date(Date.now()-7200000).toISOString()  },
  { id:'n5', type:'success', title:'New Team Member',  message:'Priya Patel has joined the team',            read:true,  link:'/users',          createdAt: new Date(Date.now()-86400000).toISOString() },
];

export const getPolicyRules = (): PolicyRule[] => [
  { id:'rule_1', name:'High Value Auto Flag',  description:'Flag auto claims above $25,000 for manual review',   threshold:25000, action:'flag',     isActive:true,  claimType:'auto_collision', createdAt:'2024-01-10T00:00:00Z' },
  { id:'rule_2', name:'Medical Escalation',    description:'Escalate medical claims above $50,000',               threshold:50000, action:'escalate', isActive:true,  claimType:'medical',        createdAt:'2024-01-15T00:00:00Z' },
  { id:'rule_3', name:'Fast-track Low Risk',   description:'Auto-approve claims with risk score below 20',        threshold:20,    action:'approve',  isActive:true,                              createdAt:'2024-02-01T00:00:00Z' },
  { id:'rule_4', name:'Repeat Claimant Block', description:'Reject if claimant has 3+ claims in 12 months',       threshold:3,     action:'reject',   isActive:false,                             createdAt:'2024-02-20T00:00:00Z' },
];
