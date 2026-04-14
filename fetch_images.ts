import https from 'https';

https.get('https://www.marvelrivals.com/heroes/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const matches = data.match(/https:\/\/[^"']+\.(png|jpg|jpeg|webp)/g);
    if (matches) {
      console.log([...new Set(matches)].slice(0, 20).join('\n'));
    }
  });
});
