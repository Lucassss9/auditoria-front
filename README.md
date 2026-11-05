# Auditoria de Estoque

Frontend do sistema de auditoria e conferência de estoque de obras. O auditor seleciona os
materiais a conferir, registra a quantidade física encontrada, anexa evidências, acompanha as
divergências e prepara o e-mail que cobra a regularização da obra.

Angular 21 · TypeScript · SCSS · Reactive Forms · lucide-angular.
Tema claro e escuro, login com sessão e dados de demonstração trocáveis por API numa linha.

## Como rodar

```bash
npm install
npm start
```

A aplicação sobe em <http://localhost:4200> com dados de demonstração.

```bash
npm run build    # compila para produção
npm test         # roda os testes com Vitest
```

**Node:** o projeto usa Angular 21, que exige Node 20.19+, 22.12+ ou 24+. Angular 22 exige
Node 24.15+; para atualizar depois, suba o Node primeiro.

## Dados de demonstração e API

O frontend nunca fala com o CF Obras. Ele conversa apenas com o backend próprio, que é quem
guarda credenciais e faz a leitura do estoque de origem.

Enquanto esse backend não existe, a aplicação usa serviços mock. A troca é uma linha:

```ts
// src/environments/environment.ts
export const environment = {
  producao: false,
  usarDadosMock: true,   // false passa a usar HttpClient contra apiBaseUrl
  apiBaseUrl: '/api',
};
```

`src/app/core/dados.providers.ts` decide, a partir dessa flag, se injeta a implementação mock ou
a implementação HTTP de cada serviço. Os componentes não sabem a diferença: dependem das classes
abstratas em `core/services`.

O contrato que o backend precisa expor está em [`docs/contrato-backend.md`](docs/contrato-backend.md).

Para construir o backend, siga o [`docs/guia-backend.md`](docs/guia-backend.md) passo a passo.
As decisões tomadas ficam em [`docs/decisoes/`](docs/decisoes/LEIA-ME.md).

## O que o sistema faz

| Tela | O que resolve |
|---|---|
| Entrar | Login com sessão e proteção de rota (`auditor@exemplo.com.br` / `demo1234`) |
| Início | Onde você parou: contagens abertas, pendências e prazos |
| Auditorias | Lista das contagens, com busca e filtro por situação |
| Nova auditoria | Escolha da obra, seleção explícita dos materiais e congelamento do estoque |
| Conferência | Quantidade real item a item, divergência automática, fotos e observações |
| Relatório | Resultado em seções, com botão de salvar em PDF |
| E-mail | Destinatários, prazo, assunto e corpo prontos para copiar |
| Buscas salvas | Regras de pesquisa suas, reaproveitadas em qualquer obra |
| Obras | Obras agrupadas por filial, com a equipe responsável |
| Equipes | Cadastro de responsáveis e de quem recebe o e-mail |
| Histórico | Consulta das auditorias passadas, sem alterar o original |
| Configurações | Sua conta, tema, prazo padrão e origem dos dados |

## Regras que o código garante

- **O estoque de referência é congelado.** Ao iniciar a auditoria, as quantidades e os valores
  dos itens selecionados são copiados para dentro dela. Nada que mude no estoque de origem
  depois altera uma auditoria já iniciada.
- **A seleção de materiais é explícita.** Pesquisar uma categoria não inclui nada
  automaticamente; o auditor revisa a lista antes de começar.
- **Saldo zero não é ausência de cadastro.** Item contado como zero gera divergência; material
  encontrado que não existe no estoque entra como achado próprio, marcado como tal.
- **Sem valor de referência, não há divergência financeira.** O sistema mostra
  *não disponível* em vez de somar zero e fazer o total mentir para baixo.
- **O e-mail não é enviado pelo sistema.** O texto é montado e copiado; o envio é feito pela
  pessoa, no cliente de e-mail dela.
- **Busca salva guarda termos, não códigos.** É o que faz a mesma regra valer em qualquer obra.
- **Prazo vencido é sinalizado, não resolvido.** O procedimento após o vencimento ainda não foi
  definido pela empresa, então o sistema não inventa um.

## Estrutura

```
src/app/
├── core/          modelos, regras de cálculo, serviços (contrato, mock e HTTP)
├── shared/        componentes, pipes e ícones reutilizáveis
├── layout/        moldura da aplicação: menu lateral, cabeçalho
└── features/      uma pasta por área: painel, auditorias, obras, equipes, histórico…
```

Para entender o código e saber o que estudar em seguida, comece pelo
[`GUIA.md`](GUIA.md).
