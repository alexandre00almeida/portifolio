document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const menuBtn = document.getElementById('menu-btn');

    if (sidebar && overlay && menuBtn) {
        function openSidebar() {
            sidebar.classList.add('open');
            overlay.classList.add('visible');
            menuBtn.setAttribute('aria-expanded', 'true');
            menuBtn.innerHTML = '✕ Fechar';
        }
        function closeSidebar() {
            sidebar.classList.remove('open');
            overlay.classList.remove('visible');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.innerHTML = '☰ Menu';
        }
        menuBtn.addEventListener('click', () =>
            sidebar.classList.contains('open') ? closeSidebar() : openSidebar()
        );
        overlay.addEventListener('click', closeSidebar);
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar(); });
    }

    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H;

        function resize() {
            W = canvas.width  = window.innerWidth;
            H = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        const PARTICLE_COUNT = 22;
        const particles = [];

        class Particle {
            constructor() { this.reset(true); }

            reset(initial = false) {
                const edge = Math.floor(Math.random() * 4);
                if (edge === 0)      { this.x = Math.random() * W; this.y = initial ? Math.random() * H : -60; }
                else if (edge === 1) { this.x = Math.random() * W; this.y = H + 60; }
                else if (edge === 2) { this.x = -60;  this.y = Math.random() * H; }
                else                 { this.x = W+60; this.y = Math.random() * H; }

                const tx = Math.random() * W;
                const ty = Math.random() * H;
                const dx = tx - this.x;
                const dy = ty - this.y;
                const dist = Math.sqrt(dx*dx + dy*dy) || 1;
                const speed = 0.5 + Math.random() * 0.8;

                this.vx = (dx / dist) * speed;
                this.vy = (dy / dist) * speed;
                this.radius  = 13 + Math.random() * 22;
                this.alpha   = 0.10 + Math.random() * 0.20;
                this.life    = 0;
                this.maxLife = 260 + Math.random() * 200;

                const r = 215 + Math.floor(Math.random() * 40);
                const g = 25  + Math.floor(Math.random() * 30);
                const b = 25  + Math.floor(Math.random() * 30);
                this.color = `rgb(${r},${g},${b})`;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life++;
                if (this.life > this.maxLife) this.reset();
            }

            draw() {
                const t = this.life / this.maxLife;
                const fade = t < 0.12 ? t / 0.12 : t > 0.88 ? (1 - t) / 0.12 : 1;
                ctx.save();
                ctx.globalAlpha = this.alpha * fade;
                ctx.beginPath();
                ctx.ellipse(
                    this.x, this.y,
                    this.radius,
                    this.radius * (0.52 + Math.random() * 0.08),
                    this.life * 0.01,
                    0, Math.PI * 2
                );
                ctx.fillStyle   = this.color;
                ctx.shadowColor = this.color;
                ctx.shadowBlur  = 16;
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = new Particle();
            p.x = Math.random() * W;
            p.y = Math.random() * H;
            particles.push(p);
        }

        function loop() {
            ctx.clearRect(0, 0, W, H);
            for (const p of particles) { p.update(); p.draw(); }
            requestAnimationFrame(loop);
        }
        loop();
    }

    const form = document.getElementById("form-contato");
    const feedbackContainer = document.getElementById("feedback-mensagem");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const nome     = document.getElementById("nome").value.trim();
            const email    = document.getElementById("email").value.trim();
            const mensagem = document.getElementById("mensagem").value.trim();

            if (!nome || !email || !mensagem) {
                mostrarFeedback("Preencha todos os campos, por favor.", "erro");
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                mostrarFeedback("Insira um e-mail válido.", "erro");
                return;
            }
            mostrarFeedback(`Obrigado, ${nome}! Mensagem enviada com sucesso.`, "sucesso");
            form.reset();
        });
    }

    function mostrarFeedback(texto, tipo) {
        if (!feedbackContainer) return;
        feedbackContainer.innerHTML = "";
        const el = document.createElement("div");
        el.textContent = texto;
        el.className   = tipo === "sucesso" ? "alerta-sucesso" : "alerta-erro";
        feedbackContainer.appendChild(el);
        setTimeout(() => el.remove(), 5000);
    }

    const btnCalcular = document.getElementById("btn-calcular");
    if (btnCalcular) {
        btnCalcular.addEventListener("click", () => {
            const num1 = parseFloat(document.getElementById("num1").value);
            const num2 = parseFloat(document.getElementById("num2").value);
            const op   = document.getElementById("operacao").value;
            const painel = document.getElementById("resultado-calculadora");

            if (isNaN(num1) || isNaN(num2)) {
                painel.textContent = "Erro: Digite apenas números válidos.";
                painel.style.color = "var(--accent)";
                return;
            }

            let resultado;
            if      (op === '+') resultado = num1 + num2;
            else if (op === '-') resultado = num1 - num2;
            else if (op === '*') resultado = num1 * num2;
            else if (op === '/') {
                if (num2 === 0) { painel.textContent = "Erro: Impossível dividir por zero."; painel.style.color = "var(--accent)"; return; }
                resultado = num1 / num2;
            }

            painel.textContent = `Resultado: ${resultado}`;
            painel.style.color = "#38bdf8";
        });
    }
});
