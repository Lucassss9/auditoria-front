# Guia do código

Este arquivo existe para você abrir o projeto daqui a duas semanas e saber onde mexer, e para
indicar o que estudar na ordem em que o projeto vai precisar.

---

## 1. Por onde começar a leitura

Leia nesta ordem. São seis arquivos e, depois deles, o resto do projeto é repetição do mesmo
padrão.

1. **`src/app/core/models/auditoria.model.ts`** — o domínio inteiro em tipos. Se você entender
   `Auditoria`, `ItemAuditoria` e `ItemForaDoEstoque`, entendeu o sistema.
2. **`src/app/core/domain/auditoria-calculos.ts`** — as regras. Funções puras, sem Angular:
   diferença de quantidade, diferença de valor, resumo, prazo vencido.
3. **`src/app/core/services/auditorias.service.ts`** — o contrato de dados, uma classe abstrata.
   Nenhum componente conhece HTTP nem mock; todos dependem desta classe.
4. **`src/app/core/dados.providers.ts`** — onde a implementação é escolhida. Uma flag no
   `environment` decide entre `AuditoriasMockService` e `AuditoriasApiService`.
5. **`src/app/features/auditorias/conferencia/conferencia.ts`** — a tela central. Mostra o
   padrão que todas as outras seguem.
6. **`src/app/app.routes.ts`** — o mapa das telas.

## 2. Como o dado anda

```
componente  →  classe abstrata (core/services)  →  mock ou API  →  volta como Observable
     ↓
  Requisicao  →  signal { carregando, erro, dados }  →  template
```

`src/app/core/utils/requisicao.ts` é uma classe pequena que você mesmo pode reescrever. Ela
embrulha um `Observable` em um signal com três estados, e é por isso que toda tela tem
carregando, erro e vazio sem repetir código.

No template o padrão é sempre o mesmo:

```html
@if (estado().carregando) { <app-carregando /> }
@else if (estado().erro)   { <app-aviso-erro /> }
@else if (vazio())         { <app-estado-vazio /> }
@else                      { ...conteúdo... }
```

## 3. Onde fica cada coisa

| Preciso mexer em… | Vá para |
|---|---|
| Cores, espaçamentos, tipografia | `src/styles/_tokens.scss` |
| Botões, tabelas, campos, selos | `src/styles.scss` |
| Um novo tipo de dado | `src/app/core/models/` |
| Uma regra de cálculo | `src/app/core/domain/auditoria-calculos.ts` |
| O que o backend precisa expor | `src/app/core/services/` e `docs/contrato-backend.md` |
| Dados falsos para desenvolver | `src/app/core/mock/mock-catalogo.ts` e `mock-auditorias.ts` |
| Uma tela nova | `src/app/features/<area>/` + uma entrada em `app.routes.ts` |
| Um componente usado em várias telas | `src/app/shared/components/` |

## 4. Decisões que você precisa conhecer antes de alterar

**O snapshot é sagrado.** `AuditoriasMockService.criar()` copia `quantidade` e `valorUnitario`
do estoque para dentro de cada `ItemAuditoria`. Depois disso a auditoria não consulta mais o
estoque. Se um dia alguém "melhorar" isso buscando o valor atual na hora de exibir, a auditoria
passa a mudar sozinha e deixa de servir como prova.

**`quantidadeReal === null` e `0` são coisas diferentes.** `null` com situação
`NAO_CONFERIDO` significa "ainda não contei". `0` com situação `CONFERIDO` significa "contei e
não tinha nada", o que é a pior divergência possível. `NAO_CONTADO` é um terceiro estado, com
motivo obrigatório.

**`valorUnitarioReferencia === null` não é zero.** Quando o material não tem preço cadastrado,
`diferencaValor()` devolve `null` e a interface escreve *não disponível*. Esses itens são
contados à parte em `resumo.itensSemValor`.

**Fora do estoque não é item com saldo zero.** São listas separadas no modelo
(`itens` e `foraDoEstoque`) justamente para não se confundirem no relatório.

## 5. O que estudar, na ordem em que o projeto vai cobrar

Cada tópico aponta para um arquivo deste projeto que já usa a ideia.

**Agora, para mexer com segurança**

1. **Signals** (`signal`, `computed`, `effect`) — é o coração do Angular moderno e está em todo
   componente aqui. Veja `features/obras/obras.ts`: filtros em `signal`, lista filtrada em
   `computed`.
   Procure por: *Angular signals*, *computed signals*.
2. **Componentes standalone e `@if` / `@for`** — não existe NgModule neste projeto.
   Veja qualquer `.html` de feature.
3. **`input()`, `output()` e `model()`** — a comunicação entre componentes.
   Veja `shared/components/evidencias/evidencias.ts`, que usa `model()` para mão dupla.

**Em seguida, para crescer o projeto**

4. **Reactive Forms** — formulários com validação de verdade.
   Veja `features/equipes/equipes.ts` e `features/auditorias/conferencia/form-fora-do-estoque/`.
   Procure por: *Angular Reactive Forms*, *FormBuilder*, *Validators*.
5. **RxJS, o básico honesto** — `Observable`, `subscribe`, `map`, `forkJoin`. Não precisa
   dominar operadores exóticos. `features/historico/historico.ts` usa `forkJoin` para carregar
   duas fontes juntas.
6. **HttpClient e interceptors** — quando o backend existir. Os serviços em `core/api/` já estão
   escritos; falta ligar. Um interceptor é onde entra o token de autenticação, nunca no
   componente.
   Procure por: *Angular HttpClient*, *HTTP interceptors*, *provideHttpClient*.
7. **Guards e rotas protegidas** — a pasta `core/guards/` está prevista e vazia. Quando houver
   login, é lá.

**Depois, para o projeto não apodrecer**

8. **Testes** — `core/domain/auditoria-calculos.spec.ts` testa as regras sem subir o Angular.
   Esse é o tipo de teste que mais paga: rápido e sobre a parte que não pode errar. Aprenda
   depois `TestBed` para testar componente.
   Procure por: *Vitest*, *Angular TestBed*, *component testing*.
9. **Acessibilidade** — rótulos, foco visível, `aria-*`. Já está aplicado nas tabelas e
   formulários; vale entender por quê.

**Do lado do backend, que é seu**

10. **Spring Boot + JPA**, migrations com Flyway, e o desenho de quem guarda o quê: o seu banco
    guarda auditorias, itens conferidos, evidências e comunicados; o estoque de origem continua
    sendo do CF e é lido sob demanda.
11. **Chamada autenticada a uma API de terceiro** a partir do backend, com credenciais em
    variável de ambiente. Nunca no frontend.

## 6. Próximos passos sugeridos

Em ordem de valor, não de dificuldade:

1. **Ligar o primeiro endpoint real.** Comece por `GET /api/obras`. Com uma rota funcionando, o
   resto é repetição.
2. **Persistir o rascunho da contagem no navegador.** Hoje, se a aba fechar no meio da
   conferência, o que estava em memória se perde. `localStorage` resolve e é meio dia de
   trabalho.
3. **Upload de fotos de verdade.** Hoje a foto vira uma data URL em memória. Com backend, vira
   upload e uma URL.
4. **Exportar o relatório em PDF pelo backend.** A impressão do navegador já resolve o caso
   simples; o PDF gerado no servidor é o que dá para anexar em e-mail automaticamente.
5. **Login e perfis.** Só faz sentido quando mais de uma pessoa usar o sistema.

## 7. Comandos do dia a dia

```bash
npm start                  # servidor de desenvolvimento
npm test                   # testes
npm run build              # build de produção
npx ng generate component features/minha-area/minha-tela
```
