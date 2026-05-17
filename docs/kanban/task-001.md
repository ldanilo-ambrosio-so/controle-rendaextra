# TSK-001: Organização Inicial e Segurança do Repositório (Git/GitHub)

- **Status**: Done
- **Prioridade**: Alta
- **SDD Reference**: [local_storage_schema.json](../schema/local_storage_schema.json)

## Objetivo
Garantir a total privacidade dos dados reais do usuário e preparar o repositório para ser compartilhado de forma limpa e profissional no GitHub. Isso inclui configurar o arquivo `.gitignore` para bloquear vazamentos de relatórios financeiros e backups locais, além de certificar a integridade da estrutura de desenvolvimento.

## Critérios de Aceitação
- [x] Criar ou atualizar o arquivo `.gitignore` na raiz do projeto para ignorar:
  - Backups locais em JSON (`backup_*.json` ou arquivos JSON soltos na raiz)
  - Planilhas CSV exportadas do sistema (`controle_financeiro_*.csv`)
  - Pastas de configuração de editores (`.vscode/`, `.idea/`, etc.)
- [x] Inicializar o repositório Git local (caso não esteja inicializado).
- [x] Validar que nenhum arquivo contendo dados reais do usuário foi monitorado pelo Git.
- [x] Mapear/Documentar instruções de como rodar o ambiente de testes de forma isolada da versão pessoal no `README.md`.

