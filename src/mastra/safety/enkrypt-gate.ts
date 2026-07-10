import axios from 'axios'

export async function checkSafety(text: string) {
  try {
    const response = await axios.post(
      process.env.ENKRYPT_API_URL!,
      { text },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Enkrypt-Policy': process.env.ENKRYPT_POLICY_NAME!,
          apikey: process.env.ENKRYPT_API_KEY!,
        },
      }
    )
    return {
      passed: true,
      raw: response.data,
    }
  } catch (error: any) {
    console.error('Enkrypt AI check failed:', error?.response?.data || error.message)
    return {
      passed: false,
      raw: error?.response?.data || null,
    }
  }
}