// New access code generation function
function generateAccessCode(fileKey) {
  // Generate unique hash-based access code for each file
  let hash = 0;
  for (let i = 0; i < fileKey.length; i++) {
    const char = fileKey.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to base36 and take first 5 characters
  const code = Math.abs(hash).toString(36).toUpperCase().substring(0, 5);
  return 'MN' + code.padEnd(5, '0');
}

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║         MINIMAL NOTES - COMPLETE ACCESS CODE LIST           ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

console.log('MATHS - ALL CHAPTERS (1-13)');
console.log('═══════════════════════════════════════════════════════════════\n');

for (let i = 1; i <= 13; i++) {
  const notes = `Maths_${i}`;
  const qb = `Maths_${i}_QB`;
  const ow = `Maths_${i}_OW`;
  
  console.log(`Chapter ${i}:`);
  console.log(`  📝 Notes:         ${notes.padEnd(20)} → ${generateAccessCode(notes)}`);
  console.log(`  ❓ Question Bank: ${qb.padEnd(20)} → ${generateAccessCode(qb)}`);
  console.log(`  📖 One Word:      ${ow.padEnd(20)} → ${generateAccessCode(ow)}`);
  console.log('');
}

console.log('\nPHYSICS - ALL CHAPTERS (1-7)');
console.log('═══════════════════════════════════════════════════════════════\n');

for (let i = 1; i <= 7; i++) {
  const notes = `Physics_${i}`;
  const qb = `Physics_${i}_QB`;
  const ow = `Physics_${i}_OW`;
  
  console.log(`Chapter ${i}:`);
  console.log(`  📝 Notes:         ${notes.padEnd(20)} → ${generateAccessCode(notes)}`);
  console.log(`  ❓ Question Bank: ${qb.padEnd(20)} → ${generateAccessCode(qb)}`);
  console.log(`  📖 One Word:      ${ow.padEnd(20)} → ${generateAccessCode(ow)}`);
  console.log('');
}

console.log('\nCHEMISTRY - ALL CHAPTERS (1-7)');
console.log('═══════════════════════════════════════════════════════════════\n');

for (let i = 1; i <= 7; i++) {
  const notes = `Chemistry_${i}`;
  const qb = `Chemistry_${i}_QB`;
  const ow = `Chemistry_${i}_OW`;
  
  console.log(`Chapter ${i}:`);
  console.log(`  📝 Notes:         ${notes.padEnd(20)} → ${generateAccessCode(notes)}`);
  console.log(`  ❓ Question Bank: ${qb.padEnd(20)} → ${generateAccessCode(qb)}`);
  console.log(`  📖 One Word:      ${ow.padEnd(20)} → ${generateAccessCode(ow)}`);
  console.log('');
}

console.log('\nBIOLOGY - ALL CHAPTERS (1-6)');
console.log('═══════════════════════════════════════════════════════════════\n');

for (let i = 1; i <= 6; i++) {
  const notes = `Biology_${i}`;
  const qb = `Biology_${i}_QB`;
  const ow = `Biology_${i}_OW`;
  
  console.log(`Chapter ${i}:`);
  console.log(`  📝 Notes:         ${notes.padEnd(20)} → ${generateAccessCode(notes)}`);
  console.log(`  ❓ Question Bank: ${qb.padEnd(20)} → ${generateAccessCode(qb)}`);
  console.log(`  📖 One Word:      ${ow.padEnd(20)} → ${generateAccessCode(ow)}`);
  console.log('');
}

console.log('\nGEOGRAPHY - ALL CHAPTERS (1-8)');
console.log('═══════════════════════════════════════════════════════════════\n');

for (let i = 1; i <= 8; i++) {
  const notes = `Geography_${i}`;
  const qb = `Geography_${i}_QB`;
  const ow = `Geography_${i}_OW`;
  
  console.log(`Chapter ${i}:`);
  console.log(`  📝 Notes:         ${notes.padEnd(20)} → ${generateAccessCode(notes)}`);
  console.log(`  ❓ Question Bank: ${qb.padEnd(20)} → ${generateAccessCode(qb)}`);
  console.log(`  📖 One Word:      ${ow.padEnd(20)} → ${generateAccessCode(ow)}`);
  console.log('');
}

console.log('\nHISTORY - ALL CHAPTERS (1-9)');
console.log('═══════════════════════════════════════════════════════════════\n');

for (let i = 1; i <= 9; i++) {
  const notes = `History_${i}`;
  const qb = `History_${i}_QB`;
  const ow = `History_${i}_OW`;
  
  console.log(`Chapter ${i}:`);
  console.log(`  📝 Notes:         ${notes.padEnd(20)} → ${generateAccessCode(notes)}`);
  console.log(`  ❓ Question Bank: ${qb.padEnd(20)} → ${generateAccessCode(qb)}`);
  console.log(`  📖 One Word:      ${ow.padEnd(20)} → ${generateAccessCode(ow)}`);
  console.log('');
}

console.log('\nSOCIAL SCIENCE 2 - ALL CHAPTERS (1-8)');
console.log('═══════════════════════════════════════════════════════════════\n');

for (let i = 1; i <= 8; i++) {
  const notes = `SocialScience2_${i}`;
  const qb = `SocialScience2_${i}_QB`;
  const ow = `SocialScience2_${i}_OW`;
  
  console.log(`Chapter ${i}:`);
  console.log(`  📝 Notes:         ${notes.padEnd(20)} → ${generateAccessCode(notes)}`);
  console.log(`  ❓ Question Bank: ${qb.padEnd(20)} → ${generateAccessCode(qb)}`);
  console.log(`  📖 One Word:      ${ow.padEnd(20)} → ${generateAccessCode(ow)}`);
  console.log('');
}

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('FREE RESOURCES (No Access Code Required)');
console.log('═══════════════════════════════════════════════════════════════\n');
console.log('✨ Maths_6_QB      - FREE');
console.log('✨ Maths_7_QB      - FREE');
console.log('✨ Physics_5_QB    - FREE');
console.log('✨ History_4_QB    - FREE');
console.log('\n═══════════════════════════════════════════════════════════════\n');
