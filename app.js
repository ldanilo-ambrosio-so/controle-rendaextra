// App logic for Controle de Lançamentos

class TransactionManager {
  constructor() {
    this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    this.form = document.getElementById("launchForm");
    this.typeSelect = document.getElementById("type");
    this.costGroup = document.getElementById("costGroup");
    this.recordsBody = document.getElementById("recordsBody");
    this.annualSummaryBody = document.getElementById("annualSummaryBody");
    this.annualSummaryFoot = document.getElementById("annualSummaryFoot");

    // Base Salary configuration
    this.baseSalary = parseFloat(localStorage.getItem("baseSalary")) || 5500.0;

    // Folder sync configuration
    this.dirHandle = null;

    this.init();
    this.loadDirectoryHandle();
  }

  init() {
    this.setupEventListeners();
    this.updateCostVisibility(); // Configura o estado inicial do campo de custo
    this.render();
    this.setDefaultDate();
  }

  updateCostVisibility() {
    const type = this.typeSelect.value;
    const isOther = type === "other";
    this.costGroup.style.display = isOther ? "none" : "flex";

    if (!isOther) {
      document.getElementById("cost").placeholder =
        type === "sale" ? "Custo da peça" : "Gastos c/ materiais";
    }
  }

  setupEventListeners() {
    // Toggle cost input based on type
    this.typeSelect.addEventListener("change", () => {
      this.updateCostVisibility();
    });

    // Form submission
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addTransaction();
    });

    // Export button
    document.getElementById("btnExport").addEventListener("click", () => {
      this.exportToCSV();
    });

    // Global Backup & Restore
    document.getElementById("btnBackup").addEventListener("click", () => {
      this.downloadBackup();
    });

    document.getElementById("btnRestore").addEventListener("click", () => {
      document.getElementById("fileImport").click();
    });

    document.getElementById("fileImport").addEventListener("change", (e) => {
      this.importBackup(e);
    });

    // Modal Help
    const modal = document.getElementById("taxModal");
    const card = document.getElementById("taxCard");
    const closeBtn = document.querySelector(".close-modal");

    card.addEventListener("click", () => {
      modal.style.display = "flex";
    });

    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });

    // Revenue Modal Help
    const revModal = document.getElementById("revenueModal");
    const revCard = document.getElementById("revenueCard");
    const revCloseBtn = document.querySelector(".close-modal-rev");

    revCard.addEventListener("click", () => {
      revModal.style.display = "flex";
    });

    revCloseBtn.addEventListener("click", () => {
      revModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === revModal) revModal.style.display = "none";
    });

    // Settings Modal
    const settingsModal = document.getElementById("settingsModal");
    const btnSettings = document.getElementById("btnSettings");
    const closeSettings = document.querySelector(".close-modal-settings");
    const settingsForm = document.getElementById("settingsForm");
    const baseSalaryInput = document.getElementById("baseSalaryInput");

    btnSettings.addEventListener("click", () => {
      baseSalaryInput.value = this.baseSalary;
      this.renderTaxRuler(this.baseSalary);
      settingsModal.style.display = "flex";
    });

    baseSalaryInput.addEventListener("input", () => {
      this.renderTaxRuler(parseFloat(baseSalaryInput.value) || 0);
    });

    closeSettings.addEventListener("click", () => {
      settingsModal.style.display = "none";
    });

    settingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.baseSalary = parseFloat(baseSalaryInput.value) || 0;
      localStorage.setItem("baseSalary", this.baseSalary);
      this.renderTaxRuler(this.baseSalary);
      settingsModal.style.display = "none";
      this.render();
      alert("Configurações salvas!");
    });

    window.addEventListener("click", (e) => {
      if (e.target === settingsModal) settingsModal.style.display = "none";
    });

    // Link Folder button
    document.getElementById("btnLinkFolder").addEventListener("click", () => {
      document.getElementById("folderModal").style.display = "flex";
    });

    const folderModal = document.getElementById("folderModal");
    document.querySelectorAll(".close-modal-folder").forEach((button) => {
      button.addEventListener("click", () => {
        folderModal.style.display = "none";
      });
    });
    document.getElementById("btnChooseFolder").addEventListener("click", () => {
      folderModal.style.display = "none";
      this.linkLocalFolder();
    });
    window.addEventListener("click", (e) => {
      if (e.target === folderModal) folderModal.style.display = "none";
    });
  }

  setDefaultDate() {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("date").value = today;
  }

  addTransaction() {
    const transaction = {
      id: Date.now(),
      type: document.getElementById("type").value,
      description: document.getElementById("description").value,
      client: document.getElementById("client").value,
      value: parseFloat(document.getElementById("value").value),
      cost: parseFloat(document.getElementById("cost").value) || 0,
      date: document.getElementById("date").value,
    };

    this.transactions.unshift(transaction);
    this.save();
    this.render();
    this.form.reset();
    this.setDefaultDate();
    this.costGroup.style.display = "none";

    // Re-init icons for new delete buttons
    if (window.lucide) lucide.createIcons();
  }

  deleteTransaction(id) {
    if (confirm("Deseja excluir este registro?")) {
      this.transactions = this.transactions.filter((t) => t.id !== id);
      this.save();
      this.render();
    }
  }

  save() {
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
    this.syncToLocalFolder();
  }

  formatCurrency(value) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  transactionTypeLabel(type) {
    return (
      {
        service: "Serviço",
        sale: "Venda",
        other: "Não tributável",
      }[type] || type
    );
  }

  csvEscape(value) {
    return `"${String(value ?? "").replace(/"/g, '""')}"`;
  }

  generateCSV() {
    const headers = [
      "Data",
      "Tipo",
      "Descrição",
      "Cliente",
      "Valor",
      "Custo",
      "Lucro",
    ];
    const rows = this.transactions.map((t) => [
      t.date,
      this.transactionTypeLabel(t.type),
      t.description,
      t.client,
      t.value,
      t.cost,
      t.type === "sale" ? t.value - t.cost : t.value,
    ]);
    return [headers, ...rows]
      .map((row) => row.map((value) => this.csvEscape(value)).join(","))
      .join("\n");
  }

  calculateIRPF(income) {
    const grossIncome = Math.max(0, income);
    const calculationBase = Math.max(0, grossIncome - 607.2);
    let taxBeforeReduction = 0;

    if (calculationBase <= 2428.8) taxBeforeReduction = 0;
    else if (calculationBase <= 2826.65)
      taxBeforeReduction = calculationBase * 0.075 - 182.16;
    else if (calculationBase <= 3751.05)
      taxBeforeReduction = calculationBase * 0.15 - 394.16;
    else if (calculationBase <= 4664.68)
      taxBeforeReduction = calculationBase * 0.225 - 675.49;
    else taxBeforeReduction = calculationBase * 0.275 - 908.73;

    const reduction =
      grossIncome <= 5000
        ? taxBeforeReduction
        : grossIncome <= 7350
          ? Math.max(0, 978.62 - 0.133145 * grossIncome)
          : 0;
    return Math.max(0, taxBeforeReduction - reduction);
  }

  renderTaxRuler(salary) {
    const marker = document.getElementById("taxRulerMarker");
    const income = document.getElementById("taxRulerIncome");
    const message = document.getElementById("taxRulerMessage");
    if (!marker || !income || !message) return;

    const position = Math.min(100, (Math.max(0, salary) / 9000) * 100);
    marker.style.left = `${position}%`;
    income.textContent = this.formatCurrency(salary);
    if (salary < 5000) {
      message.textContent = `Com este salário, a sugestão tende a começar quando a renda extra do mês passar de ${this.formatCurrency(5000 - salary)}.`;
    } else if (salary < 7350) {
      message.textContent =
        "Seu salário já está na faixa de redução parcial; a renda extra pode aumentar a sugestão de reserva.";
    } else {
      message.textContent =
        "Seu salário já está acima da faixa de redução especial; a renda extra pode aumentar a sugestão de reserva.";
    }
  }

  calculateMetrics() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthTransactions = this.transactions.filter((t) => {
      const d = new Date(t.date + "T00:00:00");
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const yearlyTransactions = this.transactions.filter((t) => {
      const d = new Date(t.date + "T00:00:00");
      return d.getFullYear() === currentYear;
    });

    const monthlyRevenue = currentMonthTransactions.reduce(
      (acc, t) => acc + t.value,
      0,
    );

    // Income strictly from services (already minus their specific costs)
    const netServices = currentMonthTransactions
      .filter((t) => t.type === "service")
      .reduce((acc, t) => acc + (t.value - t.cost), 0);

    const monthlyServicesGross = currentMonthTransactions
      .filter((t) => t.type === "service")
      .reduce((acc, t) => acc + t.value, 0);

    const monthlySalesGross = currentMonthTransactions
      .filter((t) => t.type === "sale")
      .reduce((acc, t) => acc + t.value, 0);

    const yearlyRevenue = yearlyTransactions.reduce(
      (acc, t) => acc + t.value,
      0,
    );

    const salesProfit = currentMonthTransactions
      .filter((t) => t.type === "sale")
      .reduce((acc, t) => acc + (t.value - t.cost), 0);

    return {
      monthlyRevenue,
      monthlyServices: monthlyServicesGross,
      monthlySales: monthlySalesGross,
      yearlyRevenue,
      salesProfit,
      taxableIncome: netServices + salesProfit,
    };
  }

  render() {
    // Update Metrics
    const {
      monthlyRevenue,
      monthlyServices,
      monthlySales,
      yearlyRevenue,
      salesProfit,
      taxableIncome,
    } = this.calculateMetrics();
    document.getElementById("monthlyRevenue").textContent =
      this.formatCurrency(monthlyRevenue);
    document.getElementById("splitServices").textContent =
      this.formatCurrency(monthlyServices);
    document.getElementById("splitSales").textContent =
      this.formatCurrency(monthlySales);

    document.getElementById("extraMonthlyRevenue").textContent =
      this.formatCurrency(monthlyRevenue);

    // Reserva de Imposto (Cálculo Progressivo Marginal)
    const taxWithExtra = this.calculateIRPF(this.baseSalary + taxableIncome);
    const taxOnlyBase = this.calculateIRPF(this.baseSalary);
    const estimativeTax = Math.max(0, taxWithExtra - taxOnlyBase);
    const consolidatedIncome = this.baseSalary + taxableIncome;

    document.getElementById("taxReserve").textContent =
      this.formatCurrency(estimativeTax);

    // Update texts in UI
    const effectiveRate =
      taxableIncome > 0
        ? ((estimativeTax / taxableIncome) * 100).toFixed(1)
        : 0;
    document.getElementById("taxExplanation").textContent =
      estimativeTax === 0
        ? "Renda mensal consolidada abaixo da faixa de IR"
        : `Sugestão aproximada de ~${effectiveRate}% sobre o extra`;
    document.getElementById("taxModalDesc").innerHTML =
      estimativeTax === 0
        ? `Pela estimativa de 2026, sua renda mensal consolidada de <strong>${this.formatCurrency(consolidatedIncome)}</strong> está dentro da faixa de redução que pode zerar o imposto mensal até R$ 5.000,00. Registre os valores normalmente: o ajuste anual pode considerar outras rendas e deduções.`
        : `Esta é uma <strong>sugestão de reserva</strong> baseada na renda mensal consolidada de <strong>${this.formatCurrency(consolidatedIncome)}</strong>. Ela usa a tabela de 2026 e a redução mensal aplicável, mas não substitui a apuração oficial.`;

    // "A receber" será alimentado quando o campo de situação for incluído.
    document.getElementById("extraMonthlyRevenue").textContent =
      this.formatCurrency(0);
    document.getElementById("limitInfo").textContent =
      "Nenhum pagamento pendente";

    // Update Annual Summary
    this.renderAnnualSummary();
    this.renderCashFlowChart();

    // Update Table
    this.recordsBody.innerHTML = "";
    this.transactions.forEach((t) => {
      const tr = document.createElement("tr");
      const dateObj = new Date(t.date + "T00:00:00");
      const formattedDate = dateObj.toLocaleDateString("pt-BR");

      const profit = t.type === "sale" ? t.value - t.cost : 0;
      const extraInfo =
        t.type === "sale"
          ? `<small style="color: var(--success)">Lucro: ${this.formatCurrency(profit)}</small>`
          : "-";

      tr.innerHTML = `
                <td>${formattedDate}</td>
                <td><span class="status-badge type-${t.type}">${t.type === "service" ? "Serviço" : t.type === "sale" ? "Venda" : "Outros"}</span></td>
                <td>${t.description}</td>
                <td>${t.client}</td>
                <td>${this.formatCurrency(t.value)}</td>
                <td>${extraInfo}</td>
                <td>
                    <button class="btn-delete-record" onclick="manager.deleteTransaction(${t.id})" aria-label="Excluir lançamento" title="Excluir lançamento">
                        <i data-lucide="trash-2"></i>
                    </button>
                </td>
            `;
      this.recordsBody.appendChild(tr);
    });

    if (window.lucide) lucide.createIcons();
  }

  renderCashFlowChart() {
    const container = document.getElementById("cashFlowChart");
    if (!container) return;

    const now = new Date();
    const points = Array.from({ length: 6 }, (_, reverseIndex) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - (5 - reverseIndex),
        1,
      );
      const monthTransactions = this.transactions.filter((t) => {
        const transactionDate = new Date(t.date + "T00:00:00");
        return (
          transactionDate.getMonth() === date.getMonth() &&
          transactionDate.getFullYear() === date.getFullYear()
        );
      });
      const revenue = monthTransactions.reduce((sum, t) => sum + t.value, 0);
      const costs = monthTransactions.reduce((sum, t) => sum + t.cost, 0);
      return {
        label: date
          .toLocaleDateString("pt-BR", { month: "short" })
          .replace(".", ""),
        revenue,
        costs,
        profit: revenue - costs,
      };
    });

    const maximum = Math.max(
      100,
      ...points.flatMap((point) => [point.revenue, point.costs, point.profit]),
    );
    const width = 720,
      height = 250,
      chartTop = 20,
      chartBottom = 207,
      chartLeft = 45,
      chartRight = 695;
    const baseline = chartBottom;
    const scaleY = (value) =>
      baseline - (value / maximum) * (baseline - chartTop);
    const xFor = (index) =>
      chartLeft + index * ((chartRight - chartLeft) / (points.length - 1));
    const barWidth = 24;
    const profitPoints = points
      .map((point, index) => `${xFor(index)},${scaleY(point.profit)}`)
      .join(" ");
    const grid = [0, 0.25, 0.5, 0.75, 1]
      .map((step) => {
        const y = scaleY(maximum * step);
        return `<line x1="${chartLeft}" y1="${y}" x2="${chartRight}" y2="${y}" class="chart-grid-line" />`;
      })
      .join("");
    const bars = points
      .map((point, index) => {
        const x = xFor(index);
        const revenueHeight = baseline - scaleY(point.revenue);
        const costHeight = baseline - scaleY(point.costs);
        return `<rect x="${x - barWidth - 3}" y="${scaleY(point.revenue)}" width="${barWidth}" height="${revenueHeight}" rx="4" class="chart-revenue-bar" />
                <rect x="${x + 3}" y="${scaleY(point.costs)}" width="${barWidth}" height="${costHeight}" rx="4" class="chart-cost-bar" />
                <text x="${x}" y="235" text-anchor="middle" class="chart-label">${point.label}</text>`;
      })
      .join("");
    const circles = points
      .map(
        (point, index) =>
          `<circle cx="${xFor(index)}" cy="${scaleY(point.profit)}" r="4" class="chart-profit-point" />`,
      )
      .join("");
    const emptyState =
      this.transactions.length === 0
        ? '<p class="chart-empty">Adicione lançamentos para ver sua evolução mensal.</p>'
        : "";
    container.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Receita, custos e lucro dos últimos seis meses">${grid}${bars}<polyline points="${profitPoints}" class="chart-profit-line" />${circles}</svg>${emptyState}`;
  }

  renderAnnualSummary() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    let annualTotals = { services: 0, sales: 0, revenue: 0, profit: 0 };
    this.annualSummaryBody.innerHTML = "";

    months.forEach((monthName, index) => {
      const monthlyData = this.transactions.filter((t) => {
        const d = new Date(t.date + "T00:00:00");
        return d.getMonth() === index && d.getFullYear() === currentYear;
      });

      const services = monthlyData
        .filter((t) => t.type === "service")
        .reduce((acc, t) => acc + t.value, 0);
      const sales = monthlyData
        .filter((t) => t.type === "sale")
        .reduce((acc, t) => acc + t.value, 0);
      const revenue = services + sales;
      const profit = monthlyData
        .filter((t) => t.type === "sale")
        .reduce((acc, t) => acc + (t.value - t.cost), 0);

      annualTotals.services += services;
      annualTotals.sales += sales;
      annualTotals.revenue += revenue;
      annualTotals.profit += profit;

      if (revenue > 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                    <td>${monthName}</td>
                    <td>${this.formatCurrency(services)}</td>
                    <td>${this.formatCurrency(sales)}</td>
                    <td><strong>${this.formatCurrency(revenue)}</strong></td>
                    <td>${this.formatCurrency(profit)}</td>
                `;
        this.annualSummaryBody.appendChild(tr);
      }
    });

    this.annualSummaryFoot.innerHTML = `
            <tr>
                <td><strong>TOTAL ANUAL</strong></td>
                <td>${this.formatCurrency(annualTotals.services)}</td>
                <td>${this.formatCurrency(annualTotals.sales)}</td>
                <td><strong>${this.formatCurrency(annualTotals.revenue)}</strong></td>
                <td>${this.formatCurrency(annualTotals.profit)}</td>
            </tr>
        `;
  }

  exportToCSV() {
    if (this.transactions.length === 0) {
      alert("Nenhum dado para exportar");
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," + encodeURIComponent(this.generateCSV());

    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute(
      "download",
      `controle_financeiro_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  downloadBackup() {
    const fullData = {
      transactions: this.transactions,
      tasks: typeof taskManager !== "undefined" ? taskManager.tasks : [],
      baseSalary: this.baseSalary,
    };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup_mei_tech_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  }

  validateBackupData(data) {
    if (!data || typeof data !== "object") return false;

    // Validate transactions if present
    if (data.transactions) {
      if (!Array.isArray(data.transactions)) return false;
      for (const t of data.transactions) {
        if (typeof t !== "object" || t === null) return false;
        // Essential fields
        if (
          t.id === undefined ||
          !t.type ||
          !t.description ||
          t.value === undefined
        )
          return false;
        if (!["service", "sale", "other"].includes(t.type)) return false;
      }
    }

    // Validate tasks if present
    if (data.tasks) {
      if (!Array.isArray(data.tasks)) return false;
      for (const task of data.tasks) {
        if (typeof task !== "object" || task === null) return false;
        if (
          task.id === undefined ||
          typeof task.text !== "string" ||
          task.completed === undefined
        )
          return false;
      }
    }

    return true;
  }

  importBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        // Validate data structure before saving to prevent corrupting local storage
        if (!this.validateBackupData(data)) {
          throw new Error(
            "O arquivo selecionado não é um backup de lançamentos válido ou contém dados corrompidos.",
          );
        }

        if (data.transactions) {
          this.transactions = data.transactions;
          this.save();
          this.render();
        }
        if (data.tasks && taskManager) {
          taskManager.tasks = data.tasks;
          taskManager.save();
          taskManager.render();
        }
        alert("Dados restaurados com sucesso!");
        window.location.reload(); // Refresh to ensure everything is synced
      } catch (err) {
        alert("Erro ao importar arquivo: " + err.message);
      }
      // Reset input so the user can import the same file again if they want
      event.target.value = "";
    };
    reader.readAsText(file);
  }

  // --- File System Access API (Option A) Helpers ---

  async getIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("RendaPlusDB", 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        db.createObjectStore("settings");
      };
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async storeDirectoryHandle(handle) {
    try {
      const db = await this.getIndexedDB();
      const tx = db.transaction("settings", "readwrite");
      tx.objectStore("settings").put(handle, "dirHandle");
      return new Promise((resolve) => (tx.oncomplete = resolve));
    } catch (e) {
      console.error("Erro ao salvar pasta no IndexedDB:", e);
    }
  }

  async loadDirectoryHandle() {
    try {
      const db = await this.getIndexedDB();
      const tx = db.transaction("settings", "readonly");
      const handle = await new Promise((resolve) => {
        const req = tx.objectStore("settings").get("dirHandle");
        req.onsuccess = () => resolve(req.result);
      });
      if (handle) {
        this.dirHandle = handle;
        const permission = await this.dirHandle.queryPermission({
          mode: "readwrite",
        });
        if (permission === "granted") {
          this.updateFolderStatus(true);
          await this.restoreFromLocalFolder();
          await this.syncToLocalFolder();
        } else {
          this.updateFolderStatus(false, "needs-permission");
        }
      } else {
        this.updateFolderStatus(false, "not-linked");
      }
    } catch (e) {
      console.error("Erro ao carregar pasta do IndexedDB:", e);
      this.updateFolderStatus(false, "not-linked");
    }
  }

  async linkLocalFolder() {
    try {
      // If already has handle but needs permission, we request permission first
      if (this.dirHandle) {
        const permission = await this.dirHandle.queryPermission({
          mode: "readwrite",
        });
        if (permission !== "granted") {
          const req = await this.dirHandle.requestPermission({
            mode: "readwrite",
          });
          if (req === "granted") {
            this.updateFolderStatus(true);
            const restored = await this.restoreFromLocalFolder();
            await this.syncToLocalFolder();
            alert(
              restored === null
                ? "Sincronização de pasta reativada com sucesso!"
                : `${restored} lançamento(s) recuperado(s) da pasta.`,
            );
            return;
          }
        }
      }

      // Otherwise, show directory picker
      const handle = await window.showDirectoryPicker({ mode: "readwrite" });
      this.dirHandle = handle;
      await this.storeDirectoryHandle(handle);
      this.updateFolderStatus(true);
      const restored = await this.restoreFromLocalFolder();
      await this.syncToLocalFolder();
      alert(
        restored === null
          ? "Pasta vinculada. Os próximos lançamentos serão salvos automaticamente nela."
          : `${restored} lançamento(s) recuperado(s) da pasta e sincronização ativada.`,
      );
    } catch (err) {
      console.error("Falha ao vincular pasta:", err);
      // Don't show alert if user simply cancelled the picker
      if (err.name !== "AbortError") {
        alert(
          "Não foi possível acessar a pasta selecionada. Certifique-se de conceder permissões de leitura/escrita.",
        );
      }
    }
  }

  updateFolderStatus(active, status = "") {
    const btn = document.getElementById("btnLinkFolder");
    const syncText = document.getElementById("syncText");

    if (!btn || !syncText) return;

    btn.className = "btn-folder"; // reset classes

    if (active) {
      btn.classList.add("active");
      btn.title = "Sincronização Ativa na pasta /data/ (Automático)";
      syncText.textContent = "Pasta vinculada";
    } else if (status === "needs-permission") {
      btn.classList.add("pending");
      btn.title =
        "Sincronização Pendente. Clique para conceder permissão ao navegador nesta sessão.";
      syncText.textContent = "Ativar pasta";
    } else {
      btn.title =
        "Clique para vincular a pasta '/data/' do seu projeto e salvar fisicamente seus dados.";
      syncText.textContent = "Vincular pasta";
    }
  }

  async restoreFromLocalFolder() {
    try {
      const jsonHandle = await this.dirHandle.getFileHandle("lancamentos.json");
      const savedData = JSON.parse(await (await jsonHandle.getFile()).text());
      const backup = Array.isArray(savedData)
        ? { transactions: savedData }
        : savedData;

      if (!this.validateBackupData(backup)) {
        throw new Error(
          "O arquivo lancamentos.json não possui um formato válido.",
        );
      }

      if (backup.transactions) {
        this.transactions = backup.transactions;
        localStorage.setItem("transactions", JSON.stringify(this.transactions));
      }
      if (backup.baseSalary !== undefined) {
        this.baseSalary = Number(backup.baseSalary) || 0;
        localStorage.setItem("baseSalary", this.baseSalary);
      }
      if (backup.tasks && typeof taskManager !== "undefined") {
        taskManager.tasks = backup.tasks;
        taskManager.save();
        taskManager.render();
      }
      this.render();
      return backup.transactions?.length || 0;
    } catch (err) {
      if (err.name === "NotFoundError") return null;
      throw err;
    }
  }

  async syncToLocalFolder() {
    if (!this.dirHandle) return;

    try {
      // 1. Write lancamentos.json
      const jsonHandle = await this.dirHandle.getFileHandle(
        "lancamentos.json",
        { create: true },
      );
      const jsonWritable = await jsonHandle.createWritable();
      const folderBackup = {
        version: 2,
        transactions: this.transactions,
        tasks: typeof taskManager !== "undefined" ? taskManager.tasks : [],
        baseSalary: this.baseSalary,
      };
      await jsonWritable.write(JSON.stringify(folderBackup, null, 2));
      await jsonWritable.close();

      // 2. Write lancamentos.csv
      const csvHandle = await this.dirHandle.getFileHandle("lancamentos.csv", {
        create: true,
      });
      const csvWritable = await csvHandle.createWritable();

      await csvWritable.write(this.generateCSV());
      await csvWritable.close();

      console.log(
        "Sucesso: lancamentos.json e lancamentos.csv atualizados na pasta /data/!",
      );
    } catch (err) {
      console.error("Erro na sincronização automática em disco:", err);
      // If the write failed due to permissions, update status so user can re-trigger it
      if (err.name === "NotAllowedError") {
        this.updateFolderStatus(false, "needs-permission");
      }
    }
  }
}

class TaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    this.taskForm = document.getElementById("taskForm");
    this.taskInput = document.getElementById("taskInput");
    this.taskList = document.getElementById("taskList");

    this.init();
  }

  init() {
    this.taskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addTask();
    });

    this.render();
  }

  addTask() {
    const text = this.taskInput.value.trim();
    if (!text) return;

    const task = {
      id: Date.now(),
      text: text,
      completed: false,
    };

    this.tasks.push(task);
    this.save();
    this.render();
    this.taskInput.value = "";
  }

  toggleTask(id) {
    this.tasks = this.tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
    this.save();
    this.render();
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.save();
    this.render();
  }

  save() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
    if (typeof manager !== "undefined" && manager.dirHandle) {
      manager.syncToLocalFolder();
    }
  }

  render() {
    this.taskList.innerHTML = "";
    this.tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = `task-item ${task.completed ? "completed" : ""}`;
      li.innerHTML = `
                <div class="task-content" onclick="taskManager.toggleTask(${task.id})">
                    <div class="task-checkbox">
                        <i data-lucide="check" style="width: 14px; height: 14px;"></i>
                    </div>
                    <span class="task-text">${task.text}</span>
                </div>
                <button class="btn-delete-task" onclick="taskManager.deleteTask(${task.id})">
                    <i data-lucide="x" style="width: 18px; height: 18px;"></i>
                </button>
            `;
      this.taskList.appendChild(li);
    });

    if (window.lucide) lucide.createIcons();
  }
}

// Global instances
const manager = new TransactionManager();
const taskManager = new TaskManager();
