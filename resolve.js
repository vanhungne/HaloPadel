const fs = require('fs');
const path = require('path');

const files = [
  'src/app/(public)/page.js',
  'src/components/public/AmenitiesSection.jsx',
  'src/components/public/AnnouncementsSection.jsx',
  'src/components/public/FloatingCTA.jsx',
  'src/components/public/PricingSection.jsx',
  'src/components/public/PromotionsSection.jsx'
];

files.forEach(file => {
  const p = path.join(__dirname, file);
  if (!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, 'utf8');
  
  while (content.includes('<<<<<<<')) {
    const start = content.indexOf('<<<<<<<');
    const mid = content.indexOf('=======', start);
    const end = content.indexOf('>>>>>>>', mid);
    let endLine = content.indexOf('\n', end);
    if (endLine === -1) endLine = content.length;
    
    const stashedPart = content.substring(mid + 8, end);
    content = content.substring(0, start) + stashedPart + content.substring(endLine + 1);
  }
  
  fs.writeFileSync(p, content, 'utf8');
  console.log('Resolved', file);
});
