# Controle de Renda Extra - Lucio Danilo

Este é um sistema simples e eficiente para controle de serviços de informática e revenda de equipamentos, focado em facilitar a declaração de imposto de renda.

## Funcionalidades
- **Registro de Serviços**: Controle de mão de obra (formatações, instalações, etc).
- **Registro de Vendas**: Controle de revenda com cálculo automático de lucro.
- **Dashboard em Tempo Real**: Visualize sua receita mensal e lucros instantaneamente.
- **Histórico Completo**: Acompanhe todos os lançamentos realizados.
- **Exportação CSV**: Gere relatórios para facilitar o preenchimento no app da Receita Federal.
- **Persistência Local**: Seus dados ficam salvos no seu navegador.

## Como usar
1. **Uso Pessoal**: Basta abrir o arquivo `index.html` em seu navegador principal (URL iniciada com `file:///`). Seus lançamentos oficiais ficam gravados no banco de dados do seu navegador local.
2. **Desenvolvimento e Testes (Segurança)**: Se for alterar o código do aplicativo ou realizar testes, **não abra como arquivo local**. Rode um servidor web local (ex: com a extensão Live Server do VS Code ou executando `npx http-server` na pasta) para abrir em `http://localhost`. Isso isola completamente os dados de teste do seu banco pessoal.
3. **Backup Físico**: Sempre que desejar, utilize o botão de **Backup** no rodapé do aplicativo para fazer download dos seus dados em um arquivo `.json` criptografado e seguro em sua máquina.

## Tecnologias
- HTML5 Semântico
- CSS3 (Variáveis, Grid, Flexbox, Glassmorphism)
- JavaScript Vanilla (Orientação a Objetos)
- Lucide Icons
- Google Fonts (Inter)
- **File System Access API** (gravação direta opcional na pasta `/data/`)

## Licença
Este projeto está sob a licença **MIT** - consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---
Para informações técnicas detalhadas, arquitetura e guia de funcionalidades, consulte a [Documentação Completa](DOCUMENTACAO.md).

