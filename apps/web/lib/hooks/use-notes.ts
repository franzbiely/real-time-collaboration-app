import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { fetchNotes, fetchNote, updateNote } from '../api/notes';
import type { UpdateNoteDto } from '../types/note';

export const notesKeys = {
  all: ['notes'] as const,
  list: () => [...notesKeys.all] as const,
  detail: (id: string) => [...notesKeys.all, id] as const,
};

export function useNotes() {
  return useQuery({
    queryKey: notesKeys.list(),
    queryFn: fetchNotes,
  });
}

export function useNote(id: string | null) {
  return useQuery({
    queryKey: notesKeys.detail(id ?? ''),
    queryFn: () => fetchNote(id!),
    enabled: !!id,
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateNoteDto }) =>
      updateNote(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: notesKeys.list() });
      queryClient.invalidateQueries({ queryKey: notesKeys.detail(id) });
    },
  });
}
