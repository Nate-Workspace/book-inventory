import type Book from "../models/Book";
import apiClient from "./Apiclient";

interface DeleteResponse {
  status: boolean;
  message: string;
}

interface GetBookResponse {
  status: boolean;
  message: string;
  data: Book;
}

export const deleteBook = async (id: number) =>
  await apiClient.delete<DeleteResponse>(`/books/${id}`);

export const getBook = async (id: string) =>
  (await apiClient.get<GetBookResponse>(`/books/${id}`)).data;

export const getBooks = async () =>
  (await apiClient.get<GetBookResponse>(`/books`)).data;

export const updateBook = async (id: number, data: Book) =>
  await apiClient.patch(`/books/${id}`, data);
