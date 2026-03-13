const { create } = require('xmlbuilder2');
const fs = require('fs');
const path = require('path');

async function saveToXML(companies) {
  const folder = path.join(__dirname, 'result');
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  // Timestamp so every launch creates new file
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const filePath = path.join(folder, `construction_companies_${timestamp}.xml`);

  const root = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('companies', { count: companies.length, generated: new Date().toISOString() });

  companies.forEach((company, index) => {
    const comp = root.ele('company', { id: index + 1 });
    comp.ele('name').txt(company.name);
    comp.ele('telephone').txt(company.telephone);
    comp.ele('location').txt(company.location);
    comp.ele('website').txt(company.website);
    comp.ele('description').txt(company.description);
    comp.ele('source').txt(company.source);
  });

  const xml = root.end({ prettyPrint: true });

  fs.writeFileSync(filePath, xml);
  console.log(`✅ Saved ${companies.length} companies to: ${filePath}`);
  
  return filePath;
}

module.exports = { saveToXML };