import app from './app.js'

import AppLog from './events/AppLog.js'

const PORT = +process.env.PORT || 5000

app.listen(PORT, () => {
  AppLog('Server', `Server listening on port ${PORT}`)
})
