import { Book } from "@prisma/client";

export type TBook = Omit<Book, 'id'>
