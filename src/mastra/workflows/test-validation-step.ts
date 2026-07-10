import 'dotenv/config'
import { validationStep } from './validation-step'

async function main() {
  const result = await validationStep.execute({
    inputData: {
      ideaBrief: {
        industry: 'FinTech / Fraud Prevention',
        targetUsers: 'Small merchants using UPI payments',
        problemCategory: 'Real-time transaction fraud detection',
        rawIdea: 'A UPI fraud-detection layer for small merchants that flags suspicious transactions in real time',
      },
      marketResearch: {
        demandSignals: 'High demand from financial institutions and merchants due to increasing online transactions and rising fraud rates',
        industryTrends: 'Advancements in machine learning and AI driving development of more accurate fraud detection systems',
        growthOpportunity: 'Expanding into emerging markets and serving underserved SMEs',
      },
      competitorIntel: {
        competitors: [
          { name: 'Razorpay Thirdwatch', strength: 'Strong enterprise banking relationships', weakness: 'Expensive, not built for small merchants' },
          { name: 'Signzy', strength: 'Established KYC/fraud tooling', weakness: 'Focused on onboarding, not real-time monitoring' },
        ],
        marketGaps: 'No affordable, real-time fraud detection tool specifically built for small UPI merchants',
      },
    },
  } as any)
  console.log('Result:', JSON.stringify(result, null, 2))
}

main()