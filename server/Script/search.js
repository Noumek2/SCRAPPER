const axios = require('axios');

async function fetchDetails(url) {
  try {
    const { data } = await axios.get(url, {
      timeout: 5000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
    });
    
    // Regex extraction for email and phone
    const email = (data.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/) || [])[0] || 'N/A';
    const telephone = (data.match(/(?:\+237|00237)?[\s.-]?[236]\d{2}[-.\s]?\d{2}[-.\s]?\d{2}[-.\s]?\d{2}/) || [])[0] || 'N/A';
    
    // Simple location heuristic
    let location = 'Cameroun';
    if (data.includes('Douala')) location = 'Douala';
    else if (data.includes('Yaoundé')) location = 'Yaoundé';

    return { email, telephone, location };
  } catch (e) {
    return { email: 'N/A', telephone: 'N/A', location: 'Cameroun' };
  }
}

async function searchConstructionCompanies() {
  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        q: 'entreprises de construction au Cameroun OR BTP Cameroun',
        gl: 'cm', // Cameroon
        hl: 'fr', // French
        api_key: process.env.SERPAPI_KEY || 'a884087a810fdeaf3724db0c97d1b7adb78701cc8d43704996f59a7c590f40fe' // fallback for testing
      }
    });

    const rawResults = response.data.organic_results || [];
    const results = await Promise.all(rawResults.slice(0, 10).map(async (result) => {
      const details = await fetchDetails(result.link);
      return {
        name: result.title,
        link: result.link,
        description: result.snippet || '',
        email: details.email,
        telephone: details.telephone,
        location: details.location,
        size: 'N/A'
      };
    }));

    return results;
  } catch (error) {
    console.error('Error searching:', error);
    throw error;
  }
}

module.exports = { searchConstructionCompanies };