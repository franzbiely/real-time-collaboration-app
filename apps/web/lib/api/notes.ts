import { apiClient } from '../api-client';
import type { Note, UpdateNoteDto } from '../types/note';

export async function fetchNotes(): Promise<Note[]> {
  const { data } = await apiClient.get<Note[]>('');
  return data;
}

export async function fetchNote(id: string): Promise<Note> {
  const { data } = await apiClient.get<Note>(`/${id}`);
  return data;
}

export async function updateNote(id: string, dto: UpdateNoteDto): Promise<Note> {
  const { data } = await apiClient.patch<Note>(`/${id}`, dto);
  return data;
}
