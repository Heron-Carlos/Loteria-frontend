# Configuração com pnpm

## ✅ Dependências Instaladas

As dependências foram instaladas com sucesso usando pnpm!

## ⚠️ IMPORTANTE: Reinicie o TypeScript Server

Após instalar as dependências com pnpm, você **DEVE** reiniciar o TypeScript Server no VS Code:

1. Pressione `Ctrl+Shift+P` (ou `Cmd+Shift+P` no Mac)
2. Digite: **"TypeScript: Restart TS Server"**
3. Pressione Enter
4. Aguarde alguns segundos para o TypeScript indexar os arquivos

## Por que isso é necessário?

O pnpm usa uma estrutura diferente de `node_modules` (symlinks), e o TypeScript precisa ser reiniciado para reconhecer os módulos corretamente.

## Se os erros persistirem:

1. **Feche completamente o VS Code**
2. **Abra novamente**
3. **Reinicie o TS Server novamente**

## Verificar se está funcionando:

Após reiniciar o TS Server, os erros de "Cannot find module" devem desaparecer.

## Executar o projeto:

```bash
pnpm dev
```

O projeto estará disponível em `http://localhost:5173`

