declare module 'express-sanitizer' {
  import { RequestHandler } from 'express';

  interface SanitizedRequest {
    sanitizedBody: any;
    sanitizedParams: any;
    sanitizedQuery: any;
    sanitize: (input: string) => string;
  }

  const expressSanitizer: () => RequestHandler;

  export = expressSanitizer;
}