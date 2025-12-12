// Access code generation function (same as in script.js)
function generateAccessCode(fileKey) {
  const encoded = Buffer.from(fileKey).toString('base64');
  const code = 'MN' + encoded.substring(0, 5).replace(/=/g, '');
  return code;
}

// Generate access codes for all Maths chapters
console.log('MATHS ACCESS CODES');
console.log('==================\n');

for (let i = 1; i <= 13; i++) {
  console.log(`Chapter ${i}:`);
  console.log(`  Notes (Maths_${i}):        ${generateAccessCode(`Maths_${i}`)}`);
  console.log(`  Question Bank (Maths_${i}_QB): ${generateAccessCode(`Maths_${i}_QB`)}`);
  console.log(`  One Word (Maths_${i}_OW):      ${generateAccessCode(`Maths_${i}_OW`)}`);
  console.log('');
}

// Generate for other subjects as reference
console.log('\nOTHER SUBJECTS (Sample)');
console.log('=======================\n');

const subjects = ['Physics', 'Chemistry', 'Biology', 'Geography', 'History'];
subjects.forEach(subject => {
  console.log(`${subject}_1:        ${generateAccessCode(`${subject}_1`)}`);
  console.log(`${subject}_1_QB:     ${generateAccessCode(`${subject}_1_QB`)}`);
  console.log(`${subject}_1_OW:     ${generateAccessCode(`${subject}_1_OW`)}`);
  console.log('');
});
