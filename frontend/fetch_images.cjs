const https = require('https');
https.get('https://unsplash.com/s/photos/black-doctor', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const matches = data.match(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+/g);
    const unique = [...new Set(matches)].slice(0, 15);
    console.log(unique.join('\n'));
  });
});
