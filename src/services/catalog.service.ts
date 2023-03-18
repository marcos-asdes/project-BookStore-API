import { catalogRepository } from '../repositories/catalog.repository.js'

import appLog from '../events/appLog.js'
import { AppError } from '../events/appError.js'

import { bookshelf } from '../../prisma/seed.js'

async function checkIfDatabaseExists() {
  const isEmpty = await catalogRepository.checkIfDatabaseisEmpty()

  if (isEmpty === 0) {
    await bookshelf()
    appLog('Service', 'Database populated')
  }

  appLog('Service', 'Database checked')
}

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
  checkIfDatabaseExists,
  filterCatalog
}