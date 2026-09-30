/* Demo artifacts — clearly labelled in the UI as portfolio demonstrations. */

export const bugReport = {
  badge: 'SAMPLE QA ARTIFACT',
  id: 'BUG-024',
  title: 'Login form accepts invalid email format.',
  environment: 'Chrome / Desktop',
  severity: 'Medium',
  priority: 'High',
  steps: [
    'Open Login page',
    'Enter "abc" as email',
    'Enter a valid password',
    'Click Login',
  ],
  expected: 'Email validation error should appear.',
  actual: 'Request is sent to the API.',
  request: ['POST /api/v1/auth/login', 'status: 400 Bad Request'],
  response: ['{ "message": "Invalid credentials" }'],
  evidence: ['HAR capture', 'Console log', 'Screenshot of request payload'],
};

export const testCase = {
  badge: 'DEMO TEST CASE',
  id: 'TC-LOGIN-001',
  feature: 'Authentication',
  precondition: 'Active user account exists.',
  variants: [
    {
      key: 'valid',
      label: 'VALID LOGIN',
      scenario: 'Valid login',
      steps: ['Navigate to login', 'Enter valid email', 'Enter valid password', 'Submit'],
      expected: 'User is authenticated and redirected to dashboard.',
      status: 'PASS',
    },
    {
      key: 'invalid',
      label: 'INVALID PASSWORD',
      scenario: 'Invalid password',
      steps: ['Navigate to login', 'Enter valid email', 'Enter incorrect password', 'Submit'],
      expected: 'Error message appears.',
      status: 'PASS',
    },
  ],
};

export const apiDemo = {
  badge: 'DEMO API REQUEST',
  request: ['POST /api/v1/auth/login'],
  headers: ['Content-Type: application/json', 'Authorization: Bearer ********'],
  body: ['{', '  "email": "qa@example.com",', '  "password": "********"', '}'],
  success: [
    'HTTP/1.1 200 OK',
    '{',
    '  "success": true,',
    '  "token": "••••••••"',
    '}',
  ],
  failure: ['HTTP/1.1 401 Unauthorized', '{', '  "message": "Invalid credentials"', '}'],
  checks: [
    'Validate status codes.',
    'Inspect headers.',
    'Verify payloads.',
    'Check authorization.',
    'Compare expected and actual API behavior.',
  ],
};

export const dbDemo = {
  badge: 'DEMO DATABASE CHECK',
  query: [
    'SELECT',
    '    id,',
    '    email,',
    '    role,',
    '    status',
    'FROM users',
    "WHERE email = 'qa@example.com';",
  ],
  columns: ['ID', 'EMAIL', 'ROLE', 'STATUS'],
  rows: [['104', 'qa@example.com', 'admin', 'active']],
  checks: [
    'SELECT',
    'JOIN',
    'WHERE',
    'CRUD validation',
    'Data validation',
    'Key constraints',
    'NOT NULL constraints',
  ],
  statement:
    'After a UI action, I validate the resulting data to confirm CRUD behavior and database integrity.',
};
