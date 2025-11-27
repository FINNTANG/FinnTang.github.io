document.addEventListener('DOMContentLoaded', function () {
  // ========== 自定义光标初始化（性能优化版） ==========
  const cursor = document.getElementById('cursor');
  const cursorDot = cursor?.querySelector('.cursor-dot');
  const cursorCircle = cursor?.querySelector('.cursor-circle');
  
  let cursorMouseX = 0;
  let cursorMouseY = 0;
  let circleX = 0;
  let circleY = 0;
  
  // 检查是否支持hover（排除移动设备）
  const supportsHover = window.matchMedia('(hover: hover)').matches;
  
  if (supportsHover && cursor) {
    // 使用 transform 替代 left/top，性能更好
    if (cursorDot) {
      cursorDot.style.willChange = 'transform';
    }
    if (cursorCircle) {
      cursorCircle.style.willChange = 'transform';
    }
    
    // 鼠标移动事件 - 使用被动监听器提升性能
    document.addEventListener('mousemove', (e) => {
      cursorMouseX = e.clientX;
      cursorMouseY = e.clientY;
      
      // 立即更新小圆点位置 - 使用 transform 替代 left/top
      if (cursorDot) {
        cursorDot.style.transform = `translate(${cursorMouseX}px, ${cursorMouseY}px) translate(-50%, -50%)`;
      }
    }, { passive: true });
    
    // 大圆圈平滑跟随 - 优化动画循环
    let rafId;
    function animateCursor() {
      const ease = 0.25;
      const dx = cursorMouseX - circleX;
      const dy = cursorMouseY - circleY;
      
      // 只在移动超过阈值时更新，减少不必要的重绘
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        circleX += dx * ease;
        circleY += dy * ease;
        
        if (cursorCircle) {
          cursorCircle.style.transform = `translate(${circleX}px, ${circleY}px) translate(-50%, -50%)`;
        }
      }
      
      rafId = requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // 可交互元素的悬停效果 - 使用事件委托优化性能
    const interactiveElements = 'a, button, .project-card, .filter-btn, .nav-link, input, textarea, [role="button"], .clickable';
    const videoElements = 'video, .project-video, .project-detail-video, .project-card-video';
    
    // 使用单一事件监听器和事件委托
    document.addEventListener('mouseover', (e) => {
      if (e.target.matches(videoElements) || e.target.closest(videoElements)) {
        cursor.classList.add('cursor-video');
      } else if (e.target.matches(interactiveElements) || e.target.closest(interactiveElements)) {
        cursor.classList.add('cursor-hover');
      }
    }, { passive: true });
    
    document.addEventListener('mouseout', (e) => {
      if (e.target.matches(videoElements) || e.target.closest(videoElements)) {
        cursor.classList.remove('cursor-video');
      } else if (e.target.matches(interactiveElements) || e.target.closest(interactiveElements)) {
        cursor.classList.remove('cursor-hover');
      }
    }, { passive: true });
    
    // 点击效果
    document.addEventListener('mousedown', () => {
      cursor.classList.add('cursor-click');
    });
    
    document.addEventListener('mouseup', () => {
      cursor.classList.remove('cursor-click');
    });
    
    // 文本选择悬停效果 - 优化版
    const textElements = 'p, h1, h2, h3, h4, h5, h6, span, div:not(.project-card):not(.interactive), .text-selectable';
    
    document.addEventListener('mouseover', (e) => {
      if (e.target.matches(textElements) && 
          !e.target.closest(interactiveElements) && 
          !e.target.matches(videoElements) &&
          !cursor.classList.contains('cursor-hover') &&
          !cursor.classList.contains('cursor-video')) {
        cursor.classList.add('cursor-text');
      }
    }, { passive: true });
    
    document.addEventListener('mouseout', (e) => {
      if (e.target.matches(textElements)) {
        cursor.classList.remove('cursor-text');
      }
    }, { passive: true });
    
    // 清理所有光标状态的辅助函数
    function resetCursorStates() {
      cursor.classList.remove('cursor-hover', 'cursor-video', 'cursor-text', 'cursor-click');
    }
    
    // 页面切换时重置光标状态
    document.addEventListener('click', (e) => {
      if (e.target.matches('.filter-btn, .nav-link, #back-to-home, #main-title')) {
        setTimeout(resetCursorStates, 100);
      }
    });
    
    // 页面失焦时隐藏光标
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
      // 只有在loading screen隐藏后才显示光标
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen && loadingScreen.classList.contains('hidden')) {
        cursor.style.opacity = '1';
      }
    });
    
    // 初始隐藏光标，直到loading完成
    cursor.style.opacity = '0';
    
    // 监听loading screen的状态变化
    const loadingObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target;
          if (target.classList.contains('hidden')) {
            // Loading完成，显示光标
            setTimeout(() => {
              cursor.style.opacity = '1';
            }, 500);
          }
        }
      });
    });
    
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingObserver.observe(loadingScreen, { attributes: true });
    }
    
    // 全屏状态检测和处理
    function handleFullscreenChange() {
      const isFullscreen = !!(document.fullscreenElement || 
                             document.webkitFullscreenElement || 
                             document.mozFullScreenElement || 
                             document.msFullscreenElement);
      
      if (isFullscreen) {
        // 进入全屏：隐藏自定义光标，恢复系统光标
        cursor.style.display = 'none';
        document.body.style.cursor = 'auto';
        document.documentElement.style.cursor = 'auto';
        // 临时移除全局cursor: none样式
        const tempStyle = document.createElement('style');
        tempStyle.id = 'fullscreen-cursor-override';
        tempStyle.textContent = `
          *, *::before, *::after {
            cursor: auto !important;
          }
        `;
        document.head.appendChild(tempStyle);
      } else {
        // 退出全屏：恢复自定义光标
        cursor.style.display = 'block';
        document.body.style.cursor = 'none';
        document.documentElement.style.cursor = 'none';
        // 移除临时样式
        const tempStyle = document.getElementById('fullscreen-cursor-override');
        if (tempStyle) {
          tempStyle.remove();
        }
      }
    }
    
    // 监听全屏状态变化
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
  }
  
  // ========== 原有代码 ==========
  const loadingScreen = document.getElementById('loading-screen');
  const homePage = document.getElementById('home-page');
  const portfolioPage = document.getElementById('portfolio-page');
  const projectDetailPage = document.getElementById('project-detail-page');
  const mainTitle = document.getElementById('main-title');
  const backToHome = document.getElementById('back-to-home');
  const homeContent = document.getElementById('home-content');
  const splineContainer = document.querySelector('.spline-container');
  const projectBackBtn = document.getElementById('project-back-btn');

  // Project data
  const projectData = {
    'The Drowned Monolith': {
      title: 'The Drowned Monolith',
      category: '[ LEVEL DESIGN / 3D ENVIRONMENT ]',
      year: '2025',
      description:
        'An immersive 3D environment showcasing a submerged ancient structure, combining level design principles with atmospheric storytelling through Unreal Engine and Rhino.',
      role: 'Level Designer, 3D Modeler, Environment Artist',
      duration: '2 weeks',
      tools: 'Unreal Engine 5, Rhino 8, Photoshop',
    },
    REALITYEATER: {
      title: 'REALITYEATER',
      category: '[ AI / INTERACTIVE ]',
      year: '2024',
      description:
        'A cyberpunk-inspired AI-powered digital pet game that "eats" your reality through object recognition.',
      role: 'Concept Design, Frontend Development, AI Integration, UI/UX Design',
      duration: '2 months',
      tools: 'JavaScript, HTML/CSS, OpenAI API, Vercel, Pixel Art',
    },
    FamilyBoard: {
      title: 'FamilyBoard',
      category: '[ WEB DESIGN / PERSONAL ]',
      year: '2024',
      description:
        'A personal communication dashboard designed to bridge the emotional distance between family members living in different countries.',
      role: 'Concept Design, Frontend Development, UI/UX, User Research',
      duration: '4 weeks',
      tools: 'Figma, HTML/CSS/JS, GitHub Pages, Vercel',
    },
    'Tide Bound': {
      title: 'Tide Bound',
      category: '[ GAME DESIGN / EDUCATION ]',
      year: '2025',
      description:
        'A science-driven, role-based card game about ocean conservation and human impact designed for beach play.',
      role: 'Game Design, Role System Design, Card Concept & Visual Design, UX Testing',
      duration: '2 months',
      tools:
        'Illustrator, Photoshop, InDesign, Physical Prototyping, Research-based Design Methods',
    },
    Shmupformer: {
      title: 'Shmupformer',
      category: '[ GAME DEVELOPMENT / COLLABORATION ]',
      year: '2025',
      description:
        'A collaborative genre-bending bullet hell platformer exploring emotional expression through game mechanics.',
      role: 'Core Gameplay Design, Mechanic Balancing, UI Polish, Player Feedback Integration',
      duration: '4 months',
      tools:
        'GameMaker Studio, Aseprite, GML, Mind Mapping, Collaborative Design Docs',
    },
    Float: {
      title: 'Float',
      category: '[ WOODWORKING / SCULPTURE ]',
      year: '2025',
      description:
        'A sculptural wooden bowl that defies gravity through bent lamination and elegant joinery.',
      role: 'Solo project – Concept Design, Woodturning, Lamination, Assembly, Finish',
      duration: '2 weeks',
      tools:
        'Lathe, Band Saw, Clamps, Wood Glue, Dowels, Cherry Block, 3-ply Polywood',
    },
    'Dice Birdhouse': {
      title: 'Dice Birdhouse',
      category: '[ ENVIRONMENTAL / SPECULATIVE ]',
      year: '2024',
      description:
        'A speculative modular birdhouse that offers birds agency through playful, dice-like variability.',
      role: 'Solo project – Concept Development, Physical Prototyping, Environmental Research, Fabrication',
      duration: '4 weeks',
      tools:
        'Foam Core, Wood, Laser Cutting, Illustrator, Environmental Observation, Sketch Modeling',
    },
    'FateRISD: Final Bubble': {
      title: 'FateRISD: Final Bubble',
      category: '[ GAME JAM / VISUAL NOVEL ]',
      year: '2025',
      description:
        'A Fate-inspired parody game created in 48 hours for the 2025 Global Game Jam.',
      role: 'Game Director, Writer, Sprite Artist, UI Design (Collaborative team project with fellow RISD students)',
      duration: '48 hours',
      tools: "Ren'Py, Clip Studio Paint, Photoshop, Git, Google Docs",
    },
    'Venom Pulse': {
      title: 'Venom Pulse',
      category: '[ 3D DESIGN / TOY CONCEPT ]',
      year: '2025',
      description:
        'A conceptual toy gun designed and modeled in Rhino, with a focus on form aesthetics, mechanical detailing, and material interplay.',
      role: 'Solo project – 3D Modeling, Concept Design, Rendering, Material Design',
      duration: '2 weeks',
      tools: 'Rhino 8, Keyshot, Photoshop',
    },
  };

  // Loading animation
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }, 2500);

  // Page navigation functions
  function showPortfolio() {
    // 立即隐藏主页，避免重叠渲染
    homePage.style.display = 'none';
    
    // 显示sidebar
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.add('show');
    }
    
    // 默认显示 OTHER WORKS 页面
    const portfolioSection = document.getElementById('portfolio');
    const otherworksSection = document.getElementById('otherworks');
    if (portfolioSection) portfolioSection.style.display = 'none';
    if (otherworksSection) otherworksSection.style.display = 'grid';
    
    // 更新按钮激活状态为 OTHER WORKS
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach((btn) => btn.classList.remove('active'));
    const otherworksBtn = document.querySelector('[data-filter="otherworks"]');
    if (otherworksBtn) otherworksBtn.classList.add('active');
    
    // 预先设置页面状态，减少重排
    portfolioPage.style.display = 'block';
    portfolioPage.style.opacity = '0';
    portfolioPage.style.transform = 'translateY(20px)';
    
    // 移除其他页面状态
    projectDetailPage.classList.remove('active');
    
    // 使用requestAnimationFrame确保DOM更新完成后再开始动画
    requestAnimationFrame(() => {
      // 添加页面转换类并开始动画
      portfolioPage.classList.add('page-transition', 'active');
      portfolioPage.style.opacity = '1';
      portfolioPage.style.transform = 'translateY(0)';
      portfolioPage.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      
      // 清理主页的水印遮挡层
      const existingBlocker = document.getElementById('spline-watermark-blocker');
      if (existingBlocker) {
        existingBlocker.remove();
      }

      // 延迟显示Spline文字特效，避免阻塞主动画
      setTimeout(() => {
        const splineText = document.getElementById('projectSplineText');
        if (splineText) {
          splineText.style.display = 'block';
          splineText.style.position = 'absolute';
          splineText.style.top = '90px';
          splineText.style.left = '60%';
          splineText.style.transform = 'translateX(-50%)';
          splineText.style.width = '650px';
          splineText.style.height = '300px';
          splineText.style.zIndex = '1';
          splineText.style.opacity = '0';
          splineText.style.visibility = 'visible';
          splineText.style.pointerEvents = 'none';
          splineText.style.background = 'transparent';
          splineText.style.transition = 'opacity 0.8s ease';
          
          // 渐显Spline效果
          setTimeout(() => {
            splineText.style.opacity = '1';
            splineText.classList.add('visible');
          }, 100);

          const splineViewer = splineText.querySelector('spline-viewer');
          if (splineViewer) {
            splineViewer.style.pointerEvents = 'auto';
            splineViewer.style.transform = 'scale(1.3)';
            splineViewer.style.transformOrigin = 'center center';
          }
        }
      }, 300);

      // 优化视频处理 - 分批处理避免卡顿
      setTimeout(() => {
        const allVideos = document.querySelectorAll('.project-card-video, .project-video');
        let videoIndex = 0;
        
        const processVideo = () => {
          if (videoIndex < allVideos.length) {
            const video = allVideos[videoIndex];
            if (video.tagName === 'VIDEO') {
              video.currentTime = 0;
              video.play().catch((e) => console.log('Video autoplay prevented:', e));
            }
            videoIndex++;
            // 使用 requestAnimationFrame 分帧处理
            requestAnimationFrame(processVideo);
          }
        };
        
        processVideo();
      }, 400);

      // 优化项目卡片动画 - 使用更流畅的时序
      setTimeout(() => {
        const projectCards = document.querySelectorAll('.project-card');
        
        // 预先设置所有卡片的初始状态
        projectCards.forEach((card, index) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(40px)';
          card.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        
        // 分批显示卡片，创建波浪效果
        projectCards.forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            card.classList.add('visible');
          }, index * 80); // 减少延迟间隔，让动画更连贯
        });
      }, 200);
    });
  }

  function showHome() {
    // 隐藏sidebar
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.remove('show');
    }
    
    // 添加离开动画
    portfolioPage.style.opacity = '0';
    portfolioPage.style.transform = 'translateY(-20px)';
    portfolioPage.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    // Clean up about scroll listener
    cleanupAboutScrollListener();
    
    // 隐藏Spline文字特效
    const splineText = document.getElementById('projectSplineText');
    if (splineText) {
      splineText.style.opacity = '0';
      setTimeout(() => {
        splineText.style.display = 'none';
        splineText.classList.remove('visible');
      }, 400);
    }
    
    // 延迟切换页面直到动画完成
    setTimeout(() => {
      portfolioPage.style.display = 'none';
      projectDetailPage.classList.remove('active');
      homePage.style.display = 'block';
      
      // 重置作品集页面状态
      portfolioPage.classList.remove('page-transition', 'active');
      portfolioPage.style.opacity = '';
      portfolioPage.style.transform = '';
      portfolioPage.style.transition = '';

      // 重置项目卡片状态
      const projectCards = document.querySelectorAll('.project-card');
      projectCards.forEach((card) => {
        card.classList.remove('visible');
        card.style.opacity = '';
        card.style.transform = '';
        card.style.transition = '';
      });
    }, 400);
  }

  // Project navigation functionality
  function updateProjectNavigation(currentProjectTitle) {
    const projectTitles = [
      'The Drowned Monolith',
      'REALITYEATER',
      'Tide Bound',
      'Shmupformer',
      'Float',
      'Dice Birdhouse',
      'FateRISD: Final Bubble',
      'FamilyBoard',
      'Venom Pulse',
    ];
    const currentIndex = projectTitles.indexOf(currentProjectTitle);

    const prevProjectBtn = document.getElementById('prev-project');
    const nextProjectBtn = document.getElementById('next-project');

    // Previous project
    if (currentIndex > 0) {
      const prevProject = projectTitles[currentIndex - 1];
      prevProjectBtn.style.display = 'flex';
      prevProjectBtn.onclick = () => showProjectDetail(prevProject);
      prevProjectBtn.querySelector(
        'span:last-child',
      ).textContent = `Previous Project`;
    } else {
      prevProjectBtn.style.display = 'none';
    }

    // Next project
    if (currentIndex < projectTitles.length - 1) {
      const nextProject = projectTitles[currentIndex + 1];
      nextProjectBtn.style.display = 'flex';
      nextProjectBtn.onclick = () => showProjectDetail(nextProject);
      nextProjectBtn.querySelector(
        'span:first-child',
      ).textContent = `Next Project`;
    } else {
      nextProjectBtn.style.display = 'none';
    }
  }

  function showProjectDetail(projectTitle) {
    const project = projectData[projectTitle];
    if (!project) return;

    console.log('=== Starting showProjectDetail ===');

    // 预先更新内容，避免在显示时才更新导致的卡顿
    updateProjectSections(projectTitle);

    // Update project detail content
    document.getElementById('project-hero-title').textContent = project.title;
    document.getElementById('project-hero-category').textContent =
      project.category;
    document.getElementById('project-hero-year').textContent = project.year;
    document.getElementById('project-hero-description').textContent =
      project.description;
    document.getElementById('project-role').textContent = project.role;
    document.getElementById('project-duration').textContent = project.duration;
    document.getElementById('project-tools').textContent = project.tools;

    // Update navigation buttons
    updateProjectNavigation(projectTitle);

    // 滚动到页面顶部
    projectDetailPage.scrollTop = 0;

    // 立即显示页面，避免延迟
    projectDetailPage.classList.add('active');
  }

  function updateProjectSections(projectTitle) {
    const overviewSection = document.querySelector('[data-section="overview"]');
    const processSection = document.querySelector('[data-section="process"]');
    const resultsSection = document.querySelector('[data-section="results"]');

    if (projectTitle === 'The Drowned Monolith') {
      // The Drowned Monolith content
      overviewSection.innerHTML = `
                <h2 class="project-section-title">Overview</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <iframe 
                                class="project-detail-iframe" 
                                src="https://www.youtube.com/embed/hqiESOiOgnM?autoplay=1&mute=1&loop=1&playlist=hqiESOiOgnM&controls=1&playsinline=1" 
                                title="The Drowned Monolith Overview" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                sandbox="allow-scripts allow-same-origin allow-presentation"
                                loading="lazy"
                                allowfullscreen>
                            </iframe>
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>The Drowned Monolith is an atmospheric 3D environment that explores the intersection of ancient architecture and natural decay, telling a story of a civilization lost beneath the waves.</p>
                    <p>Created using Unreal Engine 5 and Rhino, this level design project demonstrates proficiency in environmental storytelling, lighting design, and technical implementation.</p>
                </div>
            `;

      processSection.innerHTML = `
                <h2 class="project-section-title">Development Process</h2>
                <div class="project-text-content">
                    <h3>Concept & Planning</h3>
                    <p>Developed the initial concept focusing on creating an underwater monument that evokes mystery and ancient grandeur.</p>
                    <h3>3D Modeling in Rhino</h3>
                    <p>Built precise architectural elements and organic forms using Rhino's powerful modeling tools, ensuring clean topology for game engine import.</p>
                    <h3>Unreal Engine Implementation</h3>
                    <p>Assembled and refined the environment in Unreal Engine 5, focusing on lighting, water effects, and atmospheric elements to enhance immersion.</p>
                    <h3>Optimization & Polish</h3>
                    <p>Optimized performance while maintaining visual fidelity, implementing dynamic lighting and post-processing effects.</p>
                </div>
            `;

      resultsSection.innerHTML = `
                <h2 class="project-section-title">Final Outcome</h2>
                <div class="project-text-content">
                    <p>View the full walkthrough on YouTube: <a href="https://youtu.be/hqiESOiOgnM" target="_blank" style="color: #fff; text-decoration: underline; opacity: 0.8;">The Drowned Monolith</a></p>
                    <p>The final environment successfully creates an evocative underwater atmosphere, demonstrating strong level design principles and technical execution.</p>
                    <h3>Key Achievements</h3>
                    <p>• Seamless integration between Rhino modeling and Unreal Engine</p>
                    <p>• Effective use of lighting and atmosphere to convey narrative</p>
                    <p>• Optimized performance for real-time rendering</p>
                    <p>• Cohesive visual storytelling through environmental design</p>
                </div>
            `;
    } else if (projectTitle === 'REALITYEATER') {
      // REALITYEATER content
      overviewSection.innerHTML = `
                <h2 class="project-section-title">Overview</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <video class="project-detail-video" autoplay muted loop playsinline>
                                <source src="realityeater-overview.mp4" type="video/mp4">
                                <span>REALITYEATER Game Interface</span>
                            </video>
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>REALITYEATER is a virtual pet browser game where players use real-world items to feed a glitchy, sentient digital pet through webcam-based object recognition.</p>
                </div>
            `;

      processSection.innerHTML = `
                <h2 class="project-section-title">Development Process</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-medium">
                            <img src="realityeater/realityeater-process-1.png" alt="REALITYEATER Development Process" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <h3>AI Integration</h3>
                    <p>Built interactive pet with camera-based object recognition using OpenAI API.</p>
                    <h3>Visual Design</h3>
                    <p>Designed glitch-style UI with pixel art aesthetics and terminal-like interfaces.</p>
                    <h3>Behavioral Logic</h3>
                    <p>Created JSON-based interaction logic and emotional states for the pet.</p>
                </div>
            `;

      resultsSection.innerHTML = `
                <h2 class="project-section-title">Final Outcome</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <video class="project-detail-video" autoplay muted loop playsinline>
                                <source src="realityeater/realityeater-final-1.mp4" type="video/mp4">
                                <span>REALITYEATER Final Outcome Video</span>
                            </video>
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="realityeater/realityeater-final-2.png" alt="REALITYEATER Final Outcome 2" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="realityeater/realityeater-final-3.png" alt="REALITYEATER Final Outcome 3" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="realityeater/realityeater-final-4.png" alt="REALITYEATER Final Outcome 4" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="realityeater/realityeater-final-5.png" alt="REALITYEATER Final Outcome 5" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="realityeater/realityeater-final-6.png" alt="REALITYEATER Final Outcome 6" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="realityeater/realityeater-final-7.png" alt="REALITYEATER Final Outcome 7" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>Live prototype available at <a href="https://digital-pet-code-world.vercel.app/" target="_blank" style="color: #fff; text-decoration: underline; opacity: 0.8;">digital-pet-code-world.vercel.app</a></p>
                    <p>Players can interact with the pet through typed messages and feed it real objects via webcam input.</p>
                </div>
            `;
    } else if (projectTitle === 'FamilyBoard') {
      // FamilyBoard content
      overviewSection.innerHTML = `
                <h2 class="project-section-title">Overview</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <video class="project-detail-video" autoplay muted loop playsinline>
                                <source src="Finnmom.mp4" type="video/mp4">
                                <span>FamilyBoard Dashboard Overview</span>
                            </video>
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>FamilyBoard is a personal communication dashboard designed as a gift for my mom, bridging emotional distance between family members living in different countries.</p>
                </div>
            `;

      processSection.innerHTML = `
                <h2 class="project-section-title">Development Process</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-medium">
                            <img src="familyboard/FM-process-1.png" alt="FamilyBoard Development Process 1" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-medium">
                            <img src="familyboard/FM-process-2.png" alt="FamilyBoard Development Process 2" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-medium">
                            <img src="familyboard/FM-process-3.png" alt="FamilyBoard Development Process 3" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-medium">
                            <img src="familyboard/FM-process-4.png" alt="FamilyBoard Development Process 4" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <h3>User Research</h3>
                    <p>Conducted interviews with my mom to understand her emotional and practical needs.</p>
                    <h3>Development</h3>
                    <p>Built modules for daily logs, media sharing, reading tracker, and wish list features.</p>
                    <h3>Real-time Connection</h3>
                    <p>Designed dual-time clock and weather displays to create shared space.</p>
                </div>
            `;

      resultsSection.innerHTML = `
                <h2 class="project-section-title">Final Outcome</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <video class="project-detail-video" autoplay muted loop playsinline>
                                <source src="familyboard/FM-final-1.mp4" type="video/mp4">
                                <span>FamilyBoard Final Outcome Video</span>
                            </video>
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="familyboard/FM-final-2.png" alt="FamilyBoard Final Outcome 2" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="familyboard/FM-final-3.png" alt="FamilyBoard Final Outcome 3" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="familyboard/FM-final-4.png" alt="FamilyBoard Final Outcome 4" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="familyboard/FM-final-5.png" alt="FamilyBoard Final Outcome 5" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>Live site available at <a href="https://finntang.github.io/FamilyBorad-Finn-Mom/" target="_blank" style="color: #fff; text-decoration: underline; opacity: 0.8;">finntang.github.io/FamilyBorad-Finn-Mom</a></p>
                    <h3>Key Features</h3>
                    <p>• Daily reminders for health and wellness</p>
                    <p>• Interactive media sharing with emoji reactions</p>
                    <p>• Reading progress tracker and book reviews</p>
                    <p>• Real-time U.S./China time and weather integration</p>
                </div>
            `;
    } else if (projectTitle === 'Tide Bound') {
      // Tide Bound content
      overviewSection.innerHTML = `
                <h2 class="project-section-title">Overview</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <iframe 
                                class="project-detail-iframe" 
                                src="https://www.youtube.com/embed/liMMEkX0Dlg?autoplay=1&mute=1&loop=1&playlist=liMMEkX0Dlg&controls=1&playsinline=1" 
                                title="Tide Bound Game Overview" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                sandbox="allow-scripts allow-same-origin allow-presentation"
                                loading="lazy"
                                allowfullscreen>
                            </iframe>
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>Tide Bound is a tabletop card game designed for beach play that encourages engagement with marine ecology and environmental decision-making.</p>
                </div>
            `;

      processSection.innerHTML = `
                <h2 class="project-section-title">Development Process</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-medium">
                            <img src="tidebound/tidebound-process-1.jpg" alt="Tide Bound Development Process 1" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-medium">
                            <img src="tidebound/tidebound-process-2.png" alt="Tide Bound Development Process 2" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <h3>Role-Based System</h3>
                    <p>Designed system where players act as different specialists (scientist, fisher, policy maker, activist).</p>
                    <h3>Event Cards</h3>
                    <p>Created dual-sided event cards reflecting real-world environmental challenges.</p>
                    <h3>Physical Prototyping</h3>
                    <p>Built waterproof, wind-resistant card prototypes for beach play.</p>
                </div>
            `;

      resultsSection.innerHTML = `
                <h2 class="project-section-title">Final Outcome</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="tidebound/tidebound-final-1.jpg" alt="Tide Bound Final Outcome 1" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="tidebound/tidebound-final-2.jpg" alt="Tide Bound Final Outcome 2" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="tidebound/tidebound-final-3.png" alt="Tide Bound Final Outcome 3" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="tidebound/tidebound-final-4.png" alt="Tide Bound Final Outcome 4" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="tidebound/tidebound-final-5.png" alt="Tide Bound Final Outcome 5" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="tidebound/tidebound-final-6.png" alt="Tide Bound Final Outcome 6" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>Live website: <a href="https://ocean-board-game.vercel.app/" target="_blank" style="color: #fff; text-decoration: underline; opacity: 0.8;">ocean-board-game.vercel.app</a></p>
                    <p>The game is fully playable in both physical and digital formats, with downloadable rules, cards, and interactive UI support.</p>
                </div>
            `;
    } else if (projectTitle === 'Shmupformer') {
      // Shmupformer content
      overviewSection.innerHTML = `
                <h2 class="project-section-title">Overview</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <video class="project-detail-video" autoplay muted loop playsinline>
                                <source src="CSP.mp4" type="video/mp4">
                                <span>Shmupformer Game Overview</span>
                            </video>
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>Shmupformer is a team-developed 2D action game that fuses platformer mechanics with bullet hell intensity.</p>
                    <h3>Collaborative Team</h3>
                    <p>Developed in collaboration with Yingjie Yu and Zhiwei Huang.</p>
                </div>
            `;

      processSection.innerHTML = `
                <h2 class="project-section-title">Development Process</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-medium">
                            <img src="csp/csp-process-1.jpg" alt="Shmupformer Development Process" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <h3>Hybrid Genre System</h3>
                    <p>Designed system where grounded platforming transforms into flight mode with stamina and shooting mechanics.</p>
                    <h3>360° Aiming System</h3>
                    <p>Built 360° manual aiming system and resource-based mechanics like Overload and Stamina.</p>
                    <h3>Iterative Testing</h3>
                    <p>Prioritized iterative testing with readable feedback: flashing hitboxes and simplified tutorials.</p>
                </div>
            `;

      resultsSection.innerHTML = `
                <h2 class="project-section-title">Final Outcome</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="csp/csp-final-1.png" alt="Shmupformer Final Outcome 1" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="csp/csp-final-2.png" alt="Shmupformer Final Outcome 2" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="csp/csp-final-3.png" alt="Shmupformer Final Outcome 3" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="csp/csp-final-4.png" alt="Shmupformer Final Outcome 4" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="csp/csp-final-5.png" alt="Shmupformer Final Outcome 5" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="csp/csp-final-6.png" alt="Shmupformer Final Outcome 6" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>A working vertical slice with multiple stages, boss design, and emotionally charged combat systems.</p>
                    <p>Shmupformer invites players to face overwhelming odds without shortcuts—no invincibility frames, just skill.</p>
                </div>
            `;
    } else if (projectTitle === 'Float') {
      // Float content
      overviewSection.innerHTML = `
                <h2 class="project-section-title">Overview</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="float/float-overview.jpg" alt="Float Sculpture Overview" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>Float is a sculptural wooden bowl that appears to "float" above ground, supported by three gracefully curved polywood legs achieved through bent lamination.</p>
                </div>
            `;

      processSection.innerHTML = `
                <h2 class="project-section-title">Development Process</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-medium">
                            <img src="float/float-process-1.png" alt="Float Woodworking Process" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <h3>Material Preparation</h3>
                    <p>Started with a 10-foot block of cherry and thin sheets of polywood for the curved legs.</p>
                    <h3>Bowl Turning</h3>
                    <p>Turned the bowl on a lathe, stabilizing large wood masses and repairing piercing accidents.</p>
                    <h3>Bent Lamination</h3>
                    <p>Used bent lamination for the legs to achieve graceful curves.</p>
                    <h3>Joinery Design</h3>
                    <p>Designed joints that invisibly support the weight while enhancing the illusion of floating.</p>
                </div>
            `;

      resultsSection.innerHTML = `
                <h2 class="project-section-title">Final Outcome</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="float/float-final-1.jpg" alt="Float Final Outcome 1" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="float/float-final-2.jpg" alt="Float Final Outcome 2" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="float/float-final-3.jpg" alt="Float Final Outcome 3" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>A visually balanced wood sculpture combining solid mass with visual lightness.</p>
                    <p>Float reflects a harmony between organic form and engineered control.</p>
                </div>
            `;
    } else if (projectTitle === 'Dice Birdhouse') {
      // Dice Birdhouse content
      overviewSection.innerHTML = `
                <h2 class="project-section-title">Overview</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="bird/bird-overview.png" alt="Dice Birdhouse Overview" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>Dice Birdhouse is a conceptual bird habitat inspired by the form and randomness of a dice, where each face offers a different access point or shelter configuration.</p>
                </div>
            `;

      processSection.innerHTML = `
                <h2 class="project-section-title">Development Process</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-medium">
                            <img src="bird/bird-process.png" alt="Dice Birdhouse Development Process" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <h3>Behavioral Research</h3>
                    <p>Studied bird behavior preferences for shelter, visibility, and escape routes.</p>
                    <h3>Geometric Exploration</h3>
                    <p>Each dice face represents a different environmental function (ventilation, shadow, concealment, access).</p>
                    <h3>Physical Prototyping</h3>
                    <p>Created multiple prototypes to test spatial usability and interaction for small birds.</p>
                    <h3>Modular Design</h3>
                    <p>Final design offers a modular, rotatable birdhouse that adapts depending on placement.</p>
                </div>
            `;

      resultsSection.innerHTML = `
                <h2 class="project-section-title">Final Outcome</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="bird/bird-final-1.png" alt="Dice Birdhouse Final Outcome 1" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="bird/bird-final-2.png" alt="Dice Birdhouse Final Outcome 2" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="bird/bird-final-3.png" alt="Dice Birdhouse Final Outcome 3" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="bird/bird-final-4.png" alt="Dice Birdhouse Final Outcome 4" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="bird/bird-final-5.png" alt="Dice Birdhouse Final Outcome 5" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>A six-faced birdhouse with variable access points and shaded cavities—an architectural "dice" rolled by birds themselves.</p>
                    <p>The playful form allows birds to adapt to changing urban microclimates and threats.</p>
                </div>
            `;
    } else if (projectTitle === 'FateRISD: Final Bubble') {
      // FateRISD: Final Bubble content
      overviewSection.innerHTML = `
                <h2 class="project-section-title">Overview</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="fate/fate-overview.png" alt="FateRISD: Final Bubble Game Overview" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>FateRISD: Final Bubble is a humorous visual novel and battle parody made during the 2025 Global Game Jam, featuring original characters inspired by RISD students.</p>
                </div>
            `;

      processSection.innerHTML = `
                <h2 class="project-section-title">Development Process</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-medium">
                            <img src="fate/fate-process-1.png" alt="FateRISD Development Process 1" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-medium">
                            <img src="fate/fate-process-2.png" alt="FateRISD Development Process 2" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <h3>Theme Interpretation</h3>
                    <p>Conceptualized the game in response to the Global Game Jam theme "bubble."</p>
                    <h3>Collaborative Character Creation</h3>
                    <p>Collaborated with friends who voiced, drew, or inspired each character—turning real RISD personalities into Servants and Masters.</p>
                    <h3>Rapid Development</h3>
                    <p>Created branching dialogue, basic battle logic, and comedic event scenes within 48 hours.</p>
                    <h3>Visual Design</h3>
                    <p>Designed all character sprites, visual UI, and interface in under 48 hours.</p>
                </div>
            `;

      resultsSection.innerHTML = `
                <h2 class="project-section-title">Final Outcome</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="fate/fate-final-1.png" alt="FateRISD Final Outcome 1" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="fate/fate-final-2.png" alt="FateRISD Final Outcome 2" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="fate/fate-final-3.png" alt="FateRISD Final Outcome 3" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="fate/fate-final-4.jpg" alt="FateRISD Final Outcome 4" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>Play now on itch.io: <a href="https://finntang2004.itch.io/faterisdfinal" target="_blank" style="color: #fff; text-decoration: underline; opacity: 0.8;">finntang2004.itch.io/faterisdfinal</a></p>
                    <p>The game includes multiple endings, satirical attacks, and anime-style dialogue.</p>
                </div>
            `;
    } else if (projectTitle === 'Venom Pulse') {
      // Venom Pulse content
      overviewSection.innerHTML = `
                <h2 class="project-section-title">Overview</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="Venom Pulse/venompulse-overview.png" alt="Venom Pulse Overview" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>Venom Pulse is a conceptual toy gun designed and modeled in Rhino, with a focus on form aesthetics, mechanical detailing, and material interplay. The project explores how futuristic weaponry can be reinterpreted through a play-oriented, collectible lens — emphasizing stylized geometry and transparent surfaces that reveal internal structure.</p>
                </div>
            `;

      processSection.innerHTML = `
                <h2 class="project-section-title">Development Process</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-medium">
                            <img src="Venom Pulse/venompulse-process-1.png" alt="Venom Pulse Development Process" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <h3>Design Concept</h3>
                    <p>The design blends organic curvature with industrial precision, inspired by cybernetic fluid systems and neon bioluminescence. The color palette — black, violet, and chrome green — evokes the tension between toxicity and allure, echoing the idea of a "venomous pulse" that's both dangerous and mesmerizing.</p>
                    <h3>3D Modeling</h3>
                    <p>Modeled entirely in Rhino 8, focusing on form aesthetics and mechanical detailing with precise surface control.</p>
                    <h3>Material Design</h3>
                    <p>Developed material interplay using transparent surfaces that reveal internal structure, combining matte black, glossy violet, and chrome green finishes.</p>
                </div>
            `;

      resultsSection.innerHTML = `
                <h2 class="project-section-title">Final Outcome</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="Venom Pulse/venompulse-final-1.png" alt="Venom Pulse Final Outcome 1" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="Venom Pulse/venompulse-final-2.png" alt="Venom Pulse Final Outcome 2" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="Venom Pulse/venompulse-final-3.png" alt="Venom Pulse Final Outcome 3" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>A conceptual toy gun that reinterprets futuristic weaponry through a collectible lens, emphasizing stylized geometry and transparent surfaces.</p>
                    <p>The project demonstrates proficiency in 3D product design, material exploration, and aesthetic storytelling through form.</p>
                </div>
            `;
    } else {
      // Default placeholder content for other projects
      overviewSection.innerHTML = `
                <h2 class="project-section-title">Overview</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <div class="project-image-placeholder">
                                <span>Project Overview</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>Project overview content will be added here.</p>
                </div>
            `;

      processSection.innerHTML = `
                <h2 class="project-section-title">Development Process</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-medium">
                            <div class="project-image-placeholder">
                                <span>Development Process</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>Development process content will be added here.</p>
                </div>
            `;

      resultsSection.innerHTML = `
                <h2 class="project-section-title">Final Outcome</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <div class="project-image-placeholder">
                                <span>Final Results</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>Final outcome content will be added here.</p>
                </div>
            `;
    }

    // 立即重新初始化交互，避免延迟
    requestAnimationFrame(() => {
      initializeImageInteractions();
    });
  }

  function initializeImageInteractions() {
    // Re-run image loading and interaction setup
    const projectImages = document.querySelectorAll('.project-detail-image');
    const projectImageItems = document.querySelectorAll('.project-image-item');
    const projectVideos = document.querySelectorAll(
      '.project-detail-video, .project-card-video',
    );
    const projectIframes = document.querySelectorAll('.project-detail-iframe');

    // Apply image interactions (reuse existing code)
    projectImages.forEach((image, index) => {
      image.style.opacity = '0';
      image.style.transform = 'translateY(20px)';

      setTimeout(() => {
        image.style.opacity = '1';
        image.style.transform = 'translateY(0)';
        image.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      }, index * 100 + 300);
    });

    // Apply hover interactions to new items
    projectImageItems.forEach((item) => {
      let hoverTimeout;

      item.addEventListener('mouseenter', function () {
        clearTimeout(hoverTimeout);
        this.style.transform = 'translateY(-8px)';
        this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';

        const media = this.querySelector(
          '.project-detail-image, .project-detail-video, .project-detail-iframe, .project-card-video',
        );
        if (media) {
          media.style.transform = 'scale(1.02)';
          media.style.filter = 'brightness(1.05)';
        }
      });

      item.addEventListener('mouseleave', function () {
        hoverTimeout = setTimeout(() => {
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = 'none';

          const media = this.querySelector(
            '.project-detail-image, .project-detail-video, .project-detail-iframe, .project-card-video',
          );
          if (media) {
            media.style.transform = 'scale(1)';
            media.style.filter = 'brightness(1)';
          }
        }, 50);
      });
    });
  }

  function hideProjectDetail() {
    // 停止所有iframe视频播放（主要针对YouTube视频）
    const projectIframes = projectDetailPage.querySelectorAll('.project-detail-iframe');
    projectIframes.forEach((iframe) => {
      // 清空iframe的src来完全停止视频播放和音频
      iframe.src = 'about:blank';
    });
    
    // 停止所有视频播放
    const projectVideos = projectDetailPage.querySelectorAll('.project-detail-video');
    projectVideos.forEach((video) => {
      video.pause();
      video.currentTime = 0;
      video.muted = true;
    });
    
    // Add exit animation
    const animateElements = projectDetailPage.querySelectorAll(
      '.project-hero, .project-content-section',
    );
    animateElements.forEach((el) => {
      //   el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
    });

    setTimeout(() => {
      projectDetailPage.classList.remove('active');
    }, 200);
  }

  // Event listeners for navigation
  mainTitle.addEventListener('click', showPortfolio);
  backToHome.addEventListener('click', showHome);
  homeContent.addEventListener('click', showPortfolio);
  projectBackBtn.addEventListener('click', hideProjectDetail);

  // 修复FINN TANG标题点击事件 - 使用正确的选择器
  setTimeout(() => {
    // 尝试多个可能的选择器
    const selectors = [
      '.portfolio-page .logo h1',
      '.portfolio-page .logo',
      '.portfolio-page h1',
      '.logo h1',
      '.logo',
      'h1',
    ];

    let titleElement = null;

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (
        element &&
        element.textContent &&
        element.textContent.includes('FINN TANG')
      ) {
        titleElement = element;
        break;
      }
    }

    if (titleElement) {
      console.log('Found FINN TANG title element:', titleElement);
      titleElement.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('FINN TANG clicked, going to home');
        showHome();
      });
      titleElement.style.cursor = 'pointer';
      titleElement.style.userSelect = 'none';
    } else {
      console.log('Could not find FINN TANG title element');
      // 如果找不到，直接给所有h1添加事件
      const allH1s = document.querySelectorAll('h1');
      allH1s.forEach((h1) => {
        if (h1.textContent.includes('FINN TANG')) {
          h1.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            showHome();
          });
          h1.style.cursor = 'pointer';
        }
      });
    }
  }, 1000); // 增加延迟确保DOM完全加载

  // Portfolio page functionality
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioSection = document.getElementById('portfolio');
  const otherworksSection = document.getElementById('otherworks');
  const aboutSection = document.getElementById('about');
  const contactSection = document.getElementById('contact');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      // Remove active class from all buttons
      filterBtns.forEach((b) => b.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');

      // Show/hide sections based on filter
      if (filter === 'portfolio') {
        portfolioSection.style.display = 'grid';
        otherworksSection.style.display = 'none';
        aboutSection.style.display = 'none';
        aboutSection.classList.remove('about-active');
        // Clean up about scroll listener
        cleanupAboutScrollListener();
        
        // 重置滚动位置到顶部
        const portfolioPage = document.getElementById('portfolio-page');
        portfolioPage.scrollTop = 0;
      } else if (filter === 'otherworks') {
        portfolioSection.style.display = 'none';
        otherworksSection.style.display = 'grid';
        aboutSection.style.display = 'none';
        aboutSection.classList.remove('about-active');
        // Clean up about scroll listener
        cleanupAboutScrollListener();
        
        // 重置滚动位置到顶部
        const portfolioPage = document.getElementById('portfolio-page');
        portfolioPage.scrollTop = 0;
      } else if (filter === 'about') {
        portfolioSection.style.display = 'none';
        otherworksSection.style.display = 'none';
        aboutSection.style.display = 'block';
        aboutSection.classList.add('about-active');
        
        // 重置滚动位置到顶部
        const portfolioPage = document.getElementById('portfolio-page');
        portfolioPage.scrollTop = 0;
        
        // Add scroll listener for about page
        initAboutScrollListener();
      }
    });
  });

  // Sidebar navigation
  const navLinks = document.querySelectorAll('.nav-link');
  const contactClose = document.getElementById('contact-close');

  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('href');

      if (target === '#contact') {
        // Show contact overlay
        contactSection.classList.add('active');
      } else {
        // Close contact overlay if open
        contactSection.classList.remove('active');

        // Handle other navigation
        if (target === '#portfolio') {
          // Show portfolio section, hide others
          portfolioSection.style.display = 'grid';
          otherworksSection.style.display = 'none';
          aboutSection.style.display = 'none';
          aboutSection.classList.remove('about-active');
          // Clean up about scroll listener
          cleanupAboutScrollListener();

          // 重置滚动位置到顶部
          const portfolioPage = document.getElementById('portfolio-page');
          portfolioPage.scrollTop = 0;

          // Update filter buttons
          filterBtns.forEach((btn) => btn.classList.remove('active'));
          document
            .querySelector('[data-filter="portfolio"]')
            .classList.add('active');
        } else if (target === '#otherworks') {
          // Show other works section, hide others
          portfolioSection.style.display = 'none';
          otherworksSection.style.display = 'grid';
          aboutSection.style.display = 'none';
          aboutSection.classList.remove('about-active');
          // Clean up about scroll listener
          cleanupAboutScrollListener();

          // 重置滚动位置到顶部
          const portfolioPage = document.getElementById('portfolio-page');
          portfolioPage.scrollTop = 0;

          // Update filter buttons
          filterBtns.forEach((btn) => btn.classList.remove('active'));
          document
            .querySelector('[data-filter="otherworks"]')
            .classList.add('active');
        } else {
          // Smooth scroll to section if it exists
          const targetElement = document.querySelector(target);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
            });
          }
        }
      }
    });
  });

  // Contact close button
  contactClose.addEventListener('click', function () {
    contactSection.classList.remove('active');
  });

  // Close contact section when clicking outside
  document.addEventListener('click', function (e) {
    if (
      contactSection.classList.contains('active') &&
      !contactSection.contains(e.target) &&
      !e.target.closest('a[href="#contact"]')
    ) {
      contactSection.classList.remove('active');
    }
  });

  // Prevent contact section from closing when clicking inside
  contactSection.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  // Project card interactions with enhanced effects - 性能优化版
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach((card, index) => {
    // 预设动画延迟，但使用更快的时序
    card.style.animationDelay = `${index * 0.03}s`;
    
    // 预设 GPU 加速
    card.style.willChange = 'transform';

    let isHovering = false;

    card.addEventListener('mouseenter', function () {
      if (isHovering) return;
      isHovering = true;
      
      if (this.classList.contains('visible')) {
        // 使用 transform 而不是多个属性，提升性能
        this.style.transform = 'translateY(-6px) scale(1.008)';
        this.style.filter = 'brightness(1.02)';
        this.style.boxShadow = '0 12px 24px rgba(0,0,0,0.25)';
      }
    }, { passive: true });

    card.addEventListener('mouseleave', function () {
      isHovering = false;
      
      // 立即响应
      this.style.transform = 'translateY(0) scale(1)';
      this.style.filter = 'brightness(1)';
      this.style.boxShadow = 'none';
    }, { passive: true });

    // 点击事件 - 修复项目标题匹配
    card.addEventListener('click', function () {
      const projectTitle = this.querySelector('.project-title').textContent;
      showProjectDetail(projectTitle);
    });
  });

  // Enhanced project detail navigation
  const projectNavBtns = document.querySelectorAll('.project-nav-btn');

  projectNavBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      // Remove active class from all buttons
      projectNavBtns.forEach((b) => b.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');

      // Add smooth scroll to section
      const sectionName = this.textContent.toLowerCase();
      const targetSection = document.querySelector(
        `[data-section="${sectionName}"]`,
      );
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  // Parallax effect for home page - 支持点击穿透（性能优化版）
  let mouseX = 0;
  let mouseY = 0;
  let parallaxRafId = null;

  document.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;

    // 使用 requestAnimationFrame 优化性能
    if (!parallaxRafId && homePage.style.display !== 'none') {
      parallaxRafId = requestAnimationFrame(() => {
        const homeContent = document.querySelector('.home-content');
        if (homeContent && homePage.style.display !== 'none') {
          const translateX = mouseX * 10;
          const translateY = mouseY * 10;
          homeContent.style.transform = `translate(${translateX}px, ${translateY}px)`;
        }
        parallaxRafId = null;
      });
    }
  }, { passive: true });

  // Enhanced project detail page transitions - 性能优化版
  if (projectDetailPage) {
    let scrollRafId = null;
    
    projectDetailPage.addEventListener('scroll', function () {
      // 使用 requestAnimationFrame 节流滚动事件
      if (!scrollRafId) {
        scrollRafId = requestAnimationFrame(() => {
          const scrolled = this.scrollTop;
          const rate = scrolled * -0.5;

          // Parallax effect for hero year
          const heroYear = document.getElementById('project-hero-year');
          if (heroYear) {
            heroYear.style.transform = `translateY(${rate}px)`;
          }
          
          scrollRafId = null;
        });
      }
    }, { passive: true });
  }

  // Enhanced video loading and error handling
  const projectVideos = document.querySelectorAll(
    '.project-video, .project-detail-video',
  );

  projectVideos.forEach((video) => {
    let isPlaying = false;
    let loadedMetadata = false;

    // 确保视频容器有正确的宽高比
    video.addEventListener('loadedmetadata', function () {
      if (loadedMetadata) return; // 防止重复执行
      loadedMetadata = true;

      if (this.classList.contains('project-detail-video')) {
        const aspectRatio = this.videoWidth / this.videoHeight;
        const container = this.parentElement;

        // 根据视频宽高比动态调整容器高度
        if (aspectRatio > 2) {
          container.style.height = '400px';
        } else if (aspectRatio > 1.6) {
          container.style.height = '500px';
        } else if (aspectRatio > 1.2) {
          container.style.height = '600px';
        } else {
          container.style.height = '700px';
        }

        // 确保视频完全可见
        this.style.objectFit = 'contain';
        this.style.background = '#000';
      }
    });

    // 优化视频加载处理
    video.addEventListener('loadeddata', function () {
      if (this.classList.contains('project-detail-video')) {
        const placeholders = this.parentElement.querySelectorAll(
          '.project-image-placeholder',
        );
        placeholders.forEach((p) => p.remove());
      }

      // 只在未播放时尝试播放
      if (!isPlaying) {
        this.play()
          .then(() => {
            isPlaying = true;
          })
          .catch((e) => {
            console.log('Video autoplay failed:', e);
            if (this.classList.contains('project-detail-video')) {
              this.style.display = 'none';
              const placeholder = document.createElement('div');
              placeholder.className = 'project-image-placeholder';
              placeholder.innerHTML =
                '<span>REALITYEATER Game Interface</span>';
              this.parentElement.appendChild(placeholder);
            }
          });
      }
    });

    // 简化错误处理
    video.addEventListener('error', function () {
      console.log('Video failed to load');
      if (this.classList.contains('project-detail-video')) {
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'project-image-placeholder';
        placeholder.innerHTML = '<span>REALITYEATER Game Interface</span>';
        this.parentElement.appendChild(placeholder);
      }
    });

    // 优化项目卡片视频交互 - 性能优化版
    const projectCard = video.closest('.project-card');
    if (projectCard) {
      projectCard.addEventListener('mouseenter', function () {
        // 只在视频未播放时尝试播放
        if (!isPlaying && video.paused) {
          // 使用 requestIdleCallback 在浏览器空闲时播放视频
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
              video.play()
                .then(() => { isPlaying = true; })
                .catch((e) => console.log('Video play failed:', e));
            });
          } else {
            video.play()
              .then(() => { isPlaying = true; })
              .catch((e) => console.log('Video play failed:', e));
          }
        }
      }, { passive: true });

      // 移除mouseleave的暂停逻辑，让视频持续播放
    }
  });

  // Enhanced image loading and error handling with smooth interactions
  const projectImages = document.querySelectorAll('.project-detail-image');

  projectImages.forEach((image, index) => {
    // Handle image loading
    image.addEventListener('load', function () {
      // 图片加载成功时的处理
      this.style.opacity = '1';
      this.style.transform = 'translateY(0)';
      this.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Handle image error
    image.addEventListener('error', function () {
      console.log('Image failed to load:', this.src);
      // 创建占位符
      const placeholder = document.createElement('div');
      placeholder.className = 'project-image-placeholder';
      placeholder.innerHTML = '<span>Image Loading...</span>';
      placeholder.style.height = '100%';
      this.parentElement.appendChild(placeholder);
      this.style.display = 'none';
    });

    // 初始设置
    image.style.opacity = '0';
    image.style.transform = 'translateY(20px)';

    // 添加延迟加载动画
    setTimeout(() => {
      image.style.opacity = '1';
      image.style.transform = 'translateY(0)';
      image.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    }, index * 100 + 300);
  });

  // 为图片容器添加平滑的交互效果 - 性能优化版
  const projectImageItems = document.querySelectorAll('.project-image-item');

  projectImageItems.forEach((item) => {
    // 预设 GPU 加速
    item.style.willChange = 'transform';

    item.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-8px)';
      this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';

      const image = this.querySelector(
        '.project-detail-image, .project-detail-video',
      );
      if (image) {
        image.style.transform = 'scale(1.02)';
        image.style.filter = 'brightness(1.05)';
      }
    }, { passive: true });

    item.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';

      const image = this.querySelector(
        '.project-detail-image, .project-detail-video',
      );
      if (image) {
        image.style.transform = 'scale(1)';
        image.style.filter = 'brightness(1)';
      }
    }, { passive: true });

    // 移除原有的点击效果，因为现在点击会打开大图浏览器
    // 原有的点击效果已被MediaLightbox接管
  });

  // 初始化Spline文字特效
  const splineText = document.querySelector('.project-spline-text');
  if (splineText) {
    const splineViewer = splineText.querySelector('spline-viewer');
    if (splineViewer) {
      // 确保Spline场景正确加载
      splineViewer.addEventListener('load', () => {
        console.log('Spline text effect loaded successfully');
        // 修改 Shadow DOM 样式
        modifySplineViewerStyles(splineViewer);
      });

      splineViewer.addEventListener('error', (e) => {
        console.error('Spline text effect failed to load:', e);
      });
    }
  }

  // 首页主球体特效处理
  const homeSplineContainer = document.querySelector('.home-page .spline-container');
  if (homeSplineContainer) {
    const homeSplineViewer = homeSplineContainer.querySelector('spline-viewer');
    if (homeSplineViewer) {
      // 1. 尝试监听加载完成
      homeSplineViewer.addEventListener('load', () => {
        console.log('Home sphere loaded');
        modifySplineViewerStyles(homeSplineViewer);
      });

      // 2. 兜底：如果load事件没触发（可能已加载），直接尝试注入样式
      // 并设置一个定时器再次尝试，确保水印被隐藏
      setTimeout(() => {
        modifySplineViewerStyles(homeSplineViewer);
      }, 1000);
      
      setTimeout(() => {
        modifySplineViewerStyles(homeSplineViewer);
      }, 3000);
    }
  }

  // 通用函数：修改Spline Viewer样式（隐藏水印等）
  function modifySplineViewerStyles(viewer) {
    if (!viewer || !viewer.shadowRoot) return;
    
    try {
      const shadow = viewer.shadowRoot;
      // 创建样式元素
      const style = document.createElement('style');
      // 强制隐藏水印和Logo的各种可能选择器
      style.textContent = `
        #logo, .logo, .spline-watermark, #spline-watermark, a[href*="spline.design"], 
        [class*="watermark"], [id*="watermark"] {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `;
      shadow.appendChild(style);
      console.log('Spline styles injected to hide watermark');
    } catch (e) {
      console.error('Error injecting Spline styles:', e);
    }
  }

  // ========== 移动端首页特效处理 ==========
  function initMobileHomeEffects() {
    // 只在移动端执行
    if (window.innerWidth > 768) return;

    // 1. 初始化Intersection Observer，用于文字上浮淡入
    const mobileTextObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
          // 可选：一旦显示后就不再观察，减少性能消耗
          mobileTextObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    });

    // 选择需要动画的元素
    const textElements = document.querySelectorAll('.home-logo, .home-info .info-section, .nav-hint');
    textElements.forEach(el => {
      el.classList.add('fade-in-hidden'); // 初始隐藏状态
      mobileTextObserver.observe(el);
    });
  }

  // 调用移动端特效初始化
  initMobileHomeEffects();

  // 监听窗口大小变化，以适应横竖屏切换
  window.addEventListener('resize', () => {
    // 简单的防抖动
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
       initMobileHomeEffects();
    }, 250);
  });

});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements when portfolio page is shown
function observeElements() {
  document.querySelectorAll('.project-card').forEach((card) => {
    observer.observe(card);
  });
}

// Call observe function when needed
// setTimeout(observeElements, 1000);

// Media Lightbox 功能
class MediaLightbox {
  constructor() {
    this.lightbox = document.getElementById('media-lightbox');
    this.lightboxImage = document.getElementById('lightbox-image');
    this.lightboxVideo = document.getElementById('lightbox-video');
    this.lightboxIframe = document.getElementById('lightbox-iframe');
    this.lightboxClose = document.getElementById('lightbox-close');
    this.lightboxPrev = document.getElementById('lightbox-prev');
    this.lightboxNext = document.getElementById('lightbox-next');
    this.lightboxCurrent = document.getElementById('lightbox-current');
    this.lightboxTotal = document.getElementById('lightbox-total');
    this.lightboxTitle = document.getElementById('lightbox-title');
    this.lightboxMediaContainer = document.querySelector('.lightbox-media-container');
    
    this.currentIndex = 0;
    this.mediaItems = [];
    this.isOpen = false;
    
    this.init();
  }
  
  init() {
    // 关闭按钮事件
    this.lightboxClose.addEventListener('click', () => this.close());
    
    // 导航按钮事件
    this.lightboxPrev.addEventListener('click', () => this.previous());
    this.lightboxNext.addEventListener('click', () => this.next());
    
    // 点击遮罩关闭
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox || e.target.classList.contains('lightbox-overlay')) {
        this.close();
      }
    });
    
    // 键盘事件
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      
      switch(e.key) {
        case 'Escape':
          this.close();
          break;
        case 'ArrowLeft':
          this.previous();
          break;
        case 'ArrowRight':
          this.next();
          break;
      }
    });
    
    // 初始化媒体项目点击事件
    this.initializeMediaItems();
  }
  
  initializeMediaItems() {
    // 为所有项目详情页面的媒体元素添加点击事件
    document.addEventListener('click', (e) => {
      const mediaElement = e.target.closest('.project-image-item');
      if (!mediaElement) return;
      
      // 检查是否在项目详情页面中
      const projectDetailPage = document.getElementById('project-detail-page');
      if (!projectDetailPage.classList.contains('active')) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      // 收集当前页面的所有媒体项目
      this.collectMediaItems();
      
      // 找到当前点击的媒体在列表中的索引
      const allMediaItems = document.querySelectorAll('.project-content-section .project-image-item');
      this.currentIndex = Array.from(allMediaItems).indexOf(mediaElement);
      
      // 打开灯箱
      this.open();
    });
  }
  
  collectMediaItems() {
    this.mediaItems = [];
    const mediaItems = document.querySelectorAll('.project-content-section .project-image-item');
    
    mediaItems.forEach((item, index) => {
      const img = item.querySelector('.project-detail-image');
      const video = item.querySelector('.project-detail-video');
      const iframe = item.querySelector('.project-detail-iframe');
      
      if (img) {
        this.mediaItems.push({
          type: 'image',
          src: img.src,
          alt: img.alt || `Image ${index + 1}`,
          title: img.alt || `Project Image ${index + 1}`
        });
      } else if (video) {
        const source = video.querySelector('source');
        this.mediaItems.push({
          type: 'video',
          src: source ? source.src : video.src,
          alt: `Video ${index + 1}`,
          title: `Project Video ${index + 1}`
        });
      } else if (iframe) {
        this.mediaItems.push({
          type: 'iframe',
          src: iframe.src,
          alt: `Interactive Content ${index + 1}`,
          title: `Interactive Content ${index + 1}`
        });
      }
    });
  }
  
  open() {
    if (this.mediaItems.length === 0) return;
    
    this.isOpen = true;
    document.body.classList.add('lightbox-open');
    this.lightbox.classList.add('active');
    
    this.updateCounter();
    this.showMedia();
    this.updateNavigation();
  }
  
  close() {
    this.isOpen = false;
    document.body.classList.remove('lightbox-open');
    this.lightbox.classList.remove('active');
    
    // 强制停止lightbox视频的音频
    this.forceStopLightboxVideo();
    
    // 清理媒体内容
    this.hideAllMedia();
  }
  
  forceStopLightboxVideo() {
    // 立即静音
    this.lightboxVideo.muted = true;
    
    // 暂停播放
      this.lightboxVideo.pause();
    
    // 重置时间
      this.lightboxVideo.currentTime = 0;
    
    // 重置音量
    this.lightboxVideo.volume = 0;
    
    // 不清空src，而是通过移除事件监听器来停止音频
    // 移除所有事件监听器
    this.lightboxVideo.onloadeddata = null;
    this.lightboxVideo.onerror = null;
    this.lightboxVideo.onended = null;
    this.lightboxVideo.ontimeupdate = null;
  }
  
  previous() {
    if (this.mediaItems.length <= 1) return;
    
    // 停止当前视频音频
    if (this.lightboxVideo.classList.contains('active')) {
      this.lightboxVideo.pause();
      this.lightboxVideo.muted = true;
      this.lightboxVideo.volume = 0;
    }
    
    this.currentIndex = (this.currentIndex - 1 + this.mediaItems.length) % this.mediaItems.length;
    this.showMedia();
    this.updateCounter();
  }
  
  next() {
    if (this.mediaItems.length <= 1) return;
    
    // 停止当前视频音频
    if (this.lightboxVideo.classList.contains('active')) {
      this.lightboxVideo.pause();
      this.lightboxVideo.muted = true;
      this.lightboxVideo.volume = 0;
    }
    
    this.currentIndex = (this.currentIndex + 1) % this.mediaItems.length;
    this.showMedia();
    this.updateCounter();
  }
  
  showMedia() {
    const mediaItem = this.mediaItems[this.currentIndex];
    if (!mediaItem) return;
    
    // 显示加载状态
    this.lightboxMediaContainer.classList.add('loading');
    
    // 隐藏所有媒体
    this.hideAllMedia();
    
    // 更新标题
    this.lightboxTitle.textContent = mediaItem.title;
    
    // 根据媒体类型显示对应元素
    switch(mediaItem.type) {
      case 'image':
        this.showImage(mediaItem);
        break;
      case 'video':
        this.showVideo(mediaItem);
        break;
      case 'iframe':
        this.showIframe(mediaItem);
        break;
    }
  }
  
  showImage(mediaItem) {
    this.lightboxImage.src = mediaItem.src;
    this.lightboxImage.alt = mediaItem.alt;
    this.lightboxImage.classList.add('active');
    
    // 图片加载完成后移除加载状态
    this.lightboxImage.onload = () => {
      this.lightboxMediaContainer.classList.remove('loading');
    };
    
    this.lightboxImage.onerror = () => {
      this.lightboxMediaContainer.classList.remove('loading');
      console.error('Failed to load image:', mediaItem.src);
    };
  }
  
  showVideo(mediaItem) {
    // 先重置视频状态
    this.lightboxVideo.pause();
    this.lightboxVideo.currentTime = 0;
    
    // 设置新的视频源
    const source = this.lightboxVideo.querySelector('source');
    source.src = mediaItem.src;
    
    // 重新加载视频
    this.lightboxVideo.load();
    this.lightboxVideo.classList.add('active');
    
    // 确保lightbox视频不是静音状态，允许播放音频
    this.lightboxVideo.muted = false;
    this.lightboxVideo.volume = 1; // 确保音量正常
    
    // 视频加载完成后移除加载状态并自动播放
    this.lightboxVideo.onloadeddata = () => {
      this.lightboxMediaContainer.classList.remove('loading');
      // 自动播放视频（有音频）
      this.lightboxVideo.play().catch(e => {
        console.log('Video autoplay failed:', e);
      });
    };
    
    this.lightboxVideo.onerror = () => {
      this.lightboxMediaContainer.classList.remove('loading');
      console.error('Failed to load video:', mediaItem.src);
    };
  }
  
  showIframe(mediaItem) {
    // 如果是YouTube视频且包含mute=1参数，改为mute=0以在lightbox中播放声音
    let src = mediaItem.src;
    if (src.includes('youtube.com/embed') && src.includes('mute=1')) {
      src = src.replace('mute=1', 'mute=0');
    }
    
    this.lightboxIframe.src = src;
    this.lightboxIframe.classList.add('active');
    
    // iframe加载完成后移除加载状态
    this.lightboxIframe.onload = () => {
      this.lightboxMediaContainer.classList.remove('loading');
    };
    
    this.lightboxIframe.onerror = () => {
      this.lightboxMediaContainer.classList.remove('loading');
      console.error('Failed to load iframe:', mediaItem.src);
    };
  }
  
  hideAllMedia() {
    this.lightboxImage.classList.remove('active');
    this.lightboxVideo.classList.remove('active');
    this.lightboxIframe.classList.remove('active');
    
    // 重置图片和iframe的src
    this.lightboxImage.src = '';
    this.lightboxIframe.src = '';
    
    // 停止视频但保留src以避免重新加载问题
      this.lightboxVideo.pause();
    this.lightboxVideo.muted = true;
      this.lightboxVideo.currentTime = 0;
    this.lightboxVideo.volume = 0;
  }
  
  updateCounter() {
    this.lightboxCurrent.textContent = this.currentIndex + 1;
    this.lightboxTotal.textContent = this.mediaItems.length;
  }
  
  updateNavigation() {
    // 如果只有一个媒体项目，隐藏导航按钮
    if (this.mediaItems.length <= 1) {
      this.lightboxPrev.classList.add('hidden');
      this.lightboxNext.classList.add('hidden');
    } else {
      this.lightboxPrev.classList.remove('hidden');
      this.lightboxNext.classList.remove('hidden');
    }
  }
}

