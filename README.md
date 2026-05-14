# 📊 Meta Ads Performance Dashboard

Um dashboard de alta performance desenvolvido com **Dash (Python)** e **Plotly** para visualização e análise de métricas do Meta Business (Facebook/Instagram Ads).

## ✨ Funcionalidades

- **Métricas em Tempo Real**: Acompanhamento de CTR, CPC, Impressões e Gastos.
- **Visualização Dinâmica**: Gráficos interativos para análise de tendências.
- **Design Premium**: Interface otimizada para legibilidade e experiência do usuário (UX).
- **Integração Meta API**: Conexão direta com a API de Marketing do Meta.

## 🛠️ Tecnologias Utilizadas

- [Python](https://www.python.org/)
- [Dash](https://dash.plotly.com/)
- [Plotly](https://plotly.com/python/)
- [Pandas](https://pandas.pydata.org/)
- [Bootstrap](https://getbootstrap.com/)

## 🚀 Como Executar

### Pré-requisitos

- Python 3.9+
- Token de Acesso da API do Meta (Marketing API)

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/SEU_USUARIO/NOME_DO_REPO.git
   cd NOME_DO_REPO
   ```

2. Crie um ambiente virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # ou
   venv\Scripts\activate     # Windows
   ```

3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto com:
   ```env
   META_ACCESS_TOKEN=seu_token_aqui
   META_AD_ACCOUNT_ID=seu_id_aqui
   ```

5. Execute a aplicação:
   ```bash
   python app.py
   ```

## 🌐 Deploy na Vercel

Este projeto está configurado para deploy automático na Vercel. 
Certifique-se de configurar as **Environment Variables** no painel da Vercel antes do primeiro build.

---
Desenvolvido por [LuisG](https://github.com/LuisG)
