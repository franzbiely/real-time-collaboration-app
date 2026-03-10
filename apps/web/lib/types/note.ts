export interface Note {
  _id: string;
  title: string;
  content: string;
  ownerId: string;
  collaborators: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  ownerId?: string;
  collaborators?: string[];
}
