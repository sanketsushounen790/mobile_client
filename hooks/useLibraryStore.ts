import { create } from "zustand";

type Book = {
  //_index: string;
  _id: string;
  _score: number;
  _source: {
    chapter_original_id: string;
    chapter_title: string;
    author: string;
    book_title: string;
    date: string;
    aws_s3_bucket_url: string;
  };
};

interface LibraryState {
  books: Book[];
  addNewBook: (newBook: Book) => void;
}

const useLibraryStore = create<LibraryState>((set) => ({
  books: [],
  addNewBook: (newBook) =>
    set((state) => ({
      books: state.books.some(
        (item: Book) => item._source.book_title === newBook._source.book_title
      )
        ? state.books
        : [...state.books, newBook],
    })),
}));

export default useLibraryStore;
