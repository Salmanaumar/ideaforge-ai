import 'dotenv/config'
import { safetyCheckStep } from './safety-check-step'

async function main() {
  const result = await safetyCheckStep.execute({
    inputData: {
      reportText: 'This startup validation report shows strong demand for real-time fraud detection among small UPI merchants.',
    },
  } as any)
  console.log('Result:', JSON.stringify(result, null, 2))
}

main()