import React from 'react';
import { Bot, Users, Calendar, Search, Zap, BarChart4 } from 'lucide-react';

export const ARIA_FEATURES = [
  {
    icon: <Bot className="w-7 h-7 text-cyan-400" />,
    title: 'ARIA AI Assistant',
    description: 'Ask anything about your workforce. Get instant insights powered by built-in AI — no third-party tools needed.',
  },
  {
    icon: <Users className="w-7 h-7 text-violet-400" />,
    title: 'Employee Management',
    description: 'Full lifecycle management from onboarding to offboarding — contracts, profiles, documents, and role history in one place.',
  },
  {
    icon: <Calendar className="w-7 h-7 text-cyan-400" />,
    title: 'Leave Management',
    description: 'Automated leave tracking, team-aware approvals, and real-time balance management with zero manual overhead.',
  },
  {
    icon: <Search className="w-7 h-7 text-violet-400" />,
    title: 'Recruitment Pipeline',
    description: 'Kanban-style hiring board to track every candidate through every stage — from sourcing to offer letter.',
  },
  {
    icon: <Zap className="w-7 h-7 text-cyan-400" />,
    title: 'Payroll Automation',
    description: 'Accurate, automated payroll processing at scale — configured to your pay schedules, deductions, and compliance rules.',
  },
  {
    icon: <BarChart4 className="w-7 h-7 text-violet-400" />,
    title: 'Reports & Analytics',
    description: 'Real-time workforce insights and performance dashboards — headcount trends, attrition, leave utilisation, and more.',
  },
];
