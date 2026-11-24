import { HttpErrorResponse } from '@angular/common/http';

/**
 * O backend responde erro sempre no mesmo formato:
 *
 *     { "mensagem": "...", "campo": "..." }
 *
 * Esta função tira a mensagem de lá. Sem ela, o `HttpErrorResponse` do Angular
 * não passa no `instanceof Error` — ele implementa `Error` em vez de herdar —
 * e toda falha virava o mesmo texto genérico, por mais específica que a
 * resposta do servidor fosse.
 */

interface ErroDaApi {
  mensagem: string;
  campo?: string | null;
}

function corpoDaApi(erro: HttpErrorResponse): ErroDaApi | null {
  const corpo: unknown = erro.error;

  if (corpo && typeof corpo === 'object' && typeof (corpo as ErroDaApi).mensagem === 'string') {
    return corpo as ErroDaApi;
  }

  return null;
}

/** O texto para mostrar ao usuário. Prefere o que o servidor disse. */
export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof HttpErrorResponse) {
    const corpo = corpoDaApi(erro);

    if (corpo) {
      return corpo.mensagem;
    }

    // status 0 é a aplicação fora do ar ou o proxy caído: não houve resposta.
    if (erro.status === 0) {
      return 'Sem resposta do servidor. Verifique se a aplicação está no ar.';
    }

    if (erro.status === 401) {
      return 'Sua sessão expirou. Entre de novo.';
    }

    return `O servidor respondeu com erro ${erro.status}.`;
  }

  if (erro instanceof Error) {
    return erro.message;
  }

  return 'Falha na comunicação com o servidor.';
}

/** Qual campo o servidor apontou, quando ele apontou algum. */
export function campoDoErro(erro: unknown): string | null {
  if (erro instanceof HttpErrorResponse) {
    return corpoDaApi(erro)?.campo ?? null;
  }

  return null;
}
