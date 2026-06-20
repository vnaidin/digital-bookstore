import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export interface FileUpload {
  fieldname: string;
  mimetype: string;
  buffer: Buffer;
}

export async function saveUpload(file: FileUpload): Promise<string> {
  const ext = file.mimetype.split('/')[1];
  const filename = `${file.fieldname}-${Date.now()}.${ext}`;
  await writeFile(join('uploads', filename), file.buffer);
  return filename;
}
