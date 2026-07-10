import 'dotenv/config'
import { competitorIntelStep } from './competitor-intel-step'

async function main() {
  const result = await competitorIntelStep.execute({
    inputData: {
      industry: 'FinTech / Fraud Prevention',
      problemCategory: 'Real-time transaction fraud detection',
    },
  } as any)
  console.log('Result:', JSON.stringify(result, null, 2))
}

main()