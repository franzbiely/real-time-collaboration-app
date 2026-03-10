export class CreateNoteDto {
  title: string;
  content?: string;
  ownerId: string;
  collaborators?: string[];
}
