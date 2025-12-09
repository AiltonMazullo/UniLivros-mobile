# UniLivros — Mobile (Expo)

Aplicativo para incentivar a leitura e facilitar a troca/compartilhamento de livros entre estudantes. Esta pasta contém o app Mobile (Expo + React Native) com navegação pelo `expo-router`.

## Visão Geral

- Usuário autentica (JWT) e gerencia sua estante pessoal.
- Pode visualizar livros de outros usuários (Estante de Unilivrers) e ver informações do dono.
- Perfil do usuário mostra seus livros e dados básicos.
- Integração com Google Books para melhorar UX/UI.

## Stack Técnica

- React Native com Expo e `expo-router`.
- TypeScript.
- Axios com interceptors para JWT.
- NativeWind/Tailwind para estilização (`tailwind.config.js`, `styles/global.css`).

## Estrutura do Projeto

```
unilivros-mobile/
├── app.json
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── src/
│   ├── app/                    # Rotas do expo-router
│   │   ├── (auth)/login.tsx
│   │   ├── (app)/home.tsx
│   │   ├── (app)/user.tsx
│   │   ├── (app)/description-book.tsx
│   │   ├── (app)/add-unilivrer.tsx
│   │   └── (app)/exchange.tsx
│   ├── components/             # UI compartilhada (books-unilivrers, my-books, etc.)
│   ├── context/                # AuthContext, InputContext
│   ├── services/               # API, BooksService, UsersService
│   ├── types/                  # Tipos de domínio (Book, etc.)
│   ├── utils/                  # Formatadores (estado/tipo), helpers
│   └── styles/                 # global.css para NativeWind
└── assets/
```

## API e Autenticação

- Base da API: definida em `src/services/api.ts` .
- Autenticação JWT: interceptors adicionam `Authorization: Bearer <token>` automaticamente após login.

## Execução (Desenvolvimento)

Pré‑requisitos:

- Node.js 18+
- npm ou yarn

Instalação:

- `npm install`

Executar:

- `npx expo start` — inicia o servidor Expo.
- `npm run android` — executa em Android.
- `npm run ios` — executa em iOS (macOS).
- `npm run web` — executa a versão web (Expo).

## Variáveis de Ambiente

- O token JWT é gerenciado internamente pelo `AuthContext` e pelos interceptors de `axios`.

## Contribuição

1. Faça um fork do repositório.
2. Crie um branch: `git checkout -b feat/minha-feature`.
3. Commit: `git commit -m "feat: descrição da mudança"`.
4. Push: `git push origin feat/minha-feature`.
5. Abra um Pull Request.

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
