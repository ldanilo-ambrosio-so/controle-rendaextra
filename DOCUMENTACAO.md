# Documentação do Renda+

## Visão geral

O Renda+ é um aplicativo estático para organização de renda extra. Foi pensado para pessoas que prestam serviços, fazem vendas ocasionais ou querem acompanhar entradas e custos sem uma rotina financeira complexa.

Não há cadastro, servidor nem envio automático de dados: o uso acontece no navegador da própria pessoa.

## Funcionalidades

- Lançamento rápido de serviço, venda ou item não tributável.
- Campo de custo para calcular lucro de vendas e considerar gastos informados nos serviços.
- Dashboard com recebido no mês, valor a receber (preparado para evolução), sugestão de reserva, gráfico de fluxo de caixa e tarefas.
- Resumo anual e histórico dos lançamentos.
- Exportação de CSV em português.
- Backup manual em JSON e importação de backup.
- Vínculo opcional de uma pasta para gravação automática de JSON e CSV.

## Como funciona a sugestão de reserva

O aplicativo não calcula uma guia oficial nem afirma se existe imposto devido. Ele produz uma sugestão mensal de organização financeira.

O cálculo atual:

1. Soma o salário bruto configurado à renda extra líquida do mês.
2. Considera, para a renda extra, os serviços menos seus custos e o lucro das vendas.
3. Estima o IRPF da renda consolidada e o IRPF apenas do salário.
4. Exibe a diferença como **Reserva sugerida**.

Para 2026, a função aplica a dedução simplificada mensal de R$ 607,20, a tabela progressiva mensal e a redução aplicável até R$ 7.350,00 de rendimentos mensais. Até R$ 5.000,00 de renda consolidada, a redução pode zerar a estimativa mensal.

A régua das configurações apenas mostra quando o salário mais a renda extra podem alcançar essas faixas. Ela não substitui a apuração oficial, pois o resultado pode mudar conforme origem dos recebimentos, retenções, outras rendas e deduções.

Referências oficiais: [tabelas do IRPF 2026](https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026) e [Carnê-Leão Web](https://www.gov.br/pt-br/servicos/apurar-carne-leao/).

## Dados e recuperação

Por padrão, os lançamentos e a configuração salarial usam o `localStorage` do navegador. Ao vincular uma pasta, o aplicativo grava também:

- `lancamentos.json`, com lançamentos, tarefas e salário;
- `lancamentos.csv`, para leitura em planilhas.

Ao selecionar novamente uma pasta que já contém `lancamentos.json`, o aplicativo restaura os dados dela. O vínculo de pasta requer navegador compatível com a File System Access API; Chrome, Edge e navegadores Chromium compatíveis normalmente oferecem suporte.

## Estrutura do projeto

- `index.html`: versão autossuficiente, pronta para abrir no navegador ou publicar na web.
- `styles.css`: fonte da estilização.
- `app.js`: fonte da lógica do aplicativo.
- `data/`: pasta vazia para dados escolhidos pelo usuário; arquivos pessoais nela não são versionados.
- `LICENSE`: licença MIT do projeto.

## Limites conhecidos

- O app não substitui o Carnê-Leão Web, a declaração anual ou orientação contábil.
- A origem do recebimento (pessoa física, pessoa jurídica ou exterior) ainda não é informada por lançamento; por isso, a sugestão deve ser usada apenas como referência geral.
- Em GitHub Pages, os dados permanecem no navegador de cada visitante. A publicação não cria sincronização online.
