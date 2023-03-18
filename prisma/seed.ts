/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

import client from '../src/config/database.js';

import { TBook } from '../src/types/book.js';

export async function bookshelf(): Promise<void> {
  const arraySeed: string[] = ['Sapiens', 'Yuval', 'Harari', '.NET', 'dotNet', 'CSharp', 'JavaScript', 'Java', 'Typescript', 'Programação']

  await resetDatabase()

  for (let i = 0; i < arraySeed.length; i++) {
    const googleBooksAPI = `https://www.googleapis.com/books/v1/volumes?q=${arraySeed[i]}&key=${process.env.API_KEY}`
    await axios.get(googleBooksAPI).then(async (res) => {
      const books: any = res.data.items

      for (const book of books) {
        const googleId: string = book.id

        const bookAlreadyRegistered = await checkIfBookIsAlreadyRegistered(googleId)
        if (bookAlreadyRegistered) continue

        // book data
        const bookObject = await createBookObject(book)
        const bookData = await createBookRegister(bookObject)

        // authors data
        if (book.volumeInfo && book.volumeInfo.authors && book.volumeInfo.authors.length > 0) {
          const authors: any = book.volumeInfo.authors

          for (const author of authors) {
            const authorAlreadyRegistered = await checkIfAuthorIsAlreadyRegistered(author)

            if (authorAlreadyRegistered) {
              await createBookAuthorLink(bookData.id, authorAlreadyRegistered.id)
            } else {
              const authorData = await createAuthorRegister(author)
              await createBookAuthorLink(bookData.id, authorData.id)
            }
          }
        }

        // categories data
        if (book.volumeInfo && book.volumeInfo.categories && book.volumeInfo.categories.length > 0) {
          const categories: any = book.volumeInfo.categories

          for (const category of categories) {
            const categoryAlreadyRegistered = await checkIfCategoryIsAlreadyRegistered(category)

            if (categoryAlreadyRegistered) {
              await createBookCategoryLink(bookData.id, categoryAlreadyRegistered.id)
            } else {
              const categoryData = await createCategoryRegister(category)
              await createBookCategoryLink(bookData.id, categoryData.id)
            }
          }
        }
      }
    })
  }
}

async function resetDatabase() {
  await client.$transaction([
    client.$executeRaw`TRUNCATE books RESTART IDENTITY CASCADE`,
    client.$executeRaw`TRUNCATE authors RESTART IDENTITY CASCADE`,
    client.$executeRaw`TRUNCATE categories RESTART IDENTITY CASCADE`
  ])
}

async function checkIfBookIsAlreadyRegistered(googleId: string) {
  return await client.book.findUnique({
    where: {
      google_id: googleId
    }
  })
}

async function createBookRegister(book: TBook) {
  return await client.book.create({
    data: book
  })
}

async function checkIfAuthorIsAlreadyRegistered(author: string) {
  return await client.author.findUnique({
    where: {
      name: author
    }
  })
}

async function createAuthorRegister(author: string) {
  return await client.author.create({
    data: {
      name: author
    }
  })
}

async function createBookAuthorLink(bookId: number, authorId: number) {
  return await client.bookAuthors.create({
    data: {
      book_id: bookId,
      author_id: authorId
    }
  })
}

async function checkIfCategoryIsAlreadyRegistered(category: string) {
  return await client.category.findUnique({
    where: {
      name: category
    }
  })
}

async function createCategoryRegister(category: string) {
  return await client.category.create({
    data: {
      name: category
    }
  })
}

async function createBookCategoryLink(bookId: number, categoryId: number) {
  return await client.bookCategories.create({
    data: {
      book_id: bookId,
      category_id: categoryId
    }
  })
}

async function createBookObject(book: any) {
  const volumeData = book.volumeInfo
  const saleData = book.saleInfo
  const searchData = book.searchInfo

  const auxObject: TBook = {
    google_id: '',
    title: '',
    publisher: null,
    published_date: null,
    description: null,
    page_count: null,
    image_link: null,
    language: null,
    preview_link: null,
    saleability: 'NOT_FOR_SALE',
    isEbook: false,
    amount: null,
    currency_code: null,
    text_snippet: null
  }

  auxObject.google_id = book.id

  if (volumeData) {
    auxObject.title = volumeData.title

    if (volumeData.publisher) {
      auxObject.publisher = volumeData.publisher
    }

    if (volumeData.publishedDate) {
      auxObject.published_date = volumeData.publishedDate
    }

    if (volumeData.description) {
      auxObject.description = volumeData.description
    }

    if (volumeData.pageCount) {
      auxObject.page_count = volumeData.pageCount
    }

    if (volumeData.imageLinks) {
      auxObject.image_link = volumeData.imageLinks.thumbnail
    }

    if (volumeData.language) {
      auxObject.language = volumeData.language
    }

    if (volumeData.previewLink) {
      auxObject.preview_link = volumeData.previewLink
    }
  }

  if (saleData) {
    if (saleData.saleability) {
      auxObject.saleability = saleData.saleability
    }

    if (saleData.isEbook) {
      auxObject.isEbook = saleData.isEbook
    }

    if (auxObject.saleability === 'FOR_SALE') {
      auxObject.amount = saleData.listPrice.amount
      auxObject.currency_code = saleData.listPrice.currencyCode
    }
  }

  if (searchData && searchData.textSnippet) {
    auxObject.text_snippet = searchData.textSnippet
  }

  return auxObject
}

bookshelf()
  .then(async () => {
    await client.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await client.$disconnect()
    process.exit(1)
  })
