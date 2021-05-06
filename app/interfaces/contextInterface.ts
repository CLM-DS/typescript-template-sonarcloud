import { IncomingHttpHeaders, OutgoingHttpHeaders } from 'node:http2';

export interface ContextInterface {
  body: unknown,
  headers: IncomingHttpHeaders | OutgoingHttpHeaders,
  status?: number,
  url?: string,
  method?: string, 
}