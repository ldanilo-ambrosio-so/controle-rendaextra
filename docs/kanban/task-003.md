# TSK-003: Persistência de Dados em Planilha Local (Pasta `/data/`)

- **Status**: Done
- **Prioridade**: Alta
- **SDD Reference**: [local_storage_schema.json](../schema/local_storage_schema.json)
- **SDD Reference**: [spreadsheet_schema.json](../schema/spreadsheet_schema.json)

---

## Objetivo
Implementar um mecanismo de persistência onde os dados financeiros (lançamentos) do usuário sejam **salvos automaticamente em uma planilha** dentro de uma pasta `/data/` do projeto, além do `localStorage`. Isso elimina a dependência de um único ponto de falha (cache do navegador) e cria um histórico físico em disco acessível diretamente como arquivo.

---

## ⚠️ Decisão Arquitetural Escolhida: OPÇÃO A (File System Access API)

## Critérios de Aceitação (após escolha da opção)

- [x] Criar a pasta `/data/` na raiz do projeto com um `.gitkeep`.
- [x] Adicionar `/data/*.csv` e `/data/*.json` ao `.gitignore` (dados pessoais nunca vão ao GitHub).
- [x] Criar o schema `spreadsheet_schema.json` baseado na opção escolhida.
- [x] Implementar a lógica de persistência conforme a opção aprovada (File System Access API).
- [x] Validar que os dados são salvos em `lancamentos.json` e `lancamentos.csv` automaticamente a cada lançamento ou exclusão.

