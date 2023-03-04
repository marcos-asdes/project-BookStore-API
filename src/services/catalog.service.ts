import { catalogRepository } from '../repositories/catalog.repository.js'

import appLog from '../events/appLog.js'
import { AppError } from '../events/appError.js'

async function filterCatalog() {
  const data = await catalogRepository.filterBooks()
  if (!data) {
    throw new AppError(
      404,
      'No book was found',
      'No book with the characteristics determined in the database search was found'
    )
  }
  appLog('Service', 'Catalog created')
  return data
}

export const catalogService = {
  filterCatalog
}