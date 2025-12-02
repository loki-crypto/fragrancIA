/* ==========================================================================
   LÓGICA DA BARRA DE NAVEGAÇÃO - VERSÃO CORRIGIDA
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initializeNavbar();
  checkUserAuth();
});

/**
 * Inicializa funcionalidades da navbar
 */
function initializeNavbar() {
  setupMobileMenu();
  setupScrollEffect();
  highlightActiveLink();
}

/**
 * Configura o menu mobile (hamburguer)
 */
function setupMobileMenu() {
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener("click", () => {
      mobileMenuToggle.classList.toggle("active");
      navLinks.classList.toggle("active");

      // Previne scroll do body quando menu está aberto
      document.body.style.overflow = navLinks.classList.contains("active")
        ? "hidden"
        : "";
    });

    // Fecha o menu ao clicar em um link
    const links = navLinks.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenuToggle.classList.remove("active");
        navLinks.classList.remove("active");
        document.body.style.overflow = "";
      });
    });

    // Fecha o menu ao clicar fora
    document.addEventListener("click", (e) => {
      if (
        !navLinks.contains(e.target) &&
        !mobileMenuToggle.contains(e.target) &&
        navLinks.classList.contains("active")
      ) {
        mobileMenuToggle.classList.remove("active");
        navLinks.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }
}

/**
 * Adiciona efeito ao scrollar (navbar compacta)
 */
function setupScrollEffect() {
  const navbar = document.querySelector(".navbar");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    // Adiciona sombra ao scrollar
    if (currentScrollY > 50) {
      navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.5)";
    } else {
      navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.3)";
    }

    lastScrollY = currentScrollY;
  });
}

/**
 * Destaca o link da página atual
 */
function highlightActiveLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach((link) => {
    // Ignora links que não são páginas (como âncoras #)
    if (link.getAttribute("href").startsWith("#")) {
      return;
    }

    const linkPath = new URL(link.href).pathname;

    if (linkPath === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/**
 * ===== CORREÇÃO: Verifica autenticação SEM redirecionar =====
 */
function checkUserAuth() {
  const user = localStorage.getItem("user");
  const userMenu = document.querySelector(".user-menu");

  if (user && userMenu) {
    try {
      const userData = JSON.parse(user);

      if (userData.loggedIn) {
        updateAuthenticatedUI(userData);
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
    }
  }
}

/**
 * Atualiza a UI para usuário autenticado
 * @param {Object} userData - Dados do usuário
 */
function updateAuthenticatedUI(userData) {
  const userAvatar = document.querySelector(".user-avatar");
  const userDropdown = document.querySelector(".user-dropdown");

  if (userAvatar && userData.name) {
    // Mostra iniciais do nome
    const initials = userData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    userAvatar.innerHTML = initials;
  }

  if (userDropdown) {
    // ===== CORREÇÃO: Determina o caminho correto baseado na localização atual =====
    const isInPagesFolder = window.location.pathname.includes("/pages/");
    const perfilPath = isInPagesFolder ? "perfil.html" : "pages/perfil.html";
    const favoritosPath = isInPagesFolder
      ? "favoritos.html"
      : "pages/favoritos.html";
    const historicoPath = isInPagesFolder
      ? "historico.html"
      : "pages/historico.html";

    // Atualiza menu dropdown para usuário logado
    userDropdown.innerHTML = `
            <a href="${perfilPath}">Meu Perfil</a>
            <a href="${favoritosPath}">Favoritos</a>
            <a href="${historicoPath}">Histórico</a>
            <a href="#" id="logout-btn">Sair</a>
        `;

    // Adiciona evento de logout
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", handleLogout);
    }
  }
}

/**
 * Manipula o logout do usuário
 * @param {Event} e - Evento de clique
 */
function handleLogout(e) {
  e.preventDefault();

  // Confirma logout
  if (confirm("Deseja realmente sair?")) {
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");

    // ===== CORREÇÃO: Redireciona corretamente baseado na localização =====
    const isInPagesFolder = window.location.pathname.includes("/pages/");
    const indexPath = isInPagesFolder ? "../index.html" : "index.html";

    window.location.href = indexPath;
  }
}

/**
 * Smooth scroll para links âncora
 */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    // Ignora links vazios (#) ou que não são âncoras
    if (href === "#" || !href.startsWith("#")) return;

    e.preventDefault();

    const target = document.querySelector(href);
    if (target) {
      const navbarHeight = document.querySelector(".navbar").offsetHeight;
      const targetPosition = target.offsetTop - navbarHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});
