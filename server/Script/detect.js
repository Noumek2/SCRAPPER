function detectCompanies(rawResults) {
  const detected = [];

  rawResults.forEach((item) => {
    // Phone regex for Cameroon (+237 or local 6xx xxx xxx)
    const phoneRegex = /\+?237[ -]?[6-9]\d{2}[ -]?\d{3}[ -]?\d{3}|\b[6-9]\d{2}[ -]?\d{3}[ -]?\d{3}\b/;
    const phoneMatch = item.description.match(phoneRegex);
    
    // Location is hard from Google, so we take first city mentioned or default Cameroon
    const cameroonCities = ['Yaoundé', 'Douala', 'Bafoussam', 'Garoua', 'Maroua', 'Bamenda', 'Buea'];
    let location = 'Cameroun';
    for (const city of cameroonCities) {
      if (item.description.includes(city) || item.name.includes(city)) {
        location = city;
        break;
      }
    }

    detected.push({
      name: item.name,
      telephone: phoneMatch ? phoneMatch[0] : 'N/A',
      location: location,
      website: item.link,
      description: item.description.substring(0, 150) + '...',
      source: 'Google Search'
    });
  });

  return detected;
}

module.exports = { detectCompanies };