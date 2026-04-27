# 🧪 TODO_TEST — Guia de Testes Automáticos

Este documento serve como guia para a execução e expansão dos testes automáticos do ExamPT.

## 🚀 Como Executar os Testes

Os testes E2E (End-to-End) são geridos pelo **Playwright** dentro da pasta `frontend`.

### 1. Correr todos os testes (Headless)
Executa os testes em todos os browsers configurados (Chromium, Firefox, Webkit) em segundo plano.
```powershell
cd frontend
npx playwright test
```

### 2. Correr apenas em Chromium (Mais rápido)
```powershell
cd frontend
npx playwright test --project=chromium
```

### 3. Modo Interface Gráfica (UI Mode) — RECOMENDADO
Abre uma interface onde podes ver o browser a trabalhar, fazer debug e ver o histórico de cada passo.
```powershell
cd frontend
npx playwright test --ui
```

### 4. Ver o Relatório de Erros
Se algum teste falhar, podes ver o relatório detalhado com screenshots e vídeos:
```powershell
cd frontend
npx playwright show-report
```

---

## 🛠️ Testes Implementados (V1)
- [x] **Landing Page:** Verifica se o site carrega e a marca "ExamPT" é visível.
- [x] **Navegação Auth:** Garante que os links entre Home, Login e Registo funcionam.
- [x] **Mobile Check:** Verifica se o site é responsivo (configurado no `playwright.config.ts`).

---

## 📝 Sugestões para o Futuro (To-Do)

### 1. Fluxo de Exercícios (Prioridade Alta)
- [ ] Criar um teste que faz login com um utilizador de teste.
- [ ] Selecionar uma disciplina e responder a uma pergunta.
- [ ] Verificar se o XP aumenta no final.

### 2. Fluxo Premium
- [ ] Simular a jornada de um utilizador Free a tentar aceder a um PDF.
- [ ] Verificar se o modal/página de Premium aparece.
- [ ] Simular o clique no checkout do Stripe.

### 3. Perfil e Gamificação
- [ ] Testar a mudança de Nick no perfil.
- [ ] Verificar se os Badges (conquistas) aparecem corretamente.

### 4. Testes de Unidade (Backend)
- [ ] Criar testes para o `AttemptsService` para validar a lógica de cálculo de XP e Streaks sem precisar de browser.

---

## 💡 Dicas para escrever novos testes
- Usa o comando `npx playwright codegen https://exampt.vercel.app` para gerar código de teste automaticamente enquanto navegas no site!
- Prefere sempre `page.getByRole` ou `page.getByText` para garantir que os testes são acessíveis.
- Se o site mudar, atualiza as labels neste guia.
