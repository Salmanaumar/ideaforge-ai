import 'dotenv/config'
import { mastra } from '../index'

async function main() {
  const workflow = mastra.getWorkflow('ideaValidationWorkflow')
  const run = await workflow.createRun()

  const result = await run.start({
    inputData: {
      rawIdea: 'A UPI fraud-detection layer for small merchants that flags suspicious transactions in real time',
    },
  })

  console.log('STATUS:', result.status)
  if (result.status === 'success') {
    console.log('FULL REPORT:\n', result.result.reportMarkdown)
    console.log('\nSAFETY PASSED:', result.result.safetyPassed)
  } else if (result.status === 'failed') {
    console.log('ERROR:', result.error)
  }
}

main()