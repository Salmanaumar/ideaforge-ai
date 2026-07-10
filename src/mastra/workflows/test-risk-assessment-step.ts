import 'dotenv/config'
import { riskAssessmentStep } from './risk-assessment-step'

async function main() {
  const result = await riskAssessmentStep.execute({
    inputData: {
      rawIdea: 'A UPI fraud-detection layer for small merchants that flags suspicious transactions in real time',
      marketGaps: 'No affordable, real-time fraud detection tool specifically built for small UPI merchants',
    },
  } as any)
  console.log('Result:', JSON.stringify(result, null, 2))
}

main()