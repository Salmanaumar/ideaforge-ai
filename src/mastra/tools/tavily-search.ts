import axios from 'axios'

export async function searchWeb(query: string): Promise<string> {
  try {
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: process.env.TAVILY_API_KEY,
      query,
      max_results: 3,
      search_depth: 'basic',
    })

    const results = response.data.results || []
    return results
      .map((r: any) => `${r.title}: ${r.content}`)
      .join('\n\n')
  } catch (error: any) {
    console.error('Tavily search failed:', error.message)
    return '' // fail gracefully — agent falls back to LLM knowledge
  }
}