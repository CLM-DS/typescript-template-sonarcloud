import { IncomingHttpHeaders, OutgoingHttpHeader, OutgoingHttpHeaders } from 'http';

export interface ContextInterface {
  body: unknown,
  headers: OutgoingHttpHeaders | IncomingHttpHeaders,
  status?: number,
  url?: string,
  method?: string,
  eventId?: OutgoingHttpHeader | undefined,
}
