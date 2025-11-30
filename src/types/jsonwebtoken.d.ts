declare module 'jsonwebtoken' {
  export function sign(payload: any, secret: string, opts?: any): string;
  export function verify(token: string, secret: string, opts?: any): any;
  export function decode(token: string): any;
}
