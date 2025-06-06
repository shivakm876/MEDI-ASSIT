import { spawn } from 'child_process'
import path from 'path'

let cachedModel: any = null

export async function loadModel() {
  if (cachedModel) {
    return cachedModel
  }

  return new Promise((resolve, reject) => {
    const pythonScript = path.join(process.cwd(), 'scripts', 'predict.py')
    const pythonProcess = spawn('python', [pythonScript, '--load-only'])

    let output = ''
    let error = ''

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString()
    })

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString()
    })

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${error}`))
        return
      }

      try {
        const model = JSON.parse(output)
        cachedModel = model
        resolve(model)
      } catch (err) {
        reject(new Error('Failed to parse model output'))
      }
    })
  })
}

export async function predict(symptoms: string[]) {
  if (!cachedModel) {
    await loadModel()
  }

  return new Promise((resolve, reject) => {
    const pythonScript = path.join(process.cwd(), 'scripts', 'predict.py')
    const pythonProcess = spawn('python', [pythonScript, '--predict', JSON.stringify(symptoms)])

    let output = ''
    let error = ''

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString()
    })

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString()
    })

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${error}`))
        return
      }

      try {
        const result = JSON.parse(output)
        resolve(result)
      } catch (err) {
        reject(new Error('Failed to parse prediction output'))
      }
    })
  })
} 