import { Book } from "@prisma/client";

export type BookT = Omit<Book, 'id'>