export const toolbox = [
  { name: 'POSTMAN', usage: 'API validation', detail: 'Requests, headers, payloads and response checks.' },
  { name: 'JIRA', usage: 'Defect management', detail: 'Tickets, severity, priority and status flow.' },
  { name: 'CHROME DEVTOOLS', usage: 'Network + debugging', detail: 'Requests, console output, storage and logs.' },
  { name: 'SQL', usage: 'Data validation', detail: 'SELECT, JOIN, WHERE and CRUD verification.' },
  { name: 'GITHUB', usage: 'Version control', detail: 'Branches, commits and review history.' },
  { name: 'HAR FILES', usage: 'Network evidence', detail: 'Captured traffic attached to defect reports.' },
];

export const debuggingLayers = [
  { id: 'ui', label: 'UI', example: 'Broken layout, missing state or wrong feedback after an action.' },
  { id: 'browser', label: 'BROWSER', example: 'Console errors, cache or rendering differences between browsers.' },
  { id: 'network', label: 'NETWORK', example: '4xx client-side problem — wrong payload, headers or endpoint.' },
  { id: 'api', label: 'API', example: '5xx server-side problem or an incorrect response body.' },
  { id: 'backend', label: 'BACKEND', example: 'Logic, authentication or authorization behaving incorrectly.' },
  { id: 'database', label: 'DATABASE', example: 'Database mismatch — record missing, duplicated or wrongly typed.' },
];

export const matrixColumns = ['UI', 'API', 'DATABASE'];
export const matrixRows = [
  'VALID INPUT',
  'INVALID INPUT',
  'BOUNDARY',
  'AUTHORIZATION',
  'ERROR HANDLING',
  'DATA VALIDATION',
];

/* Decorative demo content — not real project results. */
export const matrixDemoValues = [
  ['PASS', 'PASS', 'PASS'],
  ['PASS', 'FAIL', 'CHECKING'],
  ['CHECKING', 'PASS', 'PASS'],
  ['PASS', 'FAIL', 'PASS'],
  ['FAIL', 'PASS', 'CHECKING'],
  ['PASS', 'CHECKING', 'PASS'],
];
