const fetch = require('node-fetch');

async function testCoursesApi() {
  try {
    console.log('Testing /api/courses endpoint...');
    
    const response = await fetch('http://localhost:3000/api/courses', {
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
        console.log('Số lượng khóa học trả về:', json.length);
        
        if (json.length > 0) {
          console.log('\nDanh sách 3 khóa học đầu tiên:');
          json.slice(0, 3).forEach((course, index) => {
            console.log(`\n${index + 1}. ${course.title || 'Không có tiêu đề'}`);
            console.log(`   ID: ${course.id}`);
            console.log(`   Grade: ${course.grade || 'N/A'}, Subject: ${course.subject || 'N/A'}`);
            console.log(`   Price: ${course.price || 0}`);
          });
        }
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

testCoursesApi(); 