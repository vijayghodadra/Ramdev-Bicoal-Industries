import sharp from 'sharp';

async function trim() {
  try {
    await sharp('src/assets/logo.png')
      .trim()
      .toFile('public/favicon.png');
    console.log('Successfully trimmed logo and saved as favicon.png');
  } catch (err) {
    console.error(err);
  }
}
trim();
