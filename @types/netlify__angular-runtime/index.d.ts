declare module '@netlify/angular-runtime/common-engine.mjs' {
  export function render(engine: any): Promise<any>;
}
declare module '@netlify/angular-runtime/server' {
  export function createServer(options: any): any;
  export function createViteServer(): any;
}
