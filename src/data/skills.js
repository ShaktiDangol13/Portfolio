export const skillGroups = [
  {
    id: 'testing',
    label: 'TESTING',
    items: [
      { name: 'MANUAL TESTING', index: '01', related: ['Exploratory sessions', 'Scripted execution', 'Build verification'] },
      { name: 'FUNCTIONAL TESTING', index: '02', related: ['Requirements', 'Business rules', 'Expected behaviour'] },
      { name: 'REGRESSION TESTING', index: '03', related: ['Affected flows', 'Retest cycles', 'Release stability'] },
      { name: 'SMOKE & SANITY', index: '04', related: ['Build checks', 'Core path validation', 'Go / no-go'] },
      { name: 'UI TESTING', index: '05', related: ['Layout', 'States', 'Responsive behaviour'] },
      { name: 'CROSS-BROWSER', index: '06', related: ['Chrome', 'Firefox', 'Safari'] },
      { name: 'POSITIVE / NEGATIVE', index: '07', related: ['Valid input', 'Invalid input', 'Error paths'] },
    ],
  },
  {
    id: 'design',
    label: 'TEST DESIGN',
    items: [
      { name: 'TEST SCENARIOS', index: '08', related: ['Coverage', 'Happy path', 'Unhappy path'] },
      { name: 'TEST CASES', index: '09', related: ['Steps', 'Expected result', 'Preconditions'] },
      { name: 'REQUIREMENT ANALYSIS', index: '10', related: ['Ambiguity', 'Edge cases', 'Acceptance criteria'] },
      { name: 'BOUNDARY VALUE ANALYSIS', index: '11', related: ['Min / max', 'Off-by-one', 'Limits'] },
      { name: 'EQUIVALENCE PARTITIONING', index: '12', related: ['Input classes', 'Representative data'] },
      { name: 'DECISION TABLES', index: '13', related: ['Conditions', 'Rules', 'Combinations'] },
    ],
  },
  {
    id: 'api-db',
    label: 'API & DATABASE',
    items: [
      { name: 'POSTMAN', index: '14', related: ['REST APIs', 'Headers', 'Status codes', 'Payload validation', 'Authorization'] },
      { name: 'REST API TESTING', index: '15', related: ['Request / response', 'Status codes', 'Error bodies', 'Auth'] },
      { name: 'HTTP STATUS CODES', index: '16', related: ['2xx success', '4xx client', '5xx server'] },
      { name: 'AUTHORIZATION', index: '17', related: ['JWT', 'OAuth', 'Roles', 'Access boundaries'] },
      { name: 'SQL', index: '18', related: ['SELECT', 'JOIN', 'WHERE', 'CRUD verification', 'Data validation'] },
      { name: 'DATA VALIDATION', index: '19', related: ['Key constraints', 'NOT NULL', 'Records after CRUD'] },
    ],
  },
  {
    id: 'defects',
    label: 'DEFECT & DEBUGGING',
    items: [
      { name: 'BUG REPORTING', index: '20', related: ['Steps', 'Expected vs actual', 'Severity', 'Priority', 'Evidence'] },
      { name: 'DEFECT LIFECYCLE', index: '21', related: ['Open', 'Reopen', 'Verify', 'Close'] },
      { name: 'JIRA', index: '22', related: ['Tickets', 'Tracking', 'Status flow'] },
      { name: 'CHROME DEVTOOLS', index: '23', related: ['Network', 'Console', 'Elements', 'Storage'] },
      { name: 'HAR FILES', index: '24', related: ['Request evidence', 'Timing', 'Payloads'] },
      { name: 'ROOT CAUSE ANALYSIS', index: '25', related: ['Layer isolation', 'Logs', 'Reproduction'] },
    ],
  },
  {
    id: 'process',
    label: 'PROCESS',
    items: [
      { name: 'SDLC', index: '26', related: ['Requirements', 'Design', 'Build', 'Release'] },
      { name: 'STLC', index: '27', related: ['Planning', 'Design', 'Execution', 'Closure'] },
      { name: 'AGILE / SCRUM', index: '28', related: ['Sprints', 'Standups', 'Incremental testing'] },
      { name: 'TEST PLANNING', index: '29', related: ['Scope', 'Risks', 'Priority'] },
      { name: 'RISK-BASED TESTING', index: '30', related: ['Impact', 'Likelihood', 'Focus areas'] },
    ],
  },
  {
    id: 'development',
    label: 'DEVELOPMENT',
    items: [
      { name: 'HTML / CSS', index: '31', related: ['Semantics', 'Layout', 'Responsive rules'] },
      { name: 'JAVASCRIPT', index: '32', related: ['DOM', 'Events', 'Async behaviour'] },
      { name: 'REACT.JS', index: '33', related: ['Components', 'State', 'Renders'] },
      { name: 'TAILWIND CSS', index: '34', related: ['Utility classes', 'Design systems'] },
      { name: 'PHP / LARAVEL', index: '35', related: ['Routes', 'Controllers', 'Eloquent'] },
      { name: 'GIT / GITHUB', index: '36', related: ['Branches', 'Commits', 'Reviews'] },
    ],
  },
];

export const skillsList = skillGroups.flatMap((group) => group.items);
