const { searchConstructionCompanies } = require('./Script/search');
const { detectCompanies } = require('./Script/detect');
const { saveToXML } = require('./Script/save');

async function main() {
  console.log('🚀 Starting scraper... (this may take 10-20 seconds)');

  try {
    const raw = await searchConstructionCompanies();
    const detected = detectCompanies(raw);
    await saveToXML(detected);

    console.log('🎉 Done! Check the "result" folder for your XML file.');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();