import 'dotenv/config'
import { founderReportStep } from './founder-report-step'

async function main() {
  const result = await founderReportStep.execute({
    inputData: {
      allData: {
        idea: 'UPI fraud detection for small merchants',
        score: 87,
        recommendation: 'Proceed — Investor Track',
      },
    },
  } as any)
  if ('reportMarkdown' in result) {
    console.log(result.reportMarkdown)
  } else {
    console.log(result)
  }
}

main()