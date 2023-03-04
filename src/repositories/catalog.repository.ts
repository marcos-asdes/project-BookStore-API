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
        }
      ]
    }
  })

  appLog('Repository', 'Book search performed by language and saleability')
  return catalog
}

export const catalogRepository = {
  filterBooks
}