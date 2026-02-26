import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function testAPI() {
  const url = 'http://localhost:3000/api/admin/courses'
  
  console.log('🧪 Testing API:', url)
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    
    console.log('Status:', response.status)
    console.log('Data:', JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testAPI()
