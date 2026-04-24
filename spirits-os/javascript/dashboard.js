(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", initDashboardPage);

  function initDashboardPage() {
    const liveClock = document.getElementById("liveClock");
    const todayDate = document.getElementById("todayDate");
    const dayName = document.getElementById("dayName");

    const quickActionBtn = document.getElementById("quickActionBtn");
    const quickActionMenu = document.getElementById("quickActionMenu");

    const revenueCanvas = document.getElementById("revenueChart");
    const inventoryCanvas = document.getElementById("inventoryChart");

    updateDateTime();
    window.setInterval(updateDateTime, 1000);

    bindQuickAction();
    drawAllCharts();

    let resizeTimer = null;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(drawAllCharts, 120);
    });

    function updateDateTime() {
      const now = new Date();

      if (liveClock) {
        liveClock.textContent = now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        });
      }

      if (todayDate) {
        todayDate.textContent = now.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric"
        });
      }

      if (dayName) {
        dayName.textContent = now.toLocaleDateString("en-US", {
          weekday: "long"
        });
      }
    }

    function bindQuickAction() {
      if (!quickActionBtn || !quickActionMenu) return;

      quickActionBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        quickActionMenu.classList.toggle("show");
      });

      document.addEventListener("click", (event) => {
        const insideMenu = quickActionMenu.contains(event.target);
        const insideButton = quickActionBtn.contains(event.target);

        if (!insideMenu && !insideButton) {
          quickActionMenu.classList.remove("show");
        }
      });
    }

    function drawAllCharts() {
      drawRevenueChart();
      drawInventoryChart();
    }

    function setupCanvas(canvas, fallbackHeight = 260) {
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const width = Math.max(Math.floor(rect.width || canvas.clientWidth || canvas.parentElement?.clientWidth || 320), 320);
      const height = Math.max(Math.floor(rect.height || canvas.clientHeight || fallbackHeight), fallbackHeight);
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      return { ctx, width, height };
    }

    function drawSmoothLine(ctx, points, color) {
      if (!points.length) return;

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
          return;
        }

        const prev = points[index - 1];
        const cp1x = prev.x + (point.x - prev.x) / 2;
        const cp1y = prev.y;
        const cp2x = prev.x + (point.x - prev.x) / 2;
        const cp2y = point.y;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, point.x, point.y);
      });

      ctx.stroke();
    }

    function roundRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + width, y, x + width, y + height, radius);
      ctx.arcTo(x + width, y + height, x, y + height, radius);
      ctx.arcTo(x, y + height, x, y, radius);
      ctx.arcTo(x, y, x + width, y, radius);
      ctx.closePath();
    }

    function drawRevenueChart() {
      const canvasData = setupCanvas(revenueCanvas, 260);
      if (!canvasData) return;

      const { ctx, width, height } = canvasData;
      const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const revenue = [4000, 3200, 2200, 2800, 1900, 2200, 3500];
      const expenses = [2400, 1500, 10000, 4000, 4900, 3900, 4300];
      const maxValue = 10000;

      const padding = { top: 20, right: 16, bottom: 34, left: 42 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;

      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "#edf2f7";
      ctx.lineWidth = 1;

      for (let i = 0; i <= 4; i += 1) {
        const y = padding.top + (chartHeight / 4) * i;

        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();

        const value = Math.round(maxValue - (maxValue / 4) * i);
        ctx.fillStyle = "#9aa7ba";
        ctx.font = "11px Inter, Arial";
        ctx.fillText(String(value), 8, y + 4);
      }

      const pointsRevenue = revenue.map((value, index) => ({
        x: padding.left + (chartWidth / (labels.length - 1)) * index,
        y: padding.top + chartHeight - (value / maxValue) * chartHeight
      }));

      const pointsExpenses = expenses.map((value, index) => ({
        x: padding.left + (chartWidth / (labels.length - 1)) * index,
        y: padding.top + chartHeight - (value / maxValue) * chartHeight
      }));

      labels.forEach((label, index) => {
        const x = padding.left + (chartWidth / (labels.length - 1)) * index;
        ctx.fillStyle = "#9aa7ba";
        ctx.font = "11px Inter, Arial";
        ctx.fillText(label, x - 10, height - 10);
      });

      drawSmoothLine(ctx, pointsRevenue, "#10b981");
      drawSmoothLine(ctx, pointsExpenses, "#ff3b5f");
    }

    function drawInventoryChart() {
      const canvasData = setupCanvas(inventoryCanvas, 260);
      if (!canvasData) return;

      const { ctx, width, height } = canvasData;
      const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const values = [4000, 3000, 2000, 2800, 1900, 2400, 3500];
      const maxValue = 4000;

      const padding = { top: 20, right: 16, bottom: 34, left: 42 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;

      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "#edf2f7";
      ctx.lineWidth = 1;

      for (let i = 0; i <= 4; i += 1) {
        const y = padding.top + (chartHeight / 4) * i;

        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();

        const value = Math.round(maxValue - (maxValue / 4) * i);
        ctx.fillStyle = "#9aa7ba";
        ctx.font = "11px Inter, Arial";
        ctx.fillText(String(value), 8, y + 4);
      }

      const barSpace = chartWidth / labels.length;
      const barWidth = 18;

      labels.forEach((label, index) => {
        const x = padding.left + barSpace * index + (barSpace - barWidth) / 2;
        const barHeight = (values[index] / maxValue) * chartHeight;
        const y = padding.top + chartHeight - barHeight;

        ctx.fillStyle = "#19b778";
        roundRect(ctx, x, y, barWidth, barHeight, 9);
        ctx.fill();

        ctx.fillStyle = "#9aa7ba";
        ctx.font = "11px Inter, Arial";
        ctx.fillText(label, x - 1, height - 10);
      });
    }
  }
})();