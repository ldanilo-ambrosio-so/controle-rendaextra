# TSK-002: Sistema de Backup de Lançamentos (Exportar/Importar JSON)

- **Status**: Done
- **Prioridade**: Crítica
- **SDD Reference**: [local_storage_schema.json](../schema/local_storage_schema.json)

## Objetivo
Verificar, estilizar e validar o sistema de Backup local do aplicativo. Embora a lógica em Javascript já esteja presente no código (`downloadBackup` e `importBackup`), precisamos garantir que a interface gráfica (HTML/CSS) apresente essa funcionalidade de maneira intuitiva, premium, sem bugs e que funcione perfeitamente para salvar e restaurar o estado completo do app.

## Critérios de Aceitação
- [x] Verificar se os botões com IDs `btnBackup`, `btnRestore` e o input do tipo file `fileImport` estão implementados corretamente no `index.html`.
- [x] Garantir que os botões de backup e restauração possuam estilização moderna (Glassmorphism, transições suaves, cores adequadas).
- [x] Testar a exportação de dados (deve gerar um arquivo JSON válido de acordo com o [local_storage_schema.json](../schema/local_storage_schema.json)).
- [x] Testar a importação de dados (deve reconstruir corretamente os lançamentos e tarefas no `localStorage` e reiniciar o app de forma limpa).
- [x] Garantir feedbacks visuais adequados (ex: alertas de erro se o JSON importado for inválido - método `validateBackupData` integrado).

