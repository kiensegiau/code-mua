const fetch = require('node-fetch');

async function testApi() {
  try {
    console.log('Testing /api/testdb endpoint...');
    
    const response = await fetch('http://localhost:3000/api/testdb', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const text = await response.text();
    console.log('Response text length:', text.length);
    
    if (text.length > 0) {
      try {
        const json = JSON.parse(text);
        console.log('Response data:', JSON.stringify(json, null, 2));
      } catch (e) {
        console.log('Response is not valid JSON:', text);
      }
    } else {
      console.log('Empty response');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testApi(); 