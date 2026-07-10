import 'dotenv/config'
import { mvpPlannerStep } from './mvp-planner-step'

async function main() {
  const result = await mvpPlannerStep.execute({
    inputData: {
      rawIdea: 'A UPI fraud-detection layer for small merchants that flags suspicious transactions in real time',
      goToMarketPlan: 'Strategic partnerships with leading payment aggregators and small merchant associations',
    },
  } as any)
  console.log('Result:', JSON.stringify(result, null, 2))
}

main()