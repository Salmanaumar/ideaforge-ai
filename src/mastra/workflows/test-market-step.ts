import 'dotenv/config'
import { marketResearchStep } from './market-research-step'

async function main() {
  const result = await marketResearchStep.execute({
    inputData: {
      industry: 'FinTech / Fraud Prevention',
      problemCategory: 'Real-time transaction fraud detection',
    },
  } as any)
  console.log('Result:', JSON.stringify(result, null, 2))
}

main()