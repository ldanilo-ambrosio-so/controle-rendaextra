# Documentação Completa: Controle de Renda Extra - MEI Tech

## 1. Visão Geral
O **Controle de Renda Extra** é um painel financeiro inteligente desenvolvido para profissionais que possuem uma renda fixa e realizam serviços de TI ou revenda de equipamentos de forma complementar. O sistema foi personalizado para o perfil **CPF (não MEI)**, com foco no monitoramento do Carnê-Leão e na preparação para a declaração anual de IRPF (Imposto de Renda Pessoa Física).

## 2. Arquitetura Técnica
A aplicação é uma **SPA (Single Page Application)** construída com tecnologias nativas ("Vanilla"), o que a torna extremamente rápida e independente de internet após o primeiro carregamento.

- **Frontend**: HTML5 Semântico e CSS3 com design *Glassmorphism* (moderno, com transparências e desfoques).
- **Lógica**: JavaScript ES6+ orientado a objetos, garantindo um código organizado e expansível.
- **Banco de Dados**: `localStorage` (os dados ficam guardados de forma privada no seu navegador).
- **Ícones**: Lucide Icons para uma interface visual intuitiva.

## 3. Estrutura do Projeto
- `index.html`: Interface principal, formulários e estrutura de dashboards.
- `styles.css`: Estilização completa, animações e responsividade.
- `app.js`: Cérebro do projeto, contendo as classes `TransactionManager` (finanças) e `TaskManager` (planejamento).
- `DOCUMENTACAO.md`: Este guia técnico e fiscal.
- `README.md`: Guia de início rápido.

## 4. Funcionalidades de Faturamento e Impostos

### 4.1 Dashboard de Inteligência Fiscal
- **Receita Bruta (Mês)**: Mostra o total recebido, com divisão visual entre Serviços e Vendas. Possui um popup de ajuda que explica a diferença entre lucro e "movimentação neutra" (reembolsos).
- **Monitor de Renda Extra (Mês)**: Monitora o teto de **R$ 2.259,20**. Se você ultrapassar este valor em um único mês, o sistema te alerta para a necessidade do Carnê-Leão mensal.
- **Reserva p/ Imposto (IRPF)**: Calcula automaticamente uma reserva de **27,5%** sobre o seu rendimento líquido (porque seu salário base de R$ 5.500 já te coloca na faixa máxima). O card é clicável e abre uma explicação detalhada sobre como e quando pagar esse imposto.

### 4.2 Resumo Consolidado Anual
Uma tabela automática que agrupa todos os ganhos do **Ano Atual** por mês. É a ferramenta principal para a declaração anual, separando o que foi serviço do que foi venda de mercadoria.

### 4.3 Gestão de Lançamentos
- **Tipos de Lançamento**: 
    - *Serviço*: Para mão de obra.
    - *Venda*: Para revenda de produtos.
    - *Outros (Não Tributável)*: Para empréstimos, reembolsos ou presentes (não entra no cálculo de imposto).
- **Campo de Custo**: Disponível para Serviços e Vendas, permitindo que você abata gastos com materiais ou peças, pagando imposto apenas sobre o que sobra ( lucro real).

## 5. Módulo de Planejamento
Área dedicada à organização de metas futuras. Permite adicionar tarefas como estudos técnicos ou desejos de compra. Possui sistema de "checklist" onde é possível riscar itens concluídos ou excluí-los.

## 6. Segurança e Proteção de Dados

### 6.1 Backup e Restauração
Localizados no topo do sistema:
- **Botão Backup**: Gera um arquivo `.json` com todos os seus dados. Salve este arquivo em uma pasta segura ou na nuvem.
- **Botão Importar**: Permite carregar um arquivo de backup caso você limpe o cache do navegador ou troque de computador.

### 6.2 Exportação CSV
Gera uma planilha compatível com Excel e Google Sheets para backup externo ou envio para um contador.

## 7. Guia Prático de Impostos (Resumo do Popup)

- **Como pagar**: Sempre via **DARF** (Documento de Arrecadação). Nunca por transferência direta.
- **Forma de Pagamento**: PIX (QR Code) ou código de barras no app do banco.
- **Isenção Mensal**: Se o extra do mês for menor que **R$ 2.259,20**, você não precisa pagar nada no mês; o imposto será pago apenas na Declaração de Ajuste Anual no ano seguinte.
- **Renda vs. Empréstimo**: Dinheiro emprestado não é tributável e deve ser lançado como "Outros" no sistema.

---
*Desenvolvido com foco em organização, tranquilidade fiscal e crescimento profissional.* 🚀