// 初始化媒体灯箱
const mediaLightbox = new MediaLightbox();

// About page scroll listener for contact section
let aboutScrollListener = null;
let lastScrollY = 0;
let isContactVisible = false;

function initAboutScrollListener() {
  // Remove existing listener if any
  if (aboutScrollListener) {
    const portfolioPage = document.getElementById('portfolio-page');
    portfolioPage.removeEventListener('scroll', aboutScrollListener);
  }
  
  // Reset variables
  lastScrollY = 0;
  isContactVisible = false;
  
  // Create new scroll listener
  aboutScrollListener = function() {
    const aboutSection = document.getElementById('about');
    const contactSection = document.getElementById('contact');
    const portfolioPage = document.getElementById('portfolio-page');
    
    // Only work when about section is visible
    if (!aboutSection.classList.contains('about-active')) {
      return;
    }
    
    const currentScrollY = portfolioPage.scrollTop;
    const containerHeight = portfolioPage.clientHeight;
    const contentHeight = portfolioPage.scrollHeight;
    
    // Check if we're near the bottom (更严格的检测条件)
    const isAtBottom = currentScrollY + containerHeight >= contentHeight - 300;
    
    // Check scroll direction
    const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
    
    if (isAtBottom && scrollDirection === 'down' && !isContactVisible) {
      // Show contact when scrolling down to bottom
      contactSection.classList.add('active');
      isContactVisible = true;
    } else if (scrollDirection === 'up' && isContactVisible && currentScrollY < contentHeight - containerHeight - 400) {
      // Hide contact when scrolling up from bottom
      contactSection.classList.remove('active');
      isContactVisible = false;
    }
    
    lastScrollY = currentScrollY;
  };
  
  // Add scroll listener to portfolio page container
  const portfolioPage = document.getElementById('portfolio-page');
  portfolioPage.addEventListener('scroll', aboutScrollListener);
}

// Clean up about scroll listener when leaving about page
function cleanupAboutScrollListener() {
  if (aboutScrollListener) {
    const portfolioPage = document.getElementById('portfolio-page');
    portfolioPage.removeEventListener('scroll', aboutScrollListener);
    aboutScrollListener = null;
  }
  
  // Hide contact if visible
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.classList.remove('active');
  }
  
  isContactVisible = false;
}
