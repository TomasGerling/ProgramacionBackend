import * as url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('./src', import.meta.url));

export { __filename, __dirname };