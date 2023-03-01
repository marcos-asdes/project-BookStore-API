import axios from 'axios';

import client from '../src/config/database.js';

import { TBook } from '../src/types/book.js';
import { Author, Category } from "@prisma/client";

async function bookshelf() {

  await client.$transaction([
    client.$executeRaw`TRUNCATE books RESTART IDENTITY CASCADE`,
    client.$executeRaw`TRUNCATE authors RESTART IDENTITY CASCADE`,
    client.$executeRaw`TRUNCATE categories RESTART IDENTITY CASCADE`
  ])

  const arrayTest = ['Harry+Potter', 'Sapiens', 'Javascript', 'Typescript', 'Excel', 'John+Green', 'Colleen+Hoover', 'Java', 'CSharp', 'DotNet', 'Python', 'Holmes', '.NET']
  const arrayGoogleId: string[] = []
  const arrayAuthors: string[] = []
  const arrayCategories: string[] = []

  for (let i = 0; i < arrayTest.length; i++) {
    const googleBooksAPI = `https://www.googleapis.com/books/v1/volumes?q=${arrayTest[i]}&key=${process.env.API_KEY}`
    axios.get(googleBooksAPI).then(async (res) => {
      let totalItems = res.data.items.length

      for (let j = 0; j < totalItems; j++) {
        const googleId: string = res.data.items[j].id

        const googleIdIsDuplicated: string | undefined = arrayGoogleId.find((e: string) => e === googleId)
        if (googleIdIsDuplicated) {
          continue
        }
        arrayGoogleId.push(googleId)

        const selectedItem = res.data.items[j]
        const volumeData = selectedItem.volumeInfo
        const saleData = selectedItem.saleInfo
        const searchData = selectedItem.searchInfo

        // book data
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

        auxObject.google_id = googleId
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

        if (searchData && searchData.textSnippet) {
          auxObject.text_snippet = searchData.textSnippet
        }

        const book = await client.book.create({
          data: auxObject
        })

        // authors data
        if (volumeData.authors && volumeData.authors.length > 0) {
          for (let k = 0; k < volumeData.authors.length; k++) {
            let authorAlreadyRegistered: Author
            const authorName: string = volumeData.authors[k]
            const authorIsDuplicated: string | undefined = arrayAuthors.find((e: string) => e === authorName)

            if (authorIsDuplicated) {
              authorAlreadyRegistered = await client.author.findUnique({
                where: {
                  name: authorName
                }
              })
            } else {
              arrayAuthors.push(authorName)
            }

            if (!authorAlreadyRegistered) {
              const author = await client.author.create({
                data: {
                  name: authorName
                }
              })
              await client.bookAuthors.create({
                data: {
                  book_id: book.id,
                  author_id: author.id
                }
              })
            } else {
              await client.bookAuthors.create({
                data: {
                  book_id: book.id,
                  author_id: authorAlreadyRegistered.id
                }
              })
            }
          }
        }

        // categories data
        if (volumeData.categories && volumeData.categories.length > 0) {
          for (let k = 0; k < volumeData.categories.length; k++) {
            let categoryAlreadyRegistered: Category
            const categoryName: string = volumeData.categories[k]
            const categoryIsDuplicated: string | undefined = arrayCategories.find((e: string) => e === categoryName)

            if (categoryIsDuplicated) {
              categoryAlreadyRegistered = await client.category.findUnique({
                where: {
                  name: categoryName
                }
              })
            } else {
              arrayCategories.push(categoryName)
            }

            if (!categoryAlreadyRegistered) {
              const category = await client.category.create({
                data: {
                  name: categoryName
                }
              })
              await client.bookCategories.create({
                data: {
                  book_id: book.id,
                  category_id: category.id
                }
              })
            } else {
              await client.bookCategories.create({
                data: {
                  book_id: book.id,
                  category_id: categoryAlreadyRegistered.id
                }
              })
            }
          }
        }
      }
    })
  }
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

console.log('Test')