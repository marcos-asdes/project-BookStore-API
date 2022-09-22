import app from './app.js'

import appLog from './events/appLog.js'

const PORT = +process.env.PORT || 5000

app.listen(PORT, () => {
  appLog('Server', `Server listening on port ${PORT}`)
})
