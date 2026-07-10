import 'dotenv/config'
import { businessStrategyStep } from './business-strategy-step'

async function main() {
  const result = await businessStrategyStep.execute({
    inputData: {
      rawIdea: 'A UPI fraud-detection layer for small merchants that flags suspicious transactions in real time',
      marketGaps: 'No affordable, real-time fraud detection tool specifically built for small UPI merchants',
      growthOpportunity: 'Expanding into emerging markets and serving underserved SMEs',
    },
  } as any)
  console.log('Result:', JSON.stringify(result, null, 2))
}

main()