# Como Instalar as Dependências

## Problema
O TypeScript está mostrando erros porque as dependências não estão instaladas.

## Solução

1. **Pare o servidor de desenvolvimento** (se estiver rodando):
   - Pressione `Ctrl+C` no terminal onde o servidor está rodando

2. **Instale as dependências**:
   ```bash
   cd Loteria-frontend
   pnpm install
   ```

3. **Reinicie o TypeScript Server no VS Code**:
   - Pressione `Ctrl+Shift+P`
   - Digite: `TypeScript: Restart TS Server`
   - Pressione Enter

4. **Inicie o servidor novamente**:
   ```bash
   pnpm dev
   ```

## Se ainda houver erros

Execute novamente:
```bash
cd Loteria-frontend
rm -rf node_modules
pnpm install
```

Ou no Windows PowerShell:
```powershell
cd Loteria-frontend
Remove-Item -Recurse -Force node_modules
pnpm install
```


