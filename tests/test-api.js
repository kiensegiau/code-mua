const fetch = require('node-fetch');

async function testApi(endpoint) {
  console.log(`\nTesting endpoint: ${endpoint}`);
  console.log(`Fetching: http://localhost:3000/api/${endpoint}`);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
    
    const response = await fetch(`http://localhost:3000/api/${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    const status = response.status;
    console.log(`Status code: ${status}`);
    
    try {
      const text = await response.text();
      console.log(`Response text length: ${text.length} characters`);
      
      if (text) {
        try {
          const data = JSON.parse(text);
          console.log('Response (parsed JSON):');
          console.log(JSON.stringify(data, null, 2));
        } catch (jsonError) {
          console.log('Response (raw text, not valid JSON):');
          console.log(text.substring(0, 500) + (text.length > 500 ? '...' : ''));
        }
      } else {
        console.log('Empty response body');
      }
    } catch (textError) {
      console.error('Error reading response text:', textError);
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out after 10 seconds');
    } else {
      console.error(`Error testing ${endpoint}:`, error);
    }
  } finally {
    console.log('-'.repeat(50));
  }
}

async function runTests() {
  try {
    console.log('Starting API tests...');
    await testApi('courses');
    await testApi('courses/642a1c835d88ac2730841234'); // ID không tồn tại
    await testApi('user/profile');
    console.log('API tests completed.');
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

runTests(); 