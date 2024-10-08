import { z } from 'zod';
import { validateResponse } from './validateResponse';

const NoteSchema = z.object({
	id: z.string(),
	title: z.string().min(5),
	text: z.string().min(10).max(300),
	userId: z.string(),
	createdAt: z.number(),
});

export type Note = z.infer<typeof NoteSchema>;

const NoteList = z.array(NoteSchema);
export type NoteList = z.infer<typeof NoteList>;

const FetchNotesListSchema = z.object({
	list: NoteList,
	pageCount: z.number(),
});

type FetchNotesListResponse = z.infer<typeof FetchNotesListSchema>;

export function fetchNotesList(): Promise<FetchNotesListResponse> {
	return fetch(`/api/notes`)
		.then(validateResponse)
		.then(response => response.json())
		.then(data => FetchNotesListSchema.parse(data));
}

export function createNote(note: {
	title: string;
	text: string;
}): Promise<void> {
	return fetch('/api/notes', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(note),
	})
		.then(validateResponse)
		.then(() => undefined);
}
