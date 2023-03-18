import client from '../config/database.js'

import appLog from '../events/appLog.js'

async function filterBooks() {
  const catalog = await client.book.findMany({
    where: {
      AND: [
        {
          saleability: 'FOR_SALE',
        },
        {
          OR: [
            {
              language: 'pt-BR',
            },
            {
              language: 'pt',
            },
            {
              language: 'en',
            }
          ]
        },
        {
          NOT: [
            {
              amount: null,
            }
          ]
        }
      ]
    },
    include: {
      authors: {
        include: {
          author: {
            select: {
              name: true
            }
          }
        }
      },
      categories: {
        include: {
          category: {
            select: {
              name: true
            }
          }
        }
      }
    }
  })

  appLog('Repository', 'Catalog searched in the database')
  return catalog
}

async function checkIfDatabaseisEmpty() {
  const isEmpty = await client.book.count()
  appLog('Repository', 'Completed database check')
  return isEmpty
}

export const catalogRepository = {
  filterBooks,
  checkIfDatabaseisEmpty
}