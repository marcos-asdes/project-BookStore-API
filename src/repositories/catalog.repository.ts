import client from '../config/database.js'

import appLog from '../events/appLog.js'

async function filterBooks() {
  const catalog = await client.book.findMany({
    where: {
      AND: [
        {
          OR: [
            {
              saleability: 'FOR_SALE',
            },
            {
              saleability: 'FREE',
            }
          ]
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
          author: true
        }
      },
      categories: {
        include: {
          category: true
        }
      }
    }
  })

  appLog('Repository', 'Catalog searched in the database')
  return catalog
}

export const catalogRepository = {
  filterBooks
}