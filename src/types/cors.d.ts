// Temporary ambient declaration to silence editor/TS errors when @types/cors
// are not installed in the environment (IDE-only fix). Remove when types are installed.
declare module 'cors' {
  import { RequestHandler } from 'express';
  function cors(options?: any): RequestHandler;
  namespace cors {}
  export = cors;
}
