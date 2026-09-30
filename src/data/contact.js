export const contact = {
  name: 'Shakti Dangol',
  role: 'Junior Software QA Engineer',
  location: 'Kathmandu, Nepal',
  phone: '+977-9749717321',
  email: 'shakti.try99@gmail.com',
  linkedin: 'https://www.linkedin.com/in/shakti-dangol-3254083aa/',
  github: 'https://github.com/ShaktiDangol13',
  cv: '/Shakti-Dangol-CV.pdf',
  timezone: 'Asia/Kathmandu',
};

export const contactActions = [
  { label: 'EMAIL ME', href: `mailto:${contact.email}`, external: false, key: 'email' },
  { label: 'LINKEDIN', href: contact.linkedin, external: true, key: 'linkedin' },
  { label: 'GITHUB', href: contact.github, external: true, key: 'github' },
  { label: 'DOWNLOAD CV', href: contact.cv, external: false, download: true, key: 'cv' },
];
