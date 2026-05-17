# Documentação Técnica e Funcional - Controle Renda Extra (Renda+)

Este documento serve como o manual técnico oficial da aplicação **Renda+**, detalhando sua arquitetura, tecnologias empregadas, regras de negócio e o funcionamento das novas atualizações de segurança e sincronização local.

---

## 1. Visão Geral da Aplicação
O **Renda+** é um sistema web client-side (SPA) desenvolvido para profissionais autônomos ou prestadores de serviço (ex: técnicos de informática, revendedores de equipamentos) que desejam manter controle preciso de suas receitas extras e calcular com exatidão a reserva para o **Imposto de Renda de Pessoa Física (IRPF)**.

### Características Chave:
* **Privacidade Total**: Sem servidores ou banco de dados externo. O usuário tem controle completo de seus dados.
* **Cálculo Progressivo Marginal de IRPF**: Diferente de calculadoras simples, este app calcula a alíquota de imposto *apenas* sobre o ganho extra com base no salário CLT fixo cadastrado.
* **Sincronização Física Automática**: Utiliza APIs de ponta para salvar arquivos em disco na máquina local do usuário automaticamente.

---

## 2. Stack Tecnológica
* **Estrutura**: HTML5 Semântico com componentes estruturados.
* **Visual**: CSS3 Vanilla com variáveis dinâmicas, Glassmorphism, e animações de estado.
* **Lógica**: JavaScript Vanilla (ES6+) orientado a objetos (classes `TransactionManager` e `TaskManager`).
* **Banco de Dados Local**: `localStorage` (para persistência de estado do navegador) e `IndexedDB` (para persistência de caminhos físicos).
* **Biblioteca de Ícones**: Lucide Icons.
* **Tipografia**: Google Fonts (Inter).

---

## 3. Arquitetura e Modelagem de Dados

O fluxo e o ciclo de dados da aplicação são baseados nos esquemas (Single Source of Truth) definidos no diretório de desenvolvimento:
1. **[local_storage_schema.json](../schema/local_storage_schema.json)**: Estrutura do `localStorage`.
2. **[spreadsheet_schema.json](../schema/spreadsheet_schema.json)**: Estrutura física das planilhas em disco.

### Entidades Principais:
#### Transação (Lançamento):
```typescript
interface Transaction {
  id: number;           // Timestamp de criação
  type: 'service' | 'sale' | 'other';
  description: string;  // Descrição do serviço/peça
  client: string;       // Nome do cliente
  value: number;        // Valor bruto recebido
  cost: number;         // Custo de peças ou materiais (abatido no lucro)
  date: string;         // Formato YYYY-MM-DD
}
```

#### Tarefa (Goal):
```typescript
interface Task {
  id: number;
  text: string;
  completed: boolean;
}
```

---

## 4. Detalhamento de Funcionalidades Ativas

### 4.1. Lançamentos Inteligentes
O formulário de lançamentos diferencia dinamicamente os tipos de transação:
* **Serviço**: Exige valor e custos de materiais (ex: licenças, combustível) para abater do lucro tributável.
* **Venda**: Calcula automaticamente o lucro líquido (Valor da Venda - Custo da Peça) para compor a receita.
* **Outros**: Entradas neutras não tributáveis (empréstimos, reembolsos puros).

### 4.2. Motor Tributário IRPF Progressivo
O sistema calcula o imposto com base no princípio do **imposto incremental**:
1. O usuário configura o seu **Salário Fixo CLT** (Base) no menu de configurações (salvo em `baseSalary`).
2. O sistema calcula o imposto devido *apenas* sobre o salário base: $Imposto_{base} = f(Salario_{base})$
3. O sistema soma a renda líquida tributável do mês corrente ao salário base e calcula o novo imposto: $Imposto_{total} = f(Salario_{base} + RendaExtra_{liquida})$
4. A reserva de imposto recomendada é a diferença marginal: $Reserva = Imposto_{total} - Imposto_{base}$
5. A fórmula de cálculo de imposto segue a tabela progressiva oficial do IRPF anual.

### 4.3. Monitor de Isenção Mensal
Uma barra de progresso visual dinamicamente sinaliza quão próximo o usuário está de ultrapassar a faixa de isenção mensal vigente de **R$ 2.259,20**.
* **< 70%**: Verde.
* **70% - 90%**: Amarelo (Sinal de atenção para declaração de Carnê-Leão).
* **> 90%**: Vermelho (Teto marginal de isenção atingido).

### 4.4. Sincronização Automatizada em Disco (File System Access API)
Para mitigar a volatilidade do `localStorage`, o sistema permite vincular uma pasta física local (normalmente a pasta `/data/` do projeto).
* **Armazenamento de Token**: O ponteiro da pasta (`FileSystemDirectoryHandle`) é salvo no `IndexedDB` local.
* **Ciclo de Permissões**: Devido à segurança do navegador, em novas sessões de uso o ícone de sincronização piscará em amarelo ("Ativar Sincronização"). Um clique reativa o canal instantaneamente sem necessidade de selecionar a pasta novamente.
* **Geração Paralela**: Em cada evento de salvamento (`save()`), o sistema gera e substitui dois arquivos na pasta vinculada:
  1. `/data/lancamentos.json` (Estruturado para backups rápidos)
  2. `/data/lancamentos.csv` (Estruturado como planilha separada por vírgulas para abertura direta no Microsoft Excel, LibreOffice Calc ou Google Planilhas).

### 4.5. Sistema de Backup Robusto com Validação de Esquema
O app inclui um sistema de exportação/importação física em formato JSON.
* **Exportação**: Gera um download instantâneo compactado com as chaves de transações e tarefas.
* **Importação Segura**: Incorpora o validador `validateBackupData()`. Se um arquivo malicioso ou corrompido for inserido, o sistema rejeita a alteração, alertando o usuário e impedindo a corrupção do banco de dados local.

---

## 5. Protocolo de Segurança e Git
Como o projeto lida com dados financeiros reais e pessoais, a segurança foi priorizada:
1. **Segurança de Código Aberto**: O arquivo `.gitignore` bloqueia ativamente o envio acidental de arquivos gerados em `/data/` (`*.json`, `*.csv`) e arquivos de backup gerais (`backup_*.json`) para o GitHub público.
2. **Separação de Escopo**: O manual instrui que o desenvolvimento e testes do desenvolvedor rodem sob protocolo local (`http://localhost`), mantendo os dados de produção seguros e isolados quando o app é aberto por arquivo direto (`file:///`).
