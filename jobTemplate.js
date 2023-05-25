import { MSG_DONE, MSG_ERR, MSG } from './constants.js'
import { parentPort, workerData } from 'worker_threads'
const { id, job, jobPath } = workerData

import(`${jobPath}.js`).then(module => {
    const jobFunction = module.default
    const onError = (msg) => parentPort.postMessage({ status: MSG_ERR, id, jobName: job, msg })
    const whenDone = (msg) => parentPort.postMessage({ status: MSG_DONE, id, jobName: job, msg })
    const log = (msg) => parentPort.postMessage({ time: new Date().toString(), status: MSG, id, jobName: job, msg })
    parentPort.on('message', jobDetails => {
        try {
            jobFunction(jobDetails, onError, whenDone, log)
        } catch (err) {
            onError(err)
        }
    })
})