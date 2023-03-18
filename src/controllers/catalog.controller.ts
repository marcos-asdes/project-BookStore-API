import { Request, Response } from 'express'

import { catalogService } from '../services/catalog.service.js'

import appLog from '../events/appLog.js'

async function renderCatalog(_req: Request, res: Response) {
  await catalogService.checkIfDatabaseExists()

  const catalog = await catalogService.filterCatalog()

  appLog('Controller', 'Catalog sent')
  return res.status(200).send(catalog)
}

export { renderCatalog }