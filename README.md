# UniLivros

Sistema para incentivar a leitura e facilitar a troca/compartilhamento de livros entre estudantes, com uma solução Web e uma extensão Mobile.

## Introdução

O aumento dos preços dos livros e a queda no hábito de leitura no Brasil revelam um cenário preocupante: perda de milhões de leitores, superação do número de não‑leitores em relação aos leitores e a consequente redução de espaços e oportunidades que associam leitura à socialização. Esse cenário agrava desigualdades sociais e prejudica o desenvolvimento intelectual e cultural, principalmente entre jovens e pessoas de baixa renda.

## Motivação

A solução UniLivros foi pensada para incentivar a leitura e promover o compartilhamento de livros entre discentes do Centro Universitário Tiradentes (UNIT). Por meio de uma estante virtual, os usuários poderão disponibilizar e buscar livros para troca, além de interagir para combinar local e horário para o encontro. A extensão Mobile auxilia na gestão de propostas e encontros, incluindo confirmação de presença via QR Code no local da troca.

## Solução

- Web
  - Cadastro/Login
  - Cadastrar livros na estante virtual
  - Visualizar estantes de outros usuários
  - Consultar livros disponíveis para troca
  - Fazer e gerenciar propostas de troca
  - Agendar e gerenciar encontros
  - Gerir o próprio perfil

- Mobile
  - Acompanhar propostas recebidas/pendentes
  - Ver detalhes dos encontros e confirmar presença via QR Code
  - Experiência otimizada para o dia da troca

## Principais Requisitos

- Funcionais
  - Adicionar livros à estante virtual
  - Visualizar a estante de outros usuários
  - Visualizar livros disponíveis para troca
  - Fazer propostas de troca
  - Gerenciar propostas recebidas

- Não Funcionais
  - Disponibilizar um serviço de busca
  - Garantir confidencialidade, integridade e disponibilidade dos dados pessoais
  - Funcionamento em diferentes dispositivos

## Tecnologias

- Front‑End Web: React
- Mobile: React Native (Expo, expo‑router)
- Back‑End: Java
- Banco de Dados: SQL Server, PostgreSQL, MongoDB
- Integrações: Axios

## Estrutura do projeto (Mobile)

```
unilivros-mobile/
├── app.json
├── package.json
├── tsconfig.json
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── screens/
│   └── services/
└── assets/
```

## Como executar (Mobile)

Pré‑requisitos:
- Node.js 18+
- npm ou yarn
- Expo CLI (opcional, você pode usar npx)

Instalação:
- `npm install`

Rodar em desenvolvimento:
- `npm run start` — abre o servidor Expo
- `npm run android` — abre o app no emulador/dispositivo Android
- `npm run ios` — abre o app no simulador iOS (macOS)
- `npm run web` — inicia a versão web com Expo

Observações:
- Este projeto usa TypeScript com `module: ESNext` e `moduleResolution: bundler`, recomendado para apps com bundler (Expo). Caso seu editor reclame de `module: preserve`, mantenha `ESNext` no `tsconfig.json`.
- Em Windows, o Git pode trocar LF/CRLF automaticamente; ajuste suas configs caso necessário.

## Contribuição

1. Faça um fork do repositório
2. Crie um branch para sua feature/ajuste: `git checkout -b feat/minha-feature`
3. Commit: `git commit -m "feat: descrição da mudança"`
4. Push: `git push origin feat/minha-feature`
5. Abra um Pull Request

## Equipe

- Ailton Rodrigues Mazullo Neto — Desenvolvedor Mobile
- Beatriz Conde Carvalho — Designer UI/UX / Marketing
- Bruno Gabriel de Lima Souza — Desenvolvedor Back‑end
- Gabriela Monte Batista de Arruda — Product Owner (PO) / Analista de Requisitos
- Gabriella Stheffany Pontes da Cunha — QA / Testes e Documentação Técnica
- Jônatas Lopes Ferreira da Silva — Arquiteto de Banco de Dados
- José Olegário Acioly Nery — Líder de Projeto / Scrum Master
- Matheus Guilherme Morais da Silva — Desenvolvedor Mobile
- Poliane Maria do Monte Silva — Desenvolvedor Front‑end Web
