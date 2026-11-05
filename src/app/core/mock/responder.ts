import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

const LATENCIA_MS = 140;

export function responder<T>(valor: T): Observable<T> {
  return of(valor).pipe(delay(LATENCIA_MS));
}
