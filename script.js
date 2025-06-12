document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const homePage = document.getElementById('home-page');
    const portfolioPage = document.getElementById('portfolio-page');
    const projectDetailPage = document.getElementById('project-detail-page');
    const mainTitle = document.getElementById('main-title');
    const backToHome = document.getElementById('back-to-home');
    const splineContainer = document.querySelector('.spline-container');
    const projectBackBtn = document.getElementById('project-back-btn');
    
    // Project data
    const projectData = {
        'REALITYEATER': {
            title: 'REALITYEATER',
            category: '[ AI / INTERACTIVE ]',
            year: '2024',
            description: 'A cyberpunk-inspired AI-powered digital pet game that "eats" your reality through object recognition.',
            role: 'Concept Design, Frontend Development, AI Integration, UI/UX Design',
            duration: '2 months',
            tools: 'JavaScript, HTML/CSS, OpenAI API, Vercel, Pixel Art'
        },
        'Tide Bound': {
            title: 'Tide Bound',
            category: '[ GAME DESIGN / EDUCATION ]',
            year: '2025',
            description: 'A science-driven, role-based card game about ocean conservation and human impact designed for beach play.',
            role: 'Game Design, Role System Design, Card Concept & Visual Design, UX Testing',
            duration: '2 months',
            tools: 'Illustrator, Photoshop, InDesign, Physical Prototyping, Research-based Design Methods'
        },
        'Shmupformer': {
            title: 'Shmupformer',
            category: '[ GAME DEVELOPMENT / COLLABORATION ]',
            year: '2025',
            description: 'A collaborative genre-bending bullet hell platformer exploring emotional expression through game mechanics.',
            role: 'Core Gameplay Design, Mechanic Balancing, UI Polish, Player Feedback Integration',
            duration: '4 months',
            tools: 'GameMaker Studio, Aseprite, GML, Mind Mapping, Collaborative Design Docs'
        },
        'Float': {
            title: 'Float',
            category: '[ WOODWORKING / SCULPTURE ]',
            year: '2025',
            description: 'A sculptural wooden bowl that defies gravity through bent lamination and elegant joinery.',
            role: 'Solo project – Concept Design, Woodturning, Lamination, Assembly, Finish',
            duration: '2 weeks',
            tools: 'Lathe, Band Saw, Clamps, Wood Glue, Dowels, Cherry Block, 3-ply Polywood'
        },
        'Dice Birdhouse': {
            title: 'Dice Birdhouse',
            category: '[ ENVIRONMENTAL / SPECULATIVE ]',
            year: '2024',
            description: 'A speculative modular birdhouse that offers birds agency through playful, dice-like variability.',
            role: 'Solo project – Concept Development, Physical Prototyping, Environmental Research, Fabrication',
            duration: '4 weeks',
            tools: 'Foam Core, Wood, Laser Cutting, Illustrator, Environmental Observation, Sketch Modeling'
        },
        'FateRISD: Final Bubble': {
            title: 'FateRISD: Final Bubble',
            category: '[ GAME JAM / VISUAL NOVEL ]',
            year: '2025',
            description: 'A Fate-inspired parody game created in 48 hours for the 2025 Global Game Jam.',
            role: 'Game Director, Writer, Sprite Artist, UI Design (Collaborative team project with fellow RISD students)',
            duration: '48 hours',
            tools: 'Ren\'Py, Clip Studio Paint, Photoshop, Git, Google Docs'
        },
        'New Project Title': {
            title: 'New Project Title',
            category: '[ CATEGORY / TYPE ]',
            year: '2025',
            description: 'Project description: Please fill in your new project detailed description and objectives here.',
            role: 'Role and responsibilities: Please specify your role and work responsibilities in this project',
            duration: 'Project duration: e.g., 3 months / 2 weeks etc.',
            tools: 'Tools used: Please list the software, tools and technologies used in the project'
        }
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
        homePage.style.display = 'none';
        portfolioPage.style.display = 'block';
        projectDetailPage.classList.remove('active');
        portfolioPage.classList.add('page-transition', 'active');
        
        // 移除主页的水印遮挡层
        const existingBlocker = document.getElementById('spline-watermark-blocker');
        if (existingBlocker) {
            existingBlocker.remove();
        }
        
        // 显示Spline文字特效在作品集页面
        const splineText = document.getElementById('projectSplineText');
        if (splineText) {
            console.log('Showing Spline text effect on portfolio page');
            splineText.style.display = 'block';
            splineText.style.position = 'absolute';
            splineText.style.top = '90px';
            splineText.style.left = '60%';
            splineText.style.transform = 'translateX(-50%)';
            splineText.style.width = '650px';
            splineText.style.height = '300px';
            splineText.style.zIndex = '1';
            splineText.style.opacity = '1';
            splineText.style.visibility = 'visible';
            splineText.style.pointerEvents = 'none';
            splineText.style.background = 'transparent';
            splineText.classList.add('visible');
            
            // 确保Spline viewer可以交互并放大
            const splineViewer = splineText.querySelector('spline-viewer');
            if (splineViewer) {
                splineViewer.style.pointerEvents = 'auto';
                splineViewer.style.transform = 'scale(1.3)';
                splineViewer.style.transformOrigin = 'center center';
            }
        }
        
        // Reset and restart all videos when entering portfolio page
        setTimeout(() => {
            const allVideos = document.querySelectorAll('.project-card-video, .project-video');
            allVideos.forEach(video => {
                if (video.tagName === 'VIDEO') {
                    video.currentTime = 0;
                    video.play().catch(e => console.log('Video autoplay prevented:', e));
                }
            });
        }, 100);
        
        // Animate project cards
        setTimeout(() => {
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 100);
            });
        }, 300);
    }
    
    function showHome() {
        portfolioPage.style.display = 'none';
        projectDetailPage.classList.remove('active');
        homePage.style.display = 'block';
        
        // 隐藏Spline文字特效
        const splineText = document.getElementById('projectSplineText');
        if (splineText) {
            splineText.style.opacity = '0';
            splineText.style.visibility = 'hidden';
            splineText.classList.remove('visible');
            setTimeout(() => {
                splineText.style.display = 'none';
            }, 600);
        }
        
        // Reset project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.classList.remove('visible');
        });
        
        // 重新创建水印遮挡层
        setTimeout(createWatermarkBlocker, 100);
    }
    
    // Project navigation functionality
    function updateProjectNavigation(currentProjectTitle) {
        const projectTitles = ['REALITYEATER', 'Tide Bound', 'Shmupformer', 'Float', 'Dice Birdhouse', 'FateRISD: Final Bubble', 'New Project Title'];
        const currentIndex = projectTitles.indexOf(currentProjectTitle);
        
        const prevProjectBtn = document.getElementById('prev-project');
        const nextProjectBtn = document.getElementById('next-project');
        
        // Previous project
        if (currentIndex > 0) {
            const prevProject = projectTitles[currentIndex - 1];
            prevProjectBtn.style.display = 'flex';
            prevProjectBtn.onclick = () => showProjectDetail(prevProject);
            prevProjectBtn.querySelector('span:last-child').textContent = `Previous Project`;
        } else {
            prevProjectBtn.style.display = 'none';
        }
        
        // Next project
        if (currentIndex < projectTitles.length - 1) {
            const nextProject = projectTitles[currentIndex + 1];
            nextProjectBtn.style.display = 'flex';
            nextProjectBtn.onclick = () => showProjectDetail(nextProject);
            nextProjectBtn.querySelector('span:first-child').textContent = `Next Project`;
        } else {
            nextProjectBtn.style.display = 'none';
        }
    }
    
    function showProjectDetail(projectTitle) {
        const project = projectData[projectTitle];
        if (!project) return;
        
        console.log('=== Starting showProjectDetail ===');
        
        // 隐藏Spline文字特效（因为现在进入详情页面）
        const splineText = document.getElementById('projectSplineText');
        if (splineText) {
            splineText.style.opacity = '0';
            splineText.style.visibility = 'hidden';
            splineText.classList.remove('visible');
            setTimeout(() => {
                splineText.style.display = 'none';
            }, 300);
        }
        
        // 预先更新内容，避免在显示时才更新导致的卡顿
        updateProjectSections(projectTitle);
        
        // Update project detail content
        document.getElementById('project-hero-title').textContent = project.title;
        document.getElementById('project-hero-category').textContent = project.category;
        document.getElementById('project-hero-year').textContent = project.year;
        document.getElementById('project-hero-description').textContent = project.description;
        document.getElementById('project-role').textContent = project.role;
        document.getElementById('project-duration').textContent = project.duration;
        document.getElementById('project-tools').textContent = project.tools;
        
        // Update navigation buttons
        updateProjectNavigation(projectTitle);
        
        // 滚动到页面顶部
        projectDetailPage.scrollTop = 0;
        
        // 立即显示页面，避免延迟
        projectDetailPage.classList.add('active');
        
        // 优化动画时序，减少卡顿感
        requestAnimationFrame(() => {
            const animateElements = projectDetailPage.querySelectorAll('.project-hero, .project-content-section');
            animateElements.forEach((el, index) => {
                // 使用适中的延迟，保持流畅感
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 150); // 调整为150ms
            });
        });
    }
    
    function updateProjectSections(projectTitle) {
        const overviewSection = document.querySelector('[data-section="overview"]');
        const processSection = document.querySelector('[data-section="process"]');
        const resultsSection = document.querySelector('[data-section="results"]');
        
        if (projectTitle === 'REALITYEATER') {
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
                    <p>REALITYEATER is a virtual pet browser game where players use real-world items to feed a glitchy, sentient digital pet. It blends AI-powered interactivity with narrative design.</p>
                    <p>The project explores the intersection of physical and digital reality through webcam-based object recognition, creating an immersive cyberpunk experience.</p>
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
                    <h3>AI Integration & Object Recognition</h3>
                    <p>Built an interactive pet with camera-based object recognition using the OpenAI API, enabling real-world object interaction through the webcam.</p>
                    <h3>Cyberpunk Visual Design</h3>
                    <p>Designed glitch-style UI inspired by The Matrix, using pixel art aesthetics and terminal-like interfaces to create an authentic cyberpunk atmosphere.</p>
                    <h3>Behavioral Logic System</h3>
                    <p>Created JSON-based interaction logic and emotional states for the pet, balancing gameplay through hunger timers and user feedback loops.</p>
                </div>
            `;
            
            resultsSection.innerHTML = `
                <h2 class="project-section-title">Final Outcome</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="realityeater/realityeater-final-1.png" alt="REALITYEATER Final Outcome 1" class="project-detail-image">
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
                </div>
                <div class="project-text-content">
                    <p>Live prototype available at <a href="https://digital-pet-code-world.vercel.app/" target="_blank" style="color: #fff; text-decoration: underline; opacity: 0.8;">digital-pet-code-world.vercel.app</a></p>
                    <p>Players can interact with the pet through typed messages and feed it real objects via webcam input, creating a unique blend of AI-powered gaming and reality interaction.</p>
                    <h3>Key Learnings</h3>
                    <p>• How to integrate AI APIs into interactive web experiences</p>
                    <p>• Importance of user feedback in balancing novelty with usability</p>
                    <p>• Crafting a unique digital personality through minimalist UI and behavior design</p>
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
                                src="https://www.youtube.com/embed/liMMEkX0Dlg?autoplay=1&mute=1&loop=1&playlist=liMMEkX0Dlg&controls=1&showinfo=0&rel=0&modestbranding=1&preload=metadata" 
                                title="Tide Bound Game Overview" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                referrerpolicy="strict-origin-when-cross-origin" 
                                allowfullscreen
                                loading="eager">
                            </iframe>
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>Tide Bound is a tabletop card game designed for beach play that encourages both children and adults to engage with marine ecology and environmental decision-making through interactive gameplay.</p>
                    <p>The game combines science communication with dynamic player interaction, creating an educational experience that balances entertainment with environmental awareness.</p>
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
                    <h3>Role-Based System Design</h3>
                    <p>Designed a role-based system where players act as different human specialists (scientist, fisher, policy maker, activist, etc.), each with unique abilities and event decks.</p>
                    <h3>Dual-Sided Event Cards</h3>
                    <p>Introduced dual-sided event cards, including humorous "soft satire" decks to reflect real-world dilemmas and environmental challenges.</p>
                    <h3>Physical Prototyping</h3>
                    <p>Created waterproof, wind-resistant card prototypes to enhance playability in natural settings like beaches, integrating mechanics where player choices influence both short-term human benefit and long-term ocean health.</p>
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
                    <h3>What I Learned</h3>
                    <p>• Balancing education and entertainment in serious game design</p>
                    <p>• How role asymmetry can increase empathy and player engagement with complex systems</p>
                    <p>• The value of physical prototyping and testing environments when designing for outdoor play</p>
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
                    <p>Shmupformer is a team-developed 2D action game that fuses platformer mechanics with bullet hell intensity. It explores the theme of emotional repression through gameplay, where mastery and expression emerge from precise control and strategic flight.</p>
                    <p>This collaborative project demonstrates how genre-bending mechanics can create unique emotional experiences in gaming.</p>
                    <h3>Collaborative Team</h3>
                    <p>Developed in collaboration with Yingjie Yu and Zhiwei Huang, combining diverse design perspectives and technical expertise.</p>
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
                    <h3>Hybrid Genre System Design</h3>
                    <p>Collaboratively brainstormed a hybrid genre system: grounded platforming transforms into flight mode with stamina and shooting mechanics.</p>
                    <h3>360° Manual Aiming System</h3>
                    <p>Built a 360° manual aiming system and resource-based mechanics like Overload and Stamina for layered decision-making and strategic gameplay.</p>
                    <h3>Iterative Testing & Refinement</h3>
                    <p>Prioritized iterative testing—removing features like "stomp" and "dropkick" that conflicted with bullet-dodging flow. Focused on readable feedback: flashing hitboxes, smaller reticle, and simplified tutorials after playtests.</p>
                    <h3>Player-Centric Design</h3>
                    <p>All design choices aimed to respect player instincts while pushing skill development and emotional engagement.</p>
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
                    <h3>What I Learned</h3>
                    <p>• How to manage collaborative workflows and scope across design, code, and playtesting</p>
                    <p>• Why cutting features can be as important as adding them—refining the core idea is key</p>
                    <p>• The art of balancing challenge, clarity, and emotional theme in gameplay mechanics</p>
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
                    <p>Float is a woodworking project that explores the tension between solidity and lightness. A solid cherry bowl appears to "float" above ground, supported by three gracefully curved polywood legs—achieved through bent lamination and thoughtful joinery.</p>
                    <p>This sculptural piece combines traditional woodworking techniques with modern design principles to create an illusion of weightlessness.</p>
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
                    <p>Turned the bowl on a lathe—learned to stabilize large wood masses and repaired piercing accidents using sawdust and glue.</p>
                    <h3>Bent Lamination</h3>
                    <p>Used bent lamination for the legs, requiring pre-planning, form design, and layering techniques to achieve the graceful curves.</p>
                    <h3>Joinery Design</h3>
                    <p>Designed joints that could invisibly support the weight while enhancing the illusion of floating.</p>
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
                    <h3>What I Learned</h3>
                    <p>• Anticipation is key—especially when joining mixed woods with different properties</p>
                    <p>• How to adapt when plans go off-course and find creative repair solutions</p>
                    <p>• Sculptural woodworking is both precise and forgiving—if you listen to the material</p>
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
                    <p>Dice Birdhouse is a conceptual bird habitat that explores the intersection of environmental design and animal autonomy. Inspired by the form and randomness of a dice, each face offers a different access point or shelter configuration—giving birds the ability to choose how and where they enter, nest, and rest.</p>
                    <p>This speculative design project challenges traditional birdhouse concepts by incorporating variability and choice into the structure itself.</p>
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
                    <p>Studied bird behavior, especially their preferences for shelter, visibility, and escape routes to inform design decisions.</p>
                    <h3>Geometric Exploration</h3>
                    <p>Explored how geometric constraints could still offer flexibility: each dice face represents a different environmental function (ventilation, shadow, concealment, access).</p>
                    <h3>Physical Prototyping</h3>
                    <p>Created multiple prototypes to test spatial usability and interaction for small birds, iterating on form and function.</p>
                    <h3>Modular Design</h3>
                    <p>Final design offers a modular, rotatable birdhouse that adapts depending on placement and user preferences.</p>
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
                    <p>The playful form masks a serious purpose: allowing birds to adapt to changing urban microclimates and threats.</p>
                    <h3>What I Learned</h3>
                    <p>• How modularity and randomness can foster both engagement and protection in animal-centered design</p>
                    <p>• That environmental empathy can be embedded into form, not just function</p>
                    <p>• Prototyping for non-human users requires both imagination and behavioral realism</p>
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
                    <p>FateRISD: Final Bubble is a humorous, fast-paced visual novel and battle parody made during the 2025 Global Game Jam. Centered around the theme "bubble", the game pays tribute to the Fate franchise while featuring original characters inspired by RISD students.</p>
                    <p>It celebrates friendship, absurdity, and anime tropes—all wrapped in a burst of chaotic creativity developed in just 48 hours.</p>
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
                    <p>Conceptualized the game in response to the Global Game Jam theme "bubble," interpreting it as emotional tension, protective illusions, and narrative bubbles.</p>
                    <h3>Collaborative Character Creation</h3>
                    <p>Collaborated with friends who voiced, drew, or inspired each character—turning real RISD personalities into Servants and Masters.</p>
                    <h3>Rapid Development</h3>
                    <p>Created branching dialogue, basic battle logic, and comedic event scenes within the 48-hour time constraint.</p>
                    <h3>Visual Design</h3>
                    <p>Designed all character sprites, visual UI, and interface in under 48 hours using Clip Studio Paint and Photoshop.</p>
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
                    <p>The game includes multiple endings, satirical attacks, and anime-style dialogue—all done with limited sleep and unlimited laughter.</p>
                    <h3>What I Learned</h3>
                    <p>• How to manage rapid creative decisions under intense time constraints</p>
                    <p>• The power of collaboration and humor in building memorable experiences</p>
                    <p>• That game jams are not only about polish—but about joy, bonding, and finishing</p>
                </div>
            `;
        } else if (projectTitle === 'New Project Title') {
            // New Project Title content
            overviewSection.innerHTML = `
                <h2 class="project-section-title">Overview</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="project7/project7-overview.png" alt="New Project Overview" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>This is the overview description of your new project. Please replace this with your project introduction, explaining the goals, concept, and main features.</p>
                    <p>You can add a second paragraph here to further elaborate on the project background and significance.</p>
                </div>
            `;
            
            processSection.innerHTML = `
                <h2 class="project-section-title">Development Process</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-medium">
                            <img src="project7/project7-process-1.png" alt="New Project Development Process 1" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-medium">
                            <img src="project7/project7-process-2.png" alt="New Project Development Process 2" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <h3>Design Phase</h3>
                    <p>Describe your design process, including initial conceptualization, sketching, and prototyping.</p>
                    <h3>Development Phase</h3>
                    <p>Describe the technical implementation process, challenges encountered, and solutions developed.</p>
                    <h3>Testing & Iteration</h3>
                    <p>Describe the testing process, user feedback collection, and product optimization iterations.</p>
                </div>
            `;
            
            resultsSection.innerHTML = `
                <h2 class="project-section-title">Final Outcome</h2>
                <div class="project-image-gallery">
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="project7/project7-final-1.png" alt="New Project Final Outcome 1" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="project7/project7-final-2.png" alt="New Project Final Outcome 2" class="project-detail-image">
                        </div>
                    </div>
                    <div class="project-image-item">
                        <div class="project-image-large">
                            <img src="project7/project7-final-3.png" alt="New Project Final Outcome 3" class="project-detail-image">
                        </div>
                    </div>
                </div>
                <div class="project-text-content">
                    <p>If you have an online link, you can add it here: <a href="https://your-project-link.com" target="_blank" style="color: #fff; text-decoration: underline; opacity: 0.8;">Project Link</a></p>
                    <p>Describe the characteristics, functionality, and user response of the final outcome.</p>
                    <h3>Key Learnings</h3>
                    <p>• First important experience learned from this project</p>
                    <p>• Second important experience or skill acquired</p>
                    <p>• Inspiration and impact for future projects</p>
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
        const projectVideos = document.querySelectorAll('.project-detail-video, .project-card-video');
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
        projectImageItems.forEach(item => {
            let hoverTimeout;
            
            item.addEventListener('mouseenter', function() {
                clearTimeout(hoverTimeout);
                this.style.transform = 'translateY(-8px)';
                this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                
                const media = this.querySelector('.project-detail-image, .project-detail-video, .project-detail-iframe, .project-card-video');
                if (media) {
                    media.style.transform = 'scale(1.02)';
                    media.style.filter = 'brightness(1.05)';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                hoverTimeout = setTimeout(() => {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'none';
                    
                    const media = this.querySelector('.project-detail-image, .project-detail-video, .project-detail-iframe, .project-card-video');
                    if (media) {
                        media.style.transform = 'scale(1)';
                        media.style.filter = 'brightness(1)';
                    }
                }, 50);
            });
        });
    }
    
    function hideProjectDetail() {
        // Add exit animation
        const animateElements = projectDetailPage.querySelectorAll('.project-hero, .project-content-section');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
        });
        
        setTimeout(() => {
            projectDetailPage.classList.remove('active');
            // 返回作品集页面时重新显示Spline文字特效
            const splineText = document.getElementById('projectSplineText');
            if (splineText) {
                setTimeout(() => {
                    splineText.style.display = 'block';
                    splineText.style.opacity = '1';
                    splineText.style.visibility = 'visible';
                    splineText.classList.add('visible');
                }, 100);
            }
        }, 200);
    }
    
    // Event listeners for navigation
    mainTitle.addEventListener('click', showPortfolio);
    backToHome.addEventListener('click', showHome);
    splineContainer.addEventListener('click', showPortfolio);
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
            'h1'
        ];
        
        let titleElement = null;
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent && element.textContent.includes('FINN TANG')) {
                titleElement = element;
                break;
            }
        }
        
        if (titleElement) {
            console.log('Found FINN TANG title element:', titleElement);
            titleElement.addEventListener('click', function(e) {
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
            allH1s.forEach(h1 => {
                if (h1.textContent.includes('FINN TANG')) {
                    h1.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        showHome();
                    });
                    h1.style.cursor = 'pointer';
                }
            });
        }
    }, 1000); // 增加延迟确保DOM完全加载
    
    // Hide Spline UI elements when loaded - 彻底移除版本
    function hideSplineWatermark() {
        const splineViewers = document.querySelectorAll('spline-viewer');
        
        splineViewers.forEach(viewer => {
            // 设置属性来禁用UI
            viewer.setAttribute('logo', 'false');
            viewer.setAttribute('controls', 'false');
            viewer.setAttribute('showLogo', 'false');
            viewer.setAttribute('showControls', 'false');
            
            // 创建全局样式来隐藏所有可能的水印
            const globalStyle = document.createElement('style');
            globalStyle.textContent = `
                spline-viewer,
                spline-viewer *,
                spline-viewer::part(*),
                spline-viewer::shadow * {
                    --logo-display: none !important;
                    --controls-display: none !important;
                    --watermark-display: none !important;
                }
                
                /* 隐藏所有可能的水印相关元素 */
                spline-viewer::part(logo),
                spline-viewer::part(controls),
                spline-viewer::part(watermark),
                spline-viewer::part(ui),
                spline-viewer div[class*="logo"],
                spline-viewer div[class*="watermark"],
                spline-viewer div[class*="controls"],
                spline-viewer a[href*="spline"],
                spline-viewer *[class*="built"],
                spline-viewer *[style*="position: fixed"],
                spline-viewer *[style*="position: absolute"] {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                    z-index: -9999 !important;
                }
                
                /* 特别针对右下角元素 */
                spline-viewer *[style*="bottom"],
                spline-viewer *[style*="right"] {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                }
            `;
            document.head.appendChild(globalStyle);
            
            // 监听加载完成事件
            viewer.addEventListener('load', () => {
                removeSplineUI(viewer);
            });
            
            // 延迟执行移除
            setTimeout(() => removeSplineUI(viewer), 1000);
            setTimeout(() => removeSplineUI(viewer), 3000);
            setTimeout(() => removeSplineUI(viewer), 5000);
        });
    }
    
    function removeSplineUI(viewer) {
        try {
            // 方法1：直接访问shadow DOM
            if (viewer.shadowRoot) {
                const elementsToRemove = viewer.shadowRoot.querySelectorAll('*');
                elementsToRemove.forEach(el => {
                    const text = el.textContent || '';
                    const className = el.className || '';
                    const tagName = el.tagName || '';
                    
                    // 检查是否是水印相关元素
                    if (text.includes('Spline') || 
                        text.includes('Built') || 
                        text.includes('built') ||
                        className.includes('logo') ||
                        className.includes('watermark') ||
                        className.includes('controls') ||
                        tagName === 'A' ||
                        el.href) {
                        el.remove();
                    }
                    
                    // 移除右下角定位元素
                    const computedStyle = window.getComputedStyle(el);
                    if ((computedStyle.position === 'fixed' || computedStyle.position === 'absolute') &&
                        (computedStyle.bottom === '0px' || computedStyle.right === '0px' ||
                         el.style.bottom.includes('0') || el.style.right.includes('0'))) {
                        el.remove();
                    }
                });
            }
            
            // 方法2：通过iframe（如果Spline使用iframe）
            const iframes = viewer.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                try {
                    if (iframe.contentDocument) {
                        const iframeElements = iframe.contentDocument.querySelectorAll('*');
                        iframeElements.forEach(el => {
                            const text = el.textContent || '';
                            if (text.includes('Spline') || text.includes('Built')) {
                                el.remove();
                            }
                        });
                    }
                } catch (e) {
                    // 跨域限制，忽略
                }
            });
            
            // 方法3：覆盖Spline的内部方法
            if (viewer.spline) {
                // 尝试禁用logo显示
                if (viewer.spline.showLogo) viewer.spline.showLogo = false;
                if (viewer.spline.logo) viewer.spline.logo = false;
                if (viewer.spline.controls) viewer.spline.controls = false;
            }
            
        } catch (error) {
            console.log('Spline UI removal attempted');
        }
    }
    
    // 立即开始隐藏过程
    hideSplineWatermark();
    
    // 在DOM加载完成后再次执行
    setTimeout(hideSplineWatermark, 1000);
    setTimeout(hideSplineWatermark, 3000);
    setTimeout(hideSplineWatermark, 5000);
    
    // 创建强制覆盖层来遮挡水印
    function createWatermarkBlocker() {
        // 只在主页显示覆盖层
        const homePage = document.getElementById('home-page');
        if (!homePage || homePage.style.display === 'none') {
            // 如果不在主页，移除覆盖层
            const existingBlocker = document.getElementById('spline-watermark-blocker');
            if (existingBlocker) {
                existingBlocker.remove();
            }
            return;
        }
        
        // 移除旧的覆盖层（如果存在）
        const existingBlocker = document.getElementById('spline-watermark-blocker');
        if (existingBlocker) {
            existingBlocker.remove();
        }
        
        // 创建新的覆盖层
        const blocker = document.createElement('div');
        blocker.id = 'spline-watermark-blocker';
        blocker.style.cssText = `
            position: fixed;
            bottom: 0;
            right: 0;
            width: 200px;
            height: 80px;
            background: #000;
            z-index: 999999;
            pointer-events: none;
            border-radius: 0;
        `;
        
        // 添加到页面上
        document.body.appendChild(blocker);
    }
    
    // 立即创建覆盖层
    createWatermarkBlocker();
    
    // 延迟创建以确保覆盖所有情况
    setTimeout(createWatermarkBlocker, 500);
    setTimeout(createWatermarkBlocker, 1000);
    setTimeout(createWatermarkBlocker, 2000);
    setTimeout(createWatermarkBlocker, 5000);
    
    // 持续监控新添加的spline-viewer
    const splineObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && (node.tagName === 'SPLINE-VIEWER' || node.querySelector)) {
                    setTimeout(hideSplineWatermark, 100);
                    setTimeout(createWatermarkBlocker, 200);
                }
            });
        });
    });
    
    splineObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Portfolio page functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workSection = document.getElementById('work');
    const aboutSection = document.getElementById('about');
    const contactSection = document.getElementById('contact');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Show/hide sections based on filter
            if (filter === 'all') {
                workSection.style.display = 'grid';
                aboutSection.style.display = 'none';
            } else if (filter === 'work') {
                workSection.style.display = 'grid';
                aboutSection.style.display = 'none';
            } else if (filter === 'about') {
                workSection.style.display = 'none';
                aboutSection.style.display = 'block';
            }
        });
    });
    
    // Sidebar navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const contactClose = document.getElementById('contact-close');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            
            if (target === '#contact') {
                // Show contact overlay
                contactSection.classList.add('active');
            } else {
                // Close contact overlay if open
                contactSection.classList.remove('active');
                
                // Handle other navigation
                if (target === '#work') {
                    // Show work section, hide about
                    workSection.style.display = 'grid';
                    aboutSection.style.display = 'none';
                    
                    // Update filter buttons
                    filterBtns.forEach(btn => btn.classList.remove('active'));
                    document.querySelector('[data-filter="work"]').classList.add('active');
                } else {
                    // Smooth scroll to section if it exists
                    const targetElement = document.querySelector(target);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });
    
    // Contact close button
    contactClose.addEventListener('click', function() {
        contactSection.classList.remove('active');
    });
    
    // Close contact section when clicking outside
    document.addEventListener('click', function(e) {
        if (contactSection.classList.contains('active') && 
            !contactSection.contains(e.target) && 
            !e.target.closest('a[href="#contact"]')) {
            contactSection.classList.remove('active');
        }
    });
    
    // Prevent contact section from closing when clicking inside
    contactSection.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Project card interactions with enhanced effects
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        // 简化动画延迟
        card.style.animationDelay = `${index * 0.05}s`;
        
        let hoverTimeout;
        
        card.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimeout);
            if (this.classList.contains('visible')) {
                // 简化悬停效果
                this.style.transform = 'translateY(-8px) scale(1.01)';
                this.style.filter = 'brightness(1.02)';
                this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.3)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            // 添加延迟防止快速进出导致的闪烁
            hoverTimeout = setTimeout(() => {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.filter = 'brightness(1)';
                this.style.boxShadow = 'none';
            }, 50);
        });
        
        // 点击事件 - 修复项目标题匹配
        card.addEventListener('click', function() {
            const projectTitle = this.querySelector('.project-title').textContent;
            console.log('Clicked project:', projectTitle); // 调试用
            showProjectDetail(projectTitle);
        });
    });
    
    // Enhanced project detail navigation
    const projectNavBtns = document.querySelectorAll('.project-nav-btn');
    
    projectNavBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            projectNavBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Add smooth scroll to section
            const sectionName = this.textContent.toLowerCase();
            const targetSection = document.querySelector(`[data-section="${sectionName}"]`);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Parallax effect for home page
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        
        // Subtle parallax effect on home content
        if (homePage.style.display !== 'none') {
            const homeContent = document.querySelector('.home-content');
            const translateX = mouseX * 10;
            const translateY = mouseY * 10;
            homeContent.style.transform = `translate(${translateX}px, ${translateY}px)`;
        }
    });
    
    // Enhanced project detail page transitions
    if (projectDetailPage) {
        projectDetailPage.addEventListener('scroll', function() {
            const scrolled = this.scrollTop;
            const rate = scrolled * -0.5;
            
            // Parallax effect for hero year
            const heroYear = document.getElementById('project-hero-year');
            if (heroYear) {
                heroYear.style.transform = `translateY(${rate}px)`;
            }
        });
    }
    
    // Enhanced video loading and error handling
    const projectVideos = document.querySelectorAll('.project-video, .project-detail-video');
    
    projectVideos.forEach(video => {
        let isPlaying = false;
        let loadedMetadata = false;
        
        // 确保视频容器有正确的宽高比
        video.addEventListener('loadedmetadata', function() {
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
        video.addEventListener('loadeddata', function() {
            if (this.classList.contains('project-detail-video')) {
                const placeholders = this.parentElement.querySelectorAll('.project-image-placeholder');
                placeholders.forEach(p => p.remove());
            }
            
            // 只在未播放时尝试播放
            if (!isPlaying) {
                this.play().then(() => {
                    isPlaying = true;
                }).catch(e => {
                    console.log('Video autoplay failed:', e);
                    if (this.classList.contains('project-detail-video')) {
                        this.style.display = 'none';
                        const placeholder = document.createElement('div');
                        placeholder.className = 'project-image-placeholder';
                        placeholder.innerHTML = '<span>REALITYEATER Game Interface</span>';
                        this.parentElement.appendChild(placeholder);
                    }
                });
            }
        });

        // 简化错误处理
        video.addEventListener('error', function() {
            console.log('Video failed to load');
            if (this.classList.contains('project-detail-video')) {
                this.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'project-image-placeholder';
                placeholder.innerHTML = '<span>REALITYEATER Game Interface</span>';
                this.parentElement.appendChild(placeholder);
            }
        });
        
        // 优化悬停效果
        if (this.classList.contains('project-detail-video')) {
            let hoverTimeout;
            
            this.addEventListener('mouseenter', function() {
                clearTimeout(hoverTimeout);
                this.style.transform = 'scale(1.01)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            this.addEventListener('mouseleave', function() {
                hoverTimeout = setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 50);
            });
        }
        
        // 优化项目卡片视频交互
        const projectCard = video.closest('.project-card');
        if (projectCard) {
            let cardHoverTimeout;
            
            projectCard.addEventListener('mouseenter', function() {
                clearTimeout(cardHoverTimeout);
                // 只在视频未播放时尝试播放
                if (!isPlaying && video.paused) {
                    video.play().then(() => {
                        isPlaying = true;
                    }).catch(e => console.log('Video play failed:', e));
                }
            });
            
            // 移除mouseleave的暂停逻辑，让视频持续播放
        }
    });

    // Enhanced image loading and error handling with smooth interactions
    const projectImages = document.querySelectorAll('.project-detail-image');
    
    projectImages.forEach((image, index) => {
        // Handle image loading
        image.addEventListener('load', function() {
            // 图片加载成功时的处理
            this.style.opacity = '1';
            this.style.transform = 'translateY(0)';
            this.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        // Handle image error
        image.addEventListener('error', function() {
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

    // 为图片容器添加平滑的交互效果
    const projectImageItems = document.querySelectorAll('.project-image-item');
    
    projectImageItems.forEach(item => {
        let hoverTimeout;
        
        item.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimeout);
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            
            const image = this.querySelector('.project-detail-image, .project-detail-video');
            if (image) {
                image.style.transform = 'scale(1.02)';
                image.style.filter = 'brightness(1.05)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            hoverTimeout = setTimeout(() => {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
                
                const image = this.querySelector('.project-detail-image, .project-detail-video');
                if (image) {
                    image.style.transform = 'scale(1)';
                    image.style.filter = 'brightness(1)';
                }
            }, 50);
        });
        
        // 添加点击效果
        item.addEventListener('click', function() {
            // 轻微的点击反馈
            this.style.transform = 'translateY(-4px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-8px) scale(1)';
            }, 150);
        });
    });

    // 初始化Spline文字特效
    const splineText = document.querySelector('.project-spline-text');
    if (splineText) {
        const splineViewer = splineText.querySelector('spline-viewer');
        if (splineViewer) {
            // 确保Spline场景正确加载
            splineViewer.addEventListener('load', () => {
                console.log('Spline text effect loaded successfully');
            });
            
            splineViewer.addEventListener('error', (e) => {
                console.error('Spline text effect failed to load:', e);
            });
        }
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements when portfolio page is shown
function observeElements() {
    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });
}

// Call observe function when needed
setTimeout(observeElements, 1000); 