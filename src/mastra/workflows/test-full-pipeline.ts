import 'dotenv/config'
import { mastra } from '../index'

async function main() {
  const workflow = mastra.getWorkflow('ideaValidationWorkflow')
  const run = await workflow.createRun()

  const result = await run.start({
    inputData: {
      rawIdea: "an app that matches dog walkers with elderly pet owners in a neighborhood"
    }
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