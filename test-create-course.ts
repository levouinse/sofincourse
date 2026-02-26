import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function testCreateCourse() {
  // Simulate creating a course
  const testCourse = {
    slug: 'test-course-' + Date.now(),
    title: 'Test Course',
    description: 'This is a test course',
    category: 'coding',
    thumbnail_url: '',
    order_index: 99,
    published: false
  }
  
  console.log('🧪 Testing course creation...')
  console.log('Payload:', testCourse)
  
  try {
    const response = await fetch('http://localhost:3000/api/admin/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify(testCourse)
    })
    
    console.log('Status:', response.status)
    const data = await response.json()
    console.log('Response:', JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testCreateCourse()
