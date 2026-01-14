# Loteria Frontend

Frontend do sistema de loteria desenvolvido em React com TypeScript, Vite e TailwindCSS.

## Stack Tecnológica

- **Framework**: React 18
- **Linguagem**: TypeScript
- **Build Tool**: Vite
- **Estilização**: TailwindCSS
- **Roteamento**: React Router
- **HTTP Client**: Axios
- **Notificações**: React Hot Toast
- **Modais**: SweetAlert2

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis (UI pura)
├── pages/              # Páginas da aplicação
├── hooks/              # Hooks customizados (lógica)
├── services/           # Serviços (comunicação com API)
├── types/              # Definições de tipos
├── interfaces/         # Definições de interfaces
└── utils/             # Funções utilitárias
```

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Execute o projeto em modo desenvolvimento:
```bash
npm run dev
```

3. Para produção:
```bash
npm run build
npm run preview
```

## Funcionalidades

- **Login/Autenticação**: Sistema de autenticação JWT
- **Mega Bet**: Criação de apostas da Mega (60 números, 10 selecionados)
- **Quina Bet**: Criação de apostas da Quina (80 números, 10 selecionados)
- **Lista de Apostas**: Visualização e remoção de apostas locais
- **Exportação Excel**: Exportação de apostas para Excel
- **Envio de Apostas**: Envio em lote para o backend

## Princípios Aplicados

- **Separação de Lógica e UI**: Hooks para lógica, componentes para UI
- **Clean Code**: Funções pequenas, early returns, imutabilidade
- **Type Safety**: TypeScript estrito em todo o código
- **Componentes Funcionais**: Apenas componentes funcionais com hooks

## UI/UX

A interface foi replicada fielmente do sistema Angular original, mantendo:
- Cores e estilos visuais idênticos
- Layout e estrutura de componentes
- Experiência do usuário preservada

