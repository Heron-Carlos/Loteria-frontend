# Instruções de Instalação

## ⚠️ IMPORTANTE: Instale as dependências primeiro!

Os erros de TypeScript que você está vendo são porque as dependências do projeto ainda não foram instaladas.

## Passos para resolver:

1. **Abra o terminal na pasta do frontend:**
   ```bash
   cd Loteria-frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Aguarde a instalação completar** (pode levar alguns minutos)

4. **Após a instalação, os erros devem desaparecer automaticamente**

## Se os erros persistirem:

1. **Feche e reabra o VS Code/IDE**

2. **Verifique se o TypeScript está reconhecendo os tipos:**
   - Pressione `Ctrl+Shift+P` (ou `Cmd+Shift+P` no Mac)
   - Digite "TypeScript: Restart TS Server"
   - Pressione Enter

3. **Verifique se o node_modules existe:**
   ```bash
   ls node_modules  # Linux/Mac
   dir node_modules  # Windows
   ```

## Dependências que serão instaladas:

- react & react-dom (framework)
- react-router-dom (roteamento)
- react-hot-toast (notificações)
- sweetalert2 (modais)
- axios (HTTP client)
- tailwindcss (estilização)
- @types/react & @types/react-dom (tipos TypeScript)

Após instalar, todos os erros de "Cannot find module" devem desaparecer!

