import { create } from "zustand";

type Chapter = {
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
    cloudinary_cover_url: string;
    language: string;
  };
};

type Book = {
  //_index: string;
  _id: string;
  _score: number;
  _source: {
    author: string;
    book_title: string;
    date: string;
    aws_s3_bucket_url: string;
    cloudinary_cover_url: string;
    language: string;
  };
};

interface LibraryState {
  books: Chapter[] | Book[];
  addNewBook: (newBook: Chapter | Book) => void;
}

const useLibraryStore = create<LibraryState>((set) => ({
  books: [],
  addNewBook: (newBook) =>
    set((state) => ({
      books: state.books.some(
        (item: Chapter | Book) =>
          item._source.book_title === newBook._source.book_title
      )
        ? state.books
        : [...state.books, newBook],
    })),
}));

export default useLibraryStore;
