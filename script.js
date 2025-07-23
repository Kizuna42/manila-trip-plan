// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function () {
  // ===============================
  // スムーズスクロール機能
  // ===============================
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const navHeight = document.querySelector('.nav-sticky').offsetHeight;
        const targetPosition = targetElement.offsetTop - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });

        // アクティブリンクの更新
        updateActiveNavLink(this);
      }
    });
  });

  // ===============================
  // 日程カードの展開/折りたたみ機能
  // ===============================
  const dayCards = document.querySelectorAll('.day-card');

  dayCards.forEach(card => {
    const header = card.querySelector('.day-header');
    const content = card.querySelector('.day-content');
    const toggleBtn = card.querySelector('.toggle-btn');

    header.addEventListener('click', function () {
      const isActive = content.classList.contains('active');

      // 他のカードを閉じる（アコーディオン式）
      dayCards.forEach(otherCard => {
        if (otherCard !== card) {
          const otherContent = otherCard.querySelector('.day-content');
          const otherToggleBtn = otherCard.querySelector('.toggle-btn');

          otherContent.classList.remove('active');
          otherToggleBtn.classList.remove('active');
        }
      });

      // 現在のカードの状態を切り替え
      if (isActive) {
        content.classList.remove('active');
        toggleBtn.classList.remove('active');
      } else {
        content.classList.add('active');
        toggleBtn.classList.add('active');

        // コンテンツが表示されたら、そこまでスクロール
        setTimeout(() => {
          const cardPosition = card.offsetTop - 100;
          window.scrollTo({
            top: cardPosition,
            behavior: 'smooth',
          });
        }, 300);
      }
    });
  });

  // ===============================
  // スクロール時のナビゲーション固定とアクティブリンク更新
  // ===============================
  const nav = document.querySelector('.nav-sticky');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', function () {
    // ナビゲーションの背景透明度調整
    const scrollY = window.scrollY;
    if (scrollY > 100) {
      nav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      nav.style.backdropFilter = 'blur(10px)';
    } else {
      nav.style.backgroundColor = '#ffffff';
      nav.style.backdropFilter = 'none';
    }

    // アクティブセクションの判定とナビリンクの更新
    let currentSection = '';
    const navHeight = nav.offsetHeight;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - navHeight - 50;
      const sectionHeight = section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    // ナビリンクのアクティブ状態更新
    navLinks.forEach(link => {
      const href = link.getAttribute('href').substring(1);
      if (href === currentSection) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });

  // ===============================
  // ページトップボタン（オプション）
  // ===============================
  const scrollToTopBtn = createScrollToTopButton();

  window.addEventListener('scroll', function () {
    if (window.scrollY > 500) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });

  // ===============================
  // 画像の遅延読み込み（オプション）
  // ===============================
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ===============================
  // カードのホバーエフェクト強化
  // ===============================
  const cards = document.querySelectorAll(
    '.phase-card, .prep-card, .choice-card, .ref-card'
  );

  cards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // ===============================
  // タイムラインアニメーション
  // ===============================
  const timelineItems = document.querySelectorAll('.timeline-item');

  const timelineObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }
      });
    },
    { threshold: 0.1 }
  );

  timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    timelineObserver.observe(item);
  });

  // ===============================
  // 選択カードのクリック機能
  // ===============================
  const choiceCards = document.querySelectorAll('.choice-card');

  choiceCards.forEach(card => {
    card.addEventListener('click', function () {
      // 選択状態をトグル
      choiceCards.forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');

      // 選択されたカードのスタイル更新
      updateChoiceCardStyles();
    });
  });

  // ===============================
  // モバイルメニューの処理
  // ===============================
  initializeMobileMenu();

  // ===============================
  // 初期化完了ログ
  // ===============================
  console.log('🌟 マニラ旅行プランサイト初期化完了！');
});

// ===============================
// ヘルパー関数
// ===============================

/**
 * アクティブナビリンクの更新
 */
function updateActiveNavLink(activeLink) {
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => link.classList.remove('active'));
  activeLink.classList.add('active');
}

/**
 * スクロールトップボタンの作成
 */
function createScrollToTopButton() {
  const button = document.createElement('button');
  button.innerHTML = '<i class="fas fa-chevron-up"></i>';
  button.className = 'scroll-to-top';
  button.setAttribute('aria-label', 'ページトップに戻る');

  // ボタンのスタイル
  const buttonStyles = `
        .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--gradient-primary);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            box-shadow: var(--shadow-lg);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .scroll-to-top:hover {
            transform: translateY(-3px);
            box-shadow: var(--shadow-xl);
        }
        
        @media (max-width: 768px) {
            .scroll-to-top {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
                font-size: 16px;
            }
        }
    `;

  // スタイルシートに追加
  if (!document.getElementById('scroll-to-top-styles')) {
    const style = document.createElement('style');
    style.id = 'scroll-to-top-styles';
    style.textContent = buttonStyles;
    document.head.appendChild(style);
  }

  button.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  document.body.appendChild(button);
  return button;
}

/**
 * 選択カードのスタイル更新
 */
function updateChoiceCardStyles() {
  const selectedCard = document.querySelector('.choice-card.selected');
  if (selectedCard) {
    selectedCard.style.transform = 'translateY(-10px) scale(1.05)';
    selectedCard.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';

    // 選択されていないカードのスタイル
    const otherCards = document.querySelectorAll('.choice-card:not(.selected)');
    otherCards.forEach(card => {
      card.style.opacity = '0.7';
      card.style.transform = 'translateY(0) scale(0.98)';
    });
  }
}

/**
 * モバイルメニューの処理
 */
function initializeMobileMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');
  const body = document.body;
  let isMenuOpen = false;

  // ハンバーガーメニューボタンのクリック処理
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      isMenuOpen = !isMenuOpen;

      if (isMenuOpen) {
        navMenu.classList.add('active');
        navToggle.classList.add('active');
        navToggle.setAttribute('aria-label', 'メニューを閉じる');
        body.style.overflow = 'hidden'; // スクロールを無効化
      } else {
        closeMenu();
      }
    });
  }

  // メニューリンクのクリック処理
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      // モバイルの場合はメニューを閉じる
      if (window.innerWidth <= 768) {
        closeMenu();

        // 少し遅延してからスクロール（メニューが閉じるアニメーションを待つ）
        setTimeout(() => {
          if (targetElement) {
            const navHeight =
              document.querySelector('.nav-sticky').offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight - 20;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth',
            });
          }
        }, 150);
      }
    });
  });

  // メニュー外をクリックした時の処理
  document.addEventListener('click', function (e) {
    if (
      isMenuOpen &&
      !navToggle.contains(e.target) &&
      !navMenu.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Escキーでメニューを閉じる
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  });

  // ウィンドウリサイズ時の処理
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && isMenuOpen) {
      closeMenu();
    }
  });

  // メニューを閉じる関数
  function closeMenu() {
    isMenuOpen = false;
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-label', 'メニューを開く');
    body.style.overflow = ''; // スクロールを有効化
  }
}

/**
 * 日程カードの自動展開（最初の未完了カード）
 */
function autoExpandFirstPendingDay() {
  const today = new Date();
  const startDate = new Date('2025-08-18'); // 旅行開始日
  const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

  if (daysDiff >= 0 && daysDiff < 7) {
    const currentDayCard = document.querySelector(
      `[data-day="${daysDiff + 1}"]`
    );
    if (currentDayCard) {
      const header = currentDayCard.querySelector('.day-header');
      setTimeout(() => header.click(), 1000);
    }
  }
}

/**
 * パフォーマンス最適化: Intersection Observer for animations
 */
function initializeAnimationObserver() {
  const animatedElements = document.querySelectorAll(
    '.phase-card, .prep-card, .ref-card'
  );

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });
}

/**
 * テーブルのレスポンシブ処理
 */
function initializeResponsiveTables() {
  const tables = document.querySelectorAll('.comparison-table, .budget-table');

  tables.forEach(table => {
    // モバイルでの横スクロール表示改善
    const wrapper = table.parentElement;
    if (wrapper.classList.contains('table-responsive')) {
      wrapper.addEventListener('scroll', function () {
        if (this.scrollLeft > 0) {
          this.classList.add('scrolled');
        } else {
          this.classList.remove('scrolled');
        }
      });
    }
  });
}

/**
 * キーボードナビゲーション
 */
function initializeKeyboardNavigation() {
  document.addEventListener('keydown', function (e) {
    // Escキーで展開されたコンテンツを閉じる
    if (e.key === 'Escape') {
      const activeContents = document.querySelectorAll('.day-content.active');
      activeContents.forEach(content => {
        content.classList.remove('active');
        const toggleBtn = content.parentElement.querySelector('.toggle-btn');
        toggleBtn.classList.remove('active');
      });
    }

    // スペースキーで次のセクションにスクロール
    if (e.key === ' ' && e.target === document.body) {
      e.preventDefault();
      scrollToNextSection();
    }
  });
}

/**
 * 次のセクションにスクロール
 */
function scrollToNextSection() {
  const sections = document.querySelectorAll('section[id]');
  const currentScroll = window.scrollY;
  const navHeight = document.querySelector('.nav-sticky').offsetHeight;

  for (let i = 0; i < sections.length; i++) {
    const sectionTop = sections[i].offsetTop - navHeight - 50;
    if (sectionTop > currentScroll) {
      window.scrollTo({
        top: sectionTop,
        behavior: 'smooth',
      });
      break;
    }
  }
}

/**
 * ローカルストレージに設定を保存
 */
function saveUserPreferences() {
  const preferences = {
    expandedDays: Array.from(
      document.querySelectorAll('.day-content.active')
    ).map(content => content.parentElement.getAttribute('data-day')),
    selectedChoice: document
      .querySelector('.choice-card.selected')
      ?.classList.contains('adventure')
      ? 'adventure'
      : 'scenic',
  };

  localStorage.setItem('manila-trip-preferences', JSON.stringify(preferences));
}

/**
 * ローカルストレージから設定を読み込み
 */
function loadUserPreferences() {
  const saved = localStorage.getItem('manila-trip-preferences');
  if (saved) {
    const preferences = JSON.parse(saved);

    // 展開された日程を復元
    if (preferences.expandedDays) {
      preferences.expandedDays.forEach(dayNum => {
        const dayCard = document.querySelector(`[data-day="${dayNum}"]`);
        if (dayCard) {
          const content = dayCard.querySelector('.day-content');
          const toggleBtn = dayCard.querySelector('.toggle-btn');
          content.classList.add('active');
          toggleBtn.classList.add('active');
        }
      });
    }

    // 選択された日帰り旅行オプションを復元
    if (preferences.selectedChoice) {
      const choiceCard = document.querySelector(
        `.choice-card.${preferences.selectedChoice}`
      );
      if (choiceCard) {
        choiceCard.classList.add('selected');
        updateChoiceCardStyles();
      }
    }
  }
}

// 設定の自動保存
window.addEventListener('beforeunload', saveUserPreferences);

// ページ読み込み時に設定を復元
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(loadUserPreferences, 500);
});

// 追加の初期化処理
document.addEventListener('DOMContentLoaded', function () {
  initializeAnimationObserver();
  initializeResponsiveTables();
  initializeKeyboardNavigation();

  // 開発用：現在の日付に基づく自動展開
  // autoExpandFirstPendingDay();
});
