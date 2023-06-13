import path from 'path';
import { fileURLToPath } from 'url';

export function getDirname() {
  return path.dirname(fileURLToPath(import.meta.url));
}
