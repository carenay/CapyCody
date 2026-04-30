/* =====================================================================
CAPYCODE v3 · Premium UI + Full Game
===================================================================== */

// ═══ AUDIO ════════════════════════════════════════════════════════════
      let AC = null,
        soundOn = true;
      const sfx = {
        ctx() {
          if (!AC)
            AC = new (window.AudioContext || window.webkitAudioContext)();
          return AC;
        },
        tone(f, d, t = "sine", v = 0.2, dl = 0) {
          if (!soundOn) return;
          try {
            const c = this.ctx(),
              o = c.createOscillator(),
              g = c.createGain();
            o.connect(g);
            g.connect(c.destination);
            o.type = t;
            o.frequency.value = f;
            g.gain.setValueAtTime(0, c.currentTime + dl);
            g.gain.linearRampToValueAtTime(v, c.currentTime + dl + 0.01);
            g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dl + d);
            o.start(c.currentTime + dl);
            o.stop(c.currentTime + dl + d + 0.05);
          } catch (e) {}
        },
        correct() {
          this.tone(523, 0.1, "triangle", 0.25, 0);
          this.tone(659, 0.1, "triangle", 0.25, 0.1);
          this.tone(784, 0.22, "triangle", 0.3, 0.2);
        },
        wrong() {
          this.tone(300, 0.14, "sawtooth", 0.22, 0);
          this.tone(200, 0.22, "sawtooth", 0.2, 0.14);
        },
        jump() {
          this.tone(600, 0.07, "sine", 0.1, 0);
          this.tone(900, 0.07, "sine", 0.08, 0.06);
        },
        click() {
          this.tone(800, 0.05, "triangle", 0.08, 0);
        },
        victory() {
          [523, 659, 784, 1047, 784, 1047, 1568].forEach((n, i) =>
            this.tone(n, 0.15, "triangle", 0.28, i * 0.14),
          );
        },
        land() {
          this.tone(180, 0.05, "sawtooth", 0.07, 0);
        },
      };

      // ═══ GAME DATA ════════════════════════════════════════════════════════
      const CHARS = [
        {
          id: "boy",
          nm: "CapyBoy",
          lbl: "O Jogador",
          fur: "#c0783c",
          hood: "#c0392b",
          jacket: "#2980b9",
        },
        {
          id: "girl",
          nm: "CapyGirl",
          lbl: "A Programadora",
          fur: "#c8956a",
          bow: "#ff69b4",
          knit: "#e91e8c",
        },
        {
          id: "nerd",
          nm: "CapyNerd",
          lbl: "O Especialista",
          fur: "#b87040",
          shirt: "#fff",
          tie: "#2c3e50",
        },
      ];

      const PHASES = [
        {
          id: 1,
          title: "Escola de Tecnologia",
          icon: "🏫",
          tag: "FASE 1 – LABORATÓRIO TECNOLÓGICO",
          story: "O Prof. Byte tem uma aula especial sobre software e autoria!",
          bgType: "lab",
          npcs: [
            {
              id: "profbyte",
              nm: "Prof. Byte",
              emoji: "🦊",
              color: "#c0392b",
              msg: "Olá CapyCode! Hoje aprendemos sobre software e propriedade intelectual!",
              x: 420,
            },
            {
              id: "robobyte",
              nm: "RoboByte",
              emoji: "🤖",
              color: "#2980b9",
              msg: "BEEP! Todo programa tem um autor protegido pela Lei 9.610/98!",
              x: 820,
            },
            {
              id: "bitsy",
              nm: "Aluna Bitsy",
              emoji: "🐾",
              color: "#8e44ad",
              msg: "Vi alguém copiando programas sem permissão! Isso é pirataria!",
              x: 1350,
            },
          ],
          rewards: [{emoji: "🧢", nm: "Boné Hacker"}],
          questions: [
            {
              q: "O que é um software?",
              hint: "Pense no que faz o computador executar tarefas.",
              a: [
                "Um equipamento físico como teclado ou monitor",
                "Um conjunto de instruções e códigos que faz o computador executar tarefas",
                "Um tipo de videogame apenas",
              ],
              c: 1,
              fb: "Software é um conjunto de instruções (código) que diz ao computador o que fazer. É diferente do hardware, que são as partes físicas.",
            },
            {
              q: "Quem é o autor de um programa de computador?",
              hint: "A autoria pertence a quem criou, não a quem usa ou compra.",
              a: [
                "A empresa que vende o computador",
                "Qualquer pessoa que instalar o programa",
                "A pessoa ou empresa que criou e desenvolveu o programa",
              ],
              c: 2,
              fb: "O autor é quem criou o programa. Pela Lei 9.610/98, o criador tem direitos exclusivos sobre sua obra intelectual.",
            },
            {
              q: "O que é uma licença de software?",
              hint: "Licença define as regras de uso autorizado pelo criador.",
              a: [
                "Uma senha para acessar o computador",
                "Um documento que autoriza o uso do software sob certas condições",
                "O preço pago pelo programa",
              ],
              c: 1,
              fb: "A licença é o contrato que define como o software pode ser usado, copiado ou distribuído. Sem licença válida, o uso pode ser ilegal.",
            },
            {
              q: "Qual das ações abaixo é pirataria de software?",
              hint: "Pirataria envolve uso/distribuição sem autorização do autor.",
              a: [
                "Usar um freeware liberado pelo autor",
                "Instalar em seu computador um software que você comprou legalmente",
                "Copiar e distribuir um programa pago sem autorização do criador",
              ],
              c: 2,
              fb: "Copiar e distribuir software sem autorização é pirataria. Isso viola os direitos autorais e é crime previsto em lei.",
            },
            {
              q: "Qual lei brasileira protege os programas de computador?",
              hint: "É uma lei de 1998 específica sobre direitos autorais.",
              a: [
                "Lei 8.069/90 – Estatuto da Criança e do Adolescente",
                "Lei 9.610/98 – Direitos Autorais (inclui software)",
                "Lei 11.445/07 – Saneamento Básico",
              ],
              c: 1,
              fb: "A Lei 9.610/98 protege os direitos autorais no Brasil, incluindo programas de computador. Software pirata é crime!",
            },
          ],
        },
        {
          id: 2,
          title: "Mata da Capivara",
          icon: "🌿",
          tag: "FASE 2 – MISSÃO INVESTIGAÇÃO",
          story:
            "Tucanuco avistou algo suspeito no rio. Investigue o roubo de software!",
          bgType: "forest",
          npcs: [
            {
              id: "tucanuco",
              nm: "Tucanuco",
              emoji: "🦜",
              color: "#e67e22",
              msg: "Vi um humano estranho baixando arquivos suspeitos perto do rio!",
              x: 400,
            },
            {
              id: "onca",
              nm: "Onça Debug",
              emoji: "🐆",
              color: "#f39c12",
              msg: "Ela tinha um pendrive com seu código! Foi para a Caverna do EcoHack.",
              x: 850,
            },
            {
              id: "arara",
              nm: "Arara Byte",
              emoji: "🦅",
              color: "#27ae60",
              msg: "Ouvi dizer que ele quer vender seu programa na internet!",
              x: 1300,
            },
            {
              id: "devinho",
              nm: "Devinho",
              emoji: "😈",
              color: "#8e44ad",
              msg: "Ha! Vou vender esse software e ficar rico! Ninguém vai saber que não é meu!",
              x: 1750,
            },
          ],
          rewards: [
            {emoji: "🧥", nm: "Moletom Dev"},
            {emoji: "👟", nm: "Tênis Tech"},
          ],
          questions: [
            {
              q: "Alguém está vendendo cópias de um app sem permissão. O que isso representa?",
              hint: "Vender sem autorização viola a propriedade intelectual.",
              a: [
                "Uso legal pois o app está disponível na internet",
                "Violação dos direitos autorais do programador",
                "Uma forma de marketing gratuito para o criador",
              ],
              c: 1,
              fb: "Vender cópias sem autorização é pirataria. Isso viola os direitos autorais e causa prejuízo financeiro e moral ao criador.",
            },
            {
              q: "Como o programador pode provar que é o autor do software?",
              hint: "Documentação e registro formal são as melhores provas.",
              a: [
                "Publicar o programa gratuitamente nas redes sociais",
                "Guardar código-fonte, commits, datas de criação e documentação",
                "Vender o programa o mais rápido possível",
              ],
              c: 1,
              fb: "Manter histórico de versões (commits), código-fonte organizado, contratos e documentação técnica é a melhor prova de autoria.",
            },
            {
              q: "O que é software de código aberto (open source)?",
              hint: "Open source tem licença que permite ver e modificar o código, mas com regras.",
              a: [
                "Software que pode ser vendido ilegalmente por qualquer um",
                "Software sem qualquer proteção legal",
                "Software com código disponível, usável/modificável conforme sua licença",
              ],
              c: 2,
              fb: "Open source tem o código disponível e permite uso/modificação conforme a licença (ex: GPL, MIT). Mas mesmo open source tem regras!",
            },
            {
              q: "Usar um software pirata no computador do trabalho é:",
              hint: "As consequências legais valem tanto para pessoas quanto empresas.",
              a: [
                "Permitido se for apenas para uso pessoal",
                "Ilegal e pode gerar multas e processos para a empresa e funcionários",
                "Aceito se o software for antigo e fora de venda",
              ],
              c: 1,
              fb: "Usar software pirata é ilegal. Empresas podem ser multadas e processos podem ser abertos contra funcionários e gestores responsáveis.",
            },
            {
              q: 'O que significa ter "licença proprietária" de um software?',
              hint: "Proprietária = o software pertence exclusivamente ao seu criador.",
              a: [
                "O software pode ser copiado livremente por qualquer pessoa",
                "O usuário tem direito de modificar e redistribuir",
                "O software pertence ao desenvolvedor e o uso é restrito por contrato",
              ],
              c: 2,
              fb: "Software proprietário pertence ao criador. O usuário paga para usar, mas não pode copiar, modificar ou redistribuir sem autorização.",
            },
          ],
        },
        {
          id: 3,
          title: "Premiação do Conhecimento",
          icon: "🏆",
          tag: "FASE 3 – PREMIAÇÃO",
          story:
            "CapyCode chegou ao palco de premiação! Prove que é um Guardião do Código!",
          bgType: "stage",
          npcs: [
            {
              id: "profbyte2",
              nm: "Prof. Byte",
              emoji: "🦊",
              color: "#c0392b",
              msg: "Você chegou longe, CapyCode! Este é o desafio final!",
              x: 380,
            },
            {
              id: "robobyte2",
              nm: "RoboByte",
              emoji: "🤖",
              color: "#2980b9",
              msg: "Sistema pronto! Execute o protocolo de premiação! BEEP!",
              x: 800,
            },
            {
              id: "capynina",
              nm: "CapyNina",
              emoji: "🦝",
              color: "#8e44ad",
              msg: "Todos aqui celebram a ética digital. Mostre que merece a coroa!",
              x: 1300,
            },
          ],
          rewards: [{emoji: "👑", nm: "Coroa Guardião"}],
          questions: [
            {
              q: "Qual é a melhor forma de proteger um software que você criou?",
              hint: "Combine registro formal com boa documentação técnica.",
              a: [
                "Manter o código secreto e nunca publicar nada",
                "Registrar em cartório e manter documentação de autoria",
                "Publicar incompleto para ninguém poder copiar",
              ],
              c: 1,
              fb: "Registrar em cartório (ou INPI) e manter histórico técnico com código versionado protege legalmente seu software.",
            },
            {
              q: 'O que é "domínio público" em relação a software?',
              hint: "Domínio público = direitos exclusivos expiraram ou foram renunciados.",
              a: [
                "Software bloqueado pelo governo",
                "Software sem código-fonte disponível",
                "Software que pode ser usado livremente: prazo de 70 anos expirado ou autor renunciou",
              ],
              c: 2,
              fb: "Domínio público: qualquer um pode usar livremente. Ocorre quando o prazo de proteção expira ou o autor renuncia aos direitos.",
            },
            {
              q: "Qual atitude ética ao usar código de terceiros em seu projeto?",
              hint: "Respeito e transparência são valores fundamentais do desenvolvimento.",
              a: [
                "Copiar sem mencionar; código na internet é livre",
                "Modificar levemente para não precisar creditar",
                "Verificar a licença, citar o autor e respeitar as condições de uso",
              ],
              c: 2,
              fb: "Sempre verifique a licença, credite o autor e siga as condições. Essa é a ética de um verdadeiro desenvolvedor!",
            },
            {
              q: "Um colega pede o instalador do software que você comprou. O que fazer?",
              hint: "Licenças geralmente são pessoais ou por dispositivo.",
              a: [
                "Emprestar; você comprou e pode fazer o que quiser",
                "Verificar a licença; geralmente é pessoal/por máquina e emprestar seria ilegal",
                "Enviar por e-mail pois ele vai comprar depois",
              ],
              c: 1,
              fb: "A maioria das licenças é pessoal ou por máquina. Emprestar o instalador pode violar o contrato e ser considerado pirataria.",
            },
            {
              q: "O que é ética digital no contexto de software?",
              hint: "Ética digital = responsabilidade, respeito aos direitos e legalidade.",
              a: [
                "Usar qualquer tecnologia disponível para obter vantagem",
                "Nunca usar software gratuito pois pode ter vírus",
                "Agir com responsabilidade, respeitar direitos autorais e usar tecnologia de forma legal e honesta",
              ],
              c: 2,
              fb: "Ética digital = respeitar direitos, ser honesto, não praticar pirataria e usar tecnologia para o bem. Seja um Guardião do Código!",
            },
          ],
        },
      ];

      const ALL_REWARDS = [
        {emoji: "🧢", nm: "Boné Hacker", phase: 0},
        {emoji: "🧥", nm: "Moletom Dev", phase: 1},
        {emoji: "👟", nm: "Tênis Tech", phase: 1},
        {emoji: "👑", nm: "Coroa Guardião", phase: 2},
      ];

      // ═══ STATE ════════════════════════════════════════════════════════════
      const G = {
        name: "Jogador",
        charIdx: 0,
        phase: 0,
        score: 0,
        totalTime: 0,
        lives: 3,
        earned: [],
        phasesData: [],
      };

      let PS = {
        found: [],
        allFound: false,
        qIdx: 0,
        errors: 0,
        qActive: false,
        answered: false,
        qTimer: 0,
        qMax: 40,
        qInt: null,
        startTime: 0,
        phaseScore: 0,
        correct: 0,
        quizStarted: false,
        guideRead: false,
      };

      // ═══ CANVAS SETUP ════════════════════════════════════════════════════
      const mainCanvas = document.getElementById("mainCanvas");
      const MX = mainCanvas.getContext("2d");

      let world = {w: 2000, camX: 0, floorY: 0};
      let player = {
        x: 80,
        y: 0,
        vx: 0,
        vy: 0,
        w: 52,
        h: 64,
        onGround: true,
        facing: 1,
        frame: 0,
        ft: 0,
        running: false,
      };
      const KEYS = {};
      let gameRunning = false;
      let raf = null;
      let lastT = 0;

      // Platforms & obstacles per phase
      const PHASE_WORLDS = [
        {
          // Lab
          w: 1900,
          platforms: [
            {x: 200, y: 0, w: 110, h: 18},
            {x: 460, y: 0, w: 90, h: 18},
            {x: 750, y: 0, w: 100, h: 18},
            {x: 1050, y: 0, w: 90, h: 18},
            {x: 1350, y: 0, w: 110, h: 18},
            {x: 1650, y: 0, w: 100, h: 18},
          ],
          obstacles: [
            {x: 580, w: 58, h: 58, type: "box"},
            {x: 1000, w: 52, h: 52, type: "box"},
            {x: 1500, w: 60, h: 55, type: "box"},
          ],
        },
        {
          // Forest
          w: 2100,
          platforms: [
            {x: 180, y: 0, w: 100, h: 18},
            {x: 400, y: 0, w: 90, h: 18},
            {x: 700, y: 0, w: 110, h: 18},
            {x: 1000, y: 0, w: 90, h: 18},
            {x: 1200, y: 0, w: 100, h: 18},
            {x: 1600, y: 0, w: 110, h: 18},
            {x: 1900, y: 0, w: 90, h: 18},
          ],
          obstacles: [
            {x: 550, w: 70, h: 48, type: "log"},
            {x: 1100, w: 62, h: 55, type: "rock"},
            {x: 1500, w: 68, h: 46, type: "log"},
            {x: 1800, w: 58, h: 52, type: "rock"},
          ],
        },
        {
          // Stage
          w: 1800,
          platforms: [
            {x: 150, y: 0, w: 110, h: 18},
            {x: 400, y: 0, w: 90, h: 18},
            {x: 700, y: 0, w: 100, h: 18},
            {x: 1000, y: 0, w: 90, h: 18},
            {x: 1300, y: 0, w: 110, h: 18},
            {x: 1550, y: 0, w: 100, h: 18},
          ],
          obstacles: [
            {x: 600, w: 62, h: 58, type: "trophy"},
            {x: 1100, w: 55, h: 52, type: "box"},
            {x: 1600, w: 68, h: 62, type: "trophy"},
          ],
        },
      ];

      // Active scene objects
      let sceneNpcs = [];
      let sceneGuide = {x: 200, y: 0, talked: false};
      let sceneObstacles = [];
      let scenePlatforms = [];
      let particles = [];
      let sceneBubbles = [];

      function resizeCanvas() {
        const panel = document.getElementById("scene-panel");
        if (!panel) return;
        const r = panel.getBoundingClientRect();
        mainCanvas.width = r.width;
        mainCanvas.height = r.height;
        mainCanvas.style.width = r.width + "px";
        mainCanvas.style.height = r.height + "px";
        world.floorY = r.height - 80;
        // Recalculate platform y (relative to floorY)
        const pw = PHASE_WORLDS[G.phase];
        scenePlatforms = pw.platforms.map((p) => ({
          ...p,
          y: world.floorY - 85 - (p.y || 0),
        }));
        sceneObstacles = pw.obstacles.map((o) => ({
          ...o,
          y: world.floorY - o.h,
        }));
        sceneNpcs = PHASES[G.phase].npcs.map((n) => ({
          ...n,
          y: world.floorY - 72,
          talked: false,
          bt: Math.random() * Math.PI * 2,
        }));
        sceneGuide = {x: 190, y: world.floorY - 70, talked: false, bt: 0};
        if (player.y < 50) player.y = world.floorY - player.h;
      }

      // ═══ DRAWING ══════════════════════════════════════════════════════════

      function drawScene(ts) {
        const C = MX,
          W = mainCanvas.width,
          H = mainCanvas.height;
        C.clearRect(0, 0, W, H);
        const ph = G.phase;
        const btypes = ["lab", "forest", "stage"];
        drawSceneBg(C, W, H, btypes[ph], ts);
        drawFloor(C, W, H, ph);
        drawScenePlatforms(C, ph);
        drawSceneObstacles(C, ph);
        drawSceneGuide(C, ts);
        sceneNpcs.forEach((n) => drawSceneNpc(C, n, ts));
        drawScenePlayer(C, ts);
        updateParticles(C);
        if (!PS.allFound) drawGuideArrow(C, W, ts);
      }

      function drawSceneBg(C, W, H, type, ts) {
        const bgs = {
          lab: [
            ["#061830", "#0a2540", "#0d3555"],
            ["#0a2a10", "#0d3d15", "#153d20"],
            ["#1a0535", "#2d1060", "#1a1060"],
          ],
          forest: ["#061830", "#0a2540", "#0d3555"],
          stage: ["#1a0535", "#2d1060", "#1a1060"],
        };
        const cols = {
          lab: ["#061830", "#0a2540", "#0d3555"],
          forest: ["#071a07", "#0d2e0a", "#1a3d10"],
          stage: ["#1a0535", "#2a0e60", "#1a1555"],
        };
        const g = C.createLinearGradient(0, 0, 0, H);
        const c = cols[type] || cols.lab;
        g.addColorStop(0, c[0]);
        g.addColorStop(0.55, c[1]);
        g.addColorStop(1, c[2]);
        C.fillStyle = g;
        C.fillRect(0, 0, W, H);

        if (type === "lab") {
          // Wall screens
          for (let i = 0; i < 5; i++) {
            const sx = i * 360 + 60 - world.camX;
            if (sx < -120 || sx > W + 50) continue;
            C.fillStyle = "rgba(0,80,160,0.25)";
            C.fillRect(sx, 20, 130, 82);
            C.strokeStyle = "rgba(0,140,255,0.45)";
            C.lineWidth = 1.5;
            C.strokeRect(sx, 20, 130, 82);
            C.fillStyle = "rgba(0,220,255,0.06)";
            C.fillRect(sx + 4, 25, 122, 72);
            for (let r = 0; r < 4; r++) {
              C.fillStyle = "rgba(0,255,100,.45)";
              C.fillRect(sx + 8, 33 + r * 14, 50 + Math.sin(r * 1.3) * 30, 3);
            }
          }
          // Ceiling lights
          for (let i = 0; i < 7; i++) {
            const lx = i * 270 + 120 - world.camX;
            if (lx < -60 || lx > W + 60) continue;
            C.fillStyle = "rgba(255,255,200,.65)";
            C.fillRect(lx - 22, 0, 44, 7);
            const gl = C.createRadialGradient(lx, 0, 0, lx, 90, 90);
            gl.addColorStop(0, "rgba(255,255,200,.14)");
            gl.addColorStop(1, "transparent");
            C.fillStyle = gl;
            C.fillRect(lx - 90, 0, 180, 160);
          }
        } else if (type === "forest") {
          // Trees
          for (let i = 0; i < 14; i++) {
            const tx = i * 155 + 40 - world.camX;
            if (tx < -100 || tx > W + 100) continue;
            const th = 110 + ((i * 11) % 70);
            C.fillStyle = "#3a1e00";
            C.fillRect(tx + 13, world.floorY - th, 15, th);
            const leafH = `hsl(${108 + ((i * 8) % 28)},62%,${22 + ((i * 5) % 18)}%)`;
            C.fillStyle = leafH;
            C.beginPath();
            C.arc(tx + 20, world.floorY - th - 28, 40, 0, Math.PI * 2);
            C.fill();
            C.fillStyle = `hsl(${115 + ((i * 6) % 22)},67%,${28 + ((i * 3) % 14)}%)`;
            C.beginPath();
            C.arc(tx + 14, world.floorY - th - 52, 27, 0, Math.PI * 2);
            C.fill();
          }
          // River shimmer
          C.fillStyle = "rgba(0,100,220,.18)";
          C.fillRect(-world.camX, world.floorY - 150, world.w, 28);
          C.fillStyle = "rgba(150,220,255,.08)";
          C.fillRect(-world.camX, world.floorY - 150, world.w, 8);
          // Fireflies
          for (let i = 0; i < 12; i++) {
            const fx = ((i * 220 + ts * 0.0004) % world.w) - world.camX;
            const fy = world.floorY - 120 + Math.sin(ts * 0.0012 + i) * 35;
            if (fx < 0 || fx > W) continue;
            C.beginPath();
            C.arc(fx, fy, 2, 0, Math.PI * 2);
            C.fillStyle = `rgba(180,255,80,${0.25 + Math.sin(ts * 0.003 + i) * 0.28})`;
            C.fill();
          }
        } else {
          // Stage
          // Curtains
          C.fillStyle = "rgba(100,0,60,.45)";
          C.fillRect(-world.camX, 0, 130, H);
          C.fillStyle = "rgba(100,0,60,.45)";
          C.fillRect(world.w - 130 - world.camX, 0, 130, H);
          // Spotlights
          for (let i = 0; i < 5; i++) {
            const lx = i * (world.w / 4) + 200 - world.camX;
            const sg = C.createRadialGradient(lx, 0, 0, lx, 200, 200);
            sg.addColorStop(0, "rgba(255,220,100,.17)");
            sg.addColorStop(1, "transparent");
            C.fillStyle = sg;
            C.fillRect(lx - 200, 0, 400, 400);
          }
          // Stars
          for (let i = 0; i < 18; i++) {
            const sx = ((i * 290 + ts * 0.0003) % world.w) - world.camX;
            const sy = 20 + ((i * 18) % 70);
            if (sx < -10 || sx > W + 10) continue;
            C.font = "14px serif";
            C.textAlign = "center";
            C.globalAlpha = 0.6 + Math.sin(ts * 0.003 + i) * 0.3;
            C.fillText(["⭐", "✨", "🌟"][i % 3], sx, sy);
            C.globalAlpha = 1;
          }
        }
      }

      function drawFloor(C, W, H, ph) {
        const fcs = ["#1a3a1a", "#1a3500", "#2a0a50"];
        const lcs = ["#2a5a2a", "#2a5500", "#5a1a90"];
        const g = C.createLinearGradient(0, world.floorY, 0, H);
        g.addColorStop(0, fcs[ph]);
        g.addColorStop(1, "rgba(0,0,0,.6)");
        C.fillStyle = g;
        C.fillRect(-world.camX, world.floorY, world.w, H - world.floorY);
        C.strokeStyle = lcs[ph];
        C.lineWidth = 2.5;
        C.beginPath();
        C.moveTo(-world.camX, world.floorY);
        C.lineTo(world.w - world.camX, world.floorY);
        C.stroke();
      }

      function drawScenePlatforms(C, ph) {
        const cs = ["#2a5a2a", "#2a5500", "#5a1a90"];
        scenePlatforms.forEach((p) => {
          const px = p.x - world.camX;
          if (px > mainCanvas.width + 50 || px + p.w < -50) return;
          C.fillStyle = cs[ph];
          C.beginPath();
          C.roundRect(px, p.y, p.w, p.h, 5);
          C.fill();
          C.strokeStyle = "rgba(255,255,255,.12)";
          C.lineWidth = 1;
          C.beginPath();
          C.roundRect(px, p.y, p.w, p.h, 5);
          C.stroke();
        });
      }

      function drawSceneObstacles(C, ph) {
        sceneObstacles.forEach((o) => {
          const ox = o.x - world.camX;
          if (ox > mainCanvas.width + 50 || ox + o.w < -50) return;
          if (o.type === "box") {
            C.fillStyle = "#6b3010";
            C.fillRect(ox, o.y, o.w, o.h);
            C.strokeStyle = "#3a1800";
            C.lineWidth = 2;
            C.strokeRect(ox, o.y, o.w, o.h);
            C.strokeStyle = "rgba(255,255,255,.08)";
            C.lineWidth = 1;
            C.beginPath();
            C.moveTo(ox, o.y);
            C.lineTo(ox + o.w, o.y + o.h);
            C.stroke();
            C.beginPath();
            C.moveTo(ox + o.w, o.y);
            C.lineTo(ox, o.y + o.h);
            C.stroke();
          } else if (o.type === "log") {
            C.fillStyle = "#5a2e0a";
            C.beginPath();
            C.ellipse(
              ox + o.w / 2,
              o.y + o.h / 2,
              o.w / 2,
              o.h / 2,
              0,
              0,
              Math.PI * 2,
            );
            C.fill();
            C.strokeStyle = "#3a1a05";
            C.lineWidth = 2;
            C.stroke();
            for (let i = 1; i < 4; i++) {
              C.strokeStyle = "rgba(0,0,0,.2)";
              C.lineWidth = 1;
              C.beginPath();
              C.moveTo(ox + (i * o.w) / 4, o.y);
              C.lineTo(ox + (i * o.w) / 4, o.y + o.h);
              C.stroke();
            }
          } else if (o.type === "rock") {
            C.fillStyle = "#4a4a4a";
            C.beginPath();
            C.ellipse(
              ox + o.w / 2,
              o.y + o.h * 0.55,
              o.w / 2,
              o.h * 0.55,
              0,
              0,
              Math.PI * 2,
            );
            C.fill();
            C.fillStyle = "rgba(255,255,255,.1)";
            C.beginPath();
            C.ellipse(
              ox + o.w * 0.35,
              o.y + o.h * 0.35,
              o.w * 0.2,
              o.h * 0.14,
              -0.3,
              0,
              Math.PI * 2,
            );
            C.fill();
          } else if (o.type === "trophy") {
            C.fillStyle = "#e8c000";
            C.fillRect(ox + o.w * 0.3, o.y, o.w * 0.4, o.h * 0.6);
            C.beginPath();
            C.arc(ox + o.w / 2, o.y + o.h * 0.28, o.w * 0.33, 0, Math.PI * 2);
            C.fill();
            C.fillStyle = "#c8a000";
            C.fillRect(
              ox + o.w * 0.18,
              o.y + o.h * 0.6,
              o.w * 0.64,
              o.h * 0.14,
            );
            C.fillRect(
              ox + o.w * 0.33,
              o.y + o.h * 0.74,
              o.w * 0.34,
              o.h * 0.26,
            );
          }
        });
      }

      function drawSceneNpc(C, n, ts) {
        const nx = n.x - world.camX;
        if (nx < -80 || nx > mainCanvas.width + 80) return;
        const bob = Math.sin(n.bt + ts * 0.002) * 4;
        C.save();
        if (!n.talked) {
          C.shadowColor = "rgba(255,200,0,.9)";
          C.shadowBlur = 16;
        }
        C.font = "38px serif";
        C.textAlign = "center";
        C.fillText(n.emoji, nx, n.y + bob);
        C.restore();
        // Name tag
        C.fillStyle = "rgba(0,0,0,.65)";
        const tw = C.measureText(n.nm).width + 14;
        C.beginPath();
        if (C.roundRect) C.roundRect(nx - tw / 2, n.y - 68, tw, 20, 5);
        else C.rect(nx - tw / 2, n.y - 68, tw, 20);
        C.fill();
        C.fillStyle = "#fff";
        C.font = "bold 10px Nunito,sans-serif";
        C.textAlign = "center";
        C.fillText(n.nm, nx, n.y - 54);
        if (!n.talked) {
          C.fillStyle = "#ffd700";
          C.font = "bold 22px serif";
          C.textAlign = "center";
          C.fillText("!", nx, n.y - 84 + Math.sin(ts * 0.004) * 5);
        } else {
          C.fillStyle = "rgba(46,204,113,.9)";
          C.font = "16px serif";
          C.fillText("✓", nx, n.y - 80);
        }
        n.bt += 0.04;
      }

      function drawSceneGuide(C, ts) {
        const g = sceneGuide;
        const gx = g.x - world.camX;
        if (gx < -80 || gx > mainCanvas.width + 80) return;
        const bob = Math.sin(g.bt + ts * 0.003) * 5;
        C.save();
        if (!g.talked) {
          C.shadowColor = "rgba(0,200,255,.9)";
          C.shadowBlur = 20;
        }
        C.font = "36px serif";
        C.textAlign = "center";
        C.fillText("🤖", gx, g.y + bob);
        C.restore();
        C.fillStyle = "rgba(0,0,0,.65)";
        const tw = C.measureText("RobôGuia").width + 14;
        C.beginPath();
        if (C.roundRect) C.roundRect(gx - tw / 2, g.y - 62, tw, 20, 5);
        else C.rect(gx - tw / 2, g.y - 62, tw, 20);
        C.fill();
        C.fillStyle = "#00e5ff";
        C.font = "bold 10px Nunito,sans-serif";
        C.textAlign = "center";
        C.fillText("RobôGuia", gx, g.y - 48);
        if (!g.talked) {
          C.fillStyle = "#ffd700";
          C.font = "bold 22px serif";
          C.textAlign = "center";
          C.fillText("!", gx, g.y - 80 + Math.sin(ts * 0.005) * 5);
        } else {
          C.fillStyle = "rgba(46,204,113,.9)";
          C.font = "16px serif";
          C.fillText("✓", gx, g.y - 76);
        }
        g.bt += 0.04;
      }

      function drawScenePlayer(C, ts) {
        const ch = CHARS[G.charIdx];
        const px = player.x - world.camX;
        const py = player.y;
        const bw = player.w,
          bh = player.h;
        C.save();
        C.translate(px + bw / 2, py + bh / 2);
        if (player.facing < 0) C.scale(-1, 1);
        // Shadow
        C.fillStyle = "rgba(0,0,0,.22)";
        C.beginPath();
        C.ellipse(0, bh / 2 + 5, bw * 0.4, 8, 0, 0, Math.PI * 2);
        C.fill();
        // Body bob
        const bb =
          player.onGround && player.running ? Math.sin(ts * 0.018) * 2.5 : 0;
        C.translate(0, bb);
        // Body
        C.fillStyle = ch.fur;
        C.beginPath();
        if (C.roundRect) C.roundRect(-bw / 2, -bh / 2, bw, bh, 12);
        else C.rect(-bw / 2, -bh / 2, bw, bh);
        C.fill();
        // Clothes
        if (G.charIdx === 0) {
          C.fillStyle = ch.jacket;
          C.beginPath();
          if (C.roundRect) C.roundRect(-bw / 2, -bh * 0.05, bw, bh * 0.55, 8);
          else C.rect(-bw / 2, -bh * 0.05, bw, bh * 0.55);
          C.fill();
          C.fillStyle = ch.hood;
          C.beginPath();
          C.arc(0, -bh / 2 + 8, bw * 0.42, Math.PI, 0);
          C.fill();
          if (player.onGround && !player.running) {
            C.fillStyle = "#2a2a2a";
            C.beginPath();
            if (C.roundRect) C.roundRect(-15, 4, 30, 16, 4);
            else C.rect(-15, 4, 30, 16);
            C.fill();
            ["#e74c3c", "#27ae60", "#3498db", "#f1c40f"].forEach((cl, i) => {
              C.fillStyle = cl;
              C.beginPath();
              C.arc(-11 + i * 8, 12, 2.5, 0, Math.PI * 2);
              C.fill();
            });
          }
        } else if (G.charIdx === 1) {
          C.fillStyle = ch.knit;
          C.beginPath();
          if (C.roundRect) C.roundRect(-bw / 2, -bh * 0.1, bw, bh * 0.6, 8);
          else C.rect(-bw / 2, -bh * 0.1, bw, bh * 0.6);
          C.fill();
          C.fillStyle = ch.bow;
          C.beginPath();
          C.arc(-8, -bh / 2 + 1, 8, 0, Math.PI * 2);
          C.fill();
          C.beginPath();
          C.arc(8, -bh / 2 + 1, 8, 0, Math.PI * 2);
          C.fill();
          C.beginPath();
          C.arc(0, -bh / 2 + 3, 4, 0, Math.PI * 2);
          C.fill();
          if (player.onGround && !player.running) {
            C.fillStyle = "#ddd";
            C.beginPath();
            if (C.roundRect) C.roundRect(-14, 2, 28, 16, 3);
            else C.rect(-14, 2, 28, 16);
            C.fill();
            C.fillStyle = "rgba(100,180,255,.5)";
            C.fillRect(-12, 4, 24, 11);
          }
        } else {
          C.fillStyle = ch.shirt;
          C.beginPath();
          if (C.roundRect) C.roundRect(-bw / 2, -bh * 0.1, bw, bh * 0.6, 8);
          else C.rect(-bw / 2, -bh * 0.1, bw, bh * 0.6);
          C.fill();
          C.strokeStyle = ch.tie;
          C.lineWidth = 2;
          C.beginPath();
          C.arc(-9, -bh * 0.22, 6, 0, Math.PI * 2);
          C.stroke();
          C.beginPath();
          C.arc(9, -bh * 0.22, 6, 0, Math.PI * 2);
          C.stroke();
          C.beginPath();
          C.moveTo(-3, -bh * 0.22);
          C.lineTo(3, -bh * 0.22);
          C.stroke();
          if (player.onGround && !player.running) {
            C.fillStyle = "#3498db";
            C.beginPath();
            if (C.roundRect) C.roundRect(-13, 3, 11, 17, 2);
            else C.rect(-13, 3, 11, 17);
            C.fill();
            C.fillStyle = "#2980b9";
            C.beginPath();
            if (C.roundRect) C.roundRect(-1, 3, 11, 17, 2);
            else C.rect(-1, 3, 11, 17);
            C.fill();
          }
        }
        // Head
        C.fillStyle = ch.fur;
        C.beginPath();
        C.ellipse(0, -bh / 2 + 4, bw * 0.37, bh * 0.27, 0, 0, Math.PI * 2);
        C.fill();
        // Ears
        C.beginPath();
        C.ellipse(-bw * 0.29, -bh / 2 - 5, 7, 10, -0.2, 0, Math.PI * 2);
        C.fill();
        C.beginPath();
        C.ellipse(bw * 0.29, -bh / 2 - 5, 7, 10, 0.2, 0, Math.PI * 2);
        C.fill();
        C.fillStyle = "rgba(200,120,120,.45)";
        C.beginPath();
        C.ellipse(-bw * 0.29, -bh / 2 - 4, 4.5, 6.5, -0.2, 0, Math.PI * 2);
        C.fill();
        C.beginPath();
        C.ellipse(bw * 0.29, -bh / 2 - 4, 4.5, 6.5, 0.2, 0, Math.PI * 2);
        C.fill();
        // Eyes
        C.fillStyle = "#1a0a00";
        C.beginPath();
        C.arc(-10, -bh * 0.3, 4, 0, Math.PI * 2);
        C.fill();
        C.beginPath();
        C.arc(10, -bh * 0.3, 4, 0, Math.PI * 2);
        C.fill();
        C.fillStyle = "#fff";
        C.beginPath();
        C.arc(-8, -bh * 0.31, 1.5, 0, Math.PI * 2);
        C.fill();
        C.beginPath();
        C.arc(12, -bh * 0.31, 1.5, 0, Math.PI * 2);
        C.fill();
        // Snout
        C.fillStyle = "rgba(175,125,95,.7)";
        C.beginPath();
        C.ellipse(0, -bh * 0.13, 10, 7, 0, 0, Math.PI * 2);
        C.fill();
        C.fillStyle = "#2a1000";
        C.beginPath();
        C.arc(-3, -bh * 0.1, 2, 0, Math.PI * 2);
        C.fill();
        C.beginPath();
        C.arc(3, -bh * 0.1, 2, 0, Math.PI * 2);
        C.fill();
        // Legs
        const ls = player.running ? Math.sin(ts * 0.022) * 18 : 0;
        C.fillStyle = ch.fur;
        C.save();
        C.translate(-10, bh * 0.32);
        C.rotate(((ls + 14) * Math.PI) / 180);
        C.fillRect(-4, 0, 9, 22);
        C.restore();
        C.save();
        C.translate(10, bh * 0.32);
        C.rotate(((-ls + 14) * Math.PI) / 180);
        C.fillRect(-4, 0, 9, 22);
        C.restore();
        C.restore();
      }

      function drawGuideArrow(C, W, ts) {
        const nextTarget = sceneNpcs.find((n) => !n.talked) || sceneGuide;
        if (!nextTarget || nextTarget.talked) return;
        const dist = nextTarget.x - player.x;
        if (Math.abs(dist) < 160) return;
        const dir = dist > 0 ? 1 : -1;
        const ax = dir > 0 ? W - 55 : 55;
        const pulse = 0.7 + Math.sin(ts * 0.01) * 0.3;
        C.save();
        C.globalAlpha = pulse;
        C.fillStyle = "#ffd700";
        C.font = "28px serif";
        C.textAlign = "center";
        C.fillText(dir > 0 ? "→" : "←", ax, mainCanvas.height - 150);
        C.font = "bold 10px Nunito,sans-serif";
        C.fillStyle = "rgba(255,255,255,.8)";
        C.fillText(nextTarget.nm || "RobôGuia", ax, mainCanvas.height - 132);
        C.restore();
      }

      // Particles
      function spawnPfx(x, y, col, n = 8) {
        for (let i = 0; i < n; i++) {
          particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 5,
            vy: -Math.random() * 5 - 2,
            life: 1,
            decay: 0.025,
            r: 4 + Math.random() * 3,
            col,
          });
        }
      }
      function updateParticles(C) {
        particles = particles.filter((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.18;
          p.life -= p.decay;
          const sx = p.x - world.camX;
          C.save();
          C.globalAlpha = p.life;
          C.fillStyle = p.col;
          C.beginPath();
          C.arc(sx, p.y, p.r, 0, Math.PI * 2);
          C.fill();
          C.restore();
          return p.life > 0;
        });
      }

      // ═══ GAME LOOP ════════════════════════════════════════════════════════
      function gameLoop(ts) {
        if (!gameRunning) return;
        const dt = Math.min(ts - lastT, 50);
        lastT = ts;
        const spd = PS.qActive ? 0 : 3.8;

        // Input
        player.vx = 0;
        if (KEYS["ArrowLeft"] || KEYS["a"]) {
          player.vx = -spd;
          player.facing = -1;
          player.running = true;
        } else if (KEYS["ArrowRight"] || KEYS["d"]) {
          player.vx = spd;
          player.facing = 1;
          player.running = true;
        } else player.running = false;

        if (
          !PS.qActive &&
          (KEYS["ArrowUp"] || KEYS[" "] || KEYS["w"]) &&
          player.onGround
        ) {
          player.vy = -13;
          player.onGround = false;
          sfx.jump();
          KEYS["ArrowUp"] = false;
          KEYS[" "] = false;
          KEYS["w"] = false;
        }

        // Physics
        if (!PS.qActive) {
          player.vy += 0.55;
          player.x += player.vx;
          player.y += player.vy;
          player.x = Math.max(0, Math.min(world.w - player.w, player.x));
        }

        // Floor collision
        if (player.y + player.h >= world.floorY) {
          if (player.vy > 2) {
            sfx.land();
            spawnPfx(
              player.x + player.w / 2,
              world.floorY,
              "rgba(180,180,160,.5)",
              4,
            );
          }
          player.y = world.floorY - player.h;
          player.vy = 0;
          player.onGround = true;
        }

        // Platform collision
        scenePlatforms.forEach((p) => {
          if (
            player.x + player.w > p.x &&
            player.x < p.x + p.w &&
            player.y + player.h > p.y &&
            player.y + player.h < p.y + p.h + 14 &&
            player.vy >= 0
          ) {
            player.y = p.y - player.h;
            if (player.vy > 2) sfx.land();
            player.vy = 0;
            player.onGround = true;
          }
        });

        // Obstacle collision
        sceneObstacles.forEach((o) => {
          if (
            player.x + player.w > o.x + 3 &&
            player.x < o.x + o.w - 3 &&
            player.y + player.h > o.y &&
            player.y < o.y + o.h
          ) {
            if (player.vy >= 0 && player.y + player.h < o.y + o.h * 0.45) {
              player.y = o.y - player.h;
              player.vy = 0;
              player.onGround = true;
              if (player.vy > 2) sfx.land();
            } else {
              player.x = player.vx > 0 ? o.x - player.w : o.x + o.w;
              player.vx = 0;
            }
          }
        });

        // Camera
        const targetCam = player.x - mainCanvas.width / 3;
        world.camX += (targetCam - world.camX) * 0.12;
        world.camX = Math.max(
          0,
          Math.min(world.w - mainCanvas.width, world.camX),
        );

        // Interaction key
        if (KEYS["e"] || KEYS["E"]) {
          checkInteraction();
          KEYS["e"] = KEYS["E"] = false;
        }

        // Auto-proximity bubbles
        const px2 = player.x + player.w / 2;
        if (!sceneGuide.talked && Math.abs(px2 - sceneGuide.x) < 130) {
          showSceneBubble(
            "guide",
            "RobôGuia",
            "Olá! Sou o RobôGuia! Fale com todos os personagens para desbloquear as perguntas!",
            sceneGuide.x,
            sceneGuide.y - 80,
          );
        } else if (Math.abs(px2 - sceneGuide.x) >= 200) {
          removeSceneBubble("guide");
        }
        sceneNpcs.forEach((n) => {
          if (!n.talked && Math.abs(px2 - n.x) < 130) {
            showSceneBubble(n.id, n.nm, n.msg, n.x, n.y - 80);
          } else if (Math.abs(px2 - n.x) >= 200) {
            removeSceneBubble(n.id);
          }
        });

        // Draw
        drawScene(ts);

        // Update HUD timer (exploration)
        if (!PS.quizStarted && PS.startTime > 0) {
          const el = Math.round((Date.now() - PS.startTime) / 1000);
          const rem = Math.max(0, 300 - el);
          document.getElementById("scene-timer").textContent = formatTime(rem);
        }

        raf = requestAnimationFrame(gameLoop);
      }

      // ═══ SCENE BUBBLES ═══════════════════════════════════════════════════
      const activeSB = {};
      function showSceneBubble(id, name, text, wx, wy) {
        if (activeSB[id]) return;
        const sc = document.getElementById("scene-panel");
        const el = document.createElement("div");
        el.className = "scene-bubble";
        el.id = "sb_" + id;
        el.innerHTML = `<strong style="color:#3d0080;font-size:.8rem">${name}:</strong><br>${text}`;
        const sx = wx - world.camX;
        el.style.left =
          Math.max(8, Math.min(sx - 90, mainCanvas.width - 200)) + "px";
        el.style.top =
          Math.max(10, wy - 100 - world.floorY + world.floorY) + "px";
        el.style.top =
          Math.max(10, Math.min(wy - 160, mainCanvas.height - 200)) + "px";
        sc.appendChild(el);
        activeSB[id] = el;
      }
      function removeSceneBubble(id) {
        if (activeSB[id]) {
          activeSB[id].remove();
          delete activeSB[id];
        }
      }
      function clearSBubbles() {
        Object.keys(activeSB).forEach((k) => {
          if (activeSB[k]) activeSB[k].remove();
          delete activeSB[k];
        });
      }

      // ═══ INTERACTION ══════════════════════════════════════════════════════
      function checkInteraction() {
        if (PS.qActive) return;
        const px = player.x + player.w / 2;
        if (!sceneGuide.talked && Math.abs(px - sceneGuide.x) < 130) {
          sceneGuide.talked = true;
          spawnPfx(sceneGuide.x, sceneGuide.y, "#00e5ff", 10);
          removeSceneBubble("guide");
          showSceneBubble(
            "guide_done",
            "RobôGuia",
            "Ótimo! Agora encontre todos os personagens!",
            sceneGuide.x,
            sceneGuide.y - 80,
          );
          setTimeout(() => removeSceneBubble("guide_done"), 3000);
          return;
        }
        sceneNpcs.forEach((n) => {
          if (!n.talked && Math.abs(px - n.x) < 130) {
            n.talked = true;
            if (!PS.found.includes(n.id)) PS.found.push(n.id);
            spawnPfx(n.x, n.y, "#ffd700", 12);
            removeSceneBubble(n.id);
            showSceneBubble(n.id + "_ok", n.nm, n.msg, n.x, n.y - 80);
            setTimeout(() => removeSceneBubble(n.id + "_ok"), 3500);
            checkAllFound();
          }
        });
      }
      function checkAllFound() {
        const total = PHASES[G.phase].npcs.length;
        if (PS.found.length >= total && sceneGuide.talked && !PS.allFound) {
          PS.allFound = true;
          setTimeout(startQuiz, 1600);
        }
      }

      // ═══ QUIZ ══════════════════════════════════════════════════════════════
      function startQuiz() {
        if (PS.quizStarted) return;
        PS.quizStarted = true;
        clearSBubbles();
        // Reset timer for quiz
        PS.startTime = Date.now();
        PS.phaseScore = 0;
        PS.correct = 0;
        showQ(0);
      }

      function showQ(idx) {
        const ph = PHASES[G.phase];
        const q = ph.questions[idx];
        PS.qActive = true;
        PS.answered = false;

        // NPC say
        const npcIdx = idx % ph.npcs.length;
        const npc = ph.npcs[npcIdx];
        document.getElementById("q-npc-av").textContent = npc.emoji;
        document.getElementById("q-npc-nm").textContent = npc.nm;
        document.getElementById("q-npc-msg").textContent =
          "Para você, pergunta " + (idx + 1) + ":";

        document.getElementById("q-num").textContent =
          `Pergunta ${idx + 1} de 5`;
        document.getElementById("q-text").textContent = q.q;
        document.getElementById("q-hint").textContent = q.hint;

        // Dots HUD
        const prog = document.getElementById("g-q-prog");
        prog.innerHTML = "";
        for (let i = 0; i < 5; i++) {
          const d = document.createElement("div");
          d.className =
            "q-pip" + (i < idx ? " done" : i === idx ? " curr" : "");
          prog.appendChild(d);
        }

        // Answers
        const ac = document.getElementById("q-answers");
        ac.innerHTML = "";
        ["A", "B", "C"].forEach((l, i) => {
          const b = document.createElement("button");
          b.className = "q-btn";
          b.innerHTML = `<span class="q-letter">${l}</span>${q.a[i]}`;
          b.onclick = () => handleAnswer(i, q.c, q.fb, b);
          ac.appendChild(b);
        });

        document.getElementById("q-feedback").style.display = "none";
        document.getElementById("q-next").style.display = "none";

        // Timer
        PS.qTimer = PS.qMax;
        updateQTimer();
        clearInterval(PS.qInt);
        PS.qInt = setInterval(() => {
          PS.qTimer--;
          updateQTimer();
          if (PS.qTimer <= 0) {
            clearInterval(PS.qInt);
            if (!PS.answered) handleQTimeout();
          }
        }, 1000);
      }

      function updateQTimer() {
        const pct = (PS.qTimer / PS.qMax) * 100;
        const f = document.getElementById("q-tfill");
        f.style.width = pct + "%";
        f.className = "q-timer-fill" + (PS.qTimer <= 10 ? " urg" : "");
        const tn = document.getElementById("q-timer-num");
        tn.textContent = "⏱ " + PS.qTimer + "s";
        tn.style.color = PS.qTimer <= 10 ? "var(--red)" : "var(--green)";
      }

      function handleAnswer(chosen, correct, fb, btnEl) {
        if (PS.answered) return;
        PS.answered = true;
        clearInterval(PS.qInt);
        document.querySelectorAll(".q-btn").forEach((b) => (b.disabled = true));
        const ok = chosen === correct;
        document.querySelectorAll(".q-btn").forEach((b, i) => {
          if (i === correct) b.classList.add("correct");
          else if (i === chosen && !ok) b.classList.add("wrong");
        });
        const fbEl = document.getElementById("q-feedback");
        document.getElementById("fb-title").textContent = ok
          ? "✅ Correto! +pts"
          : "❌ Incorreto";
        document.getElementById("fb-body").textContent = fb;
        fbEl.className = "q-feedback " + (ok ? "ok" : "bad");
        fbEl.style.display = "block";
        if (ok) {
          const bonus = Math.floor(PS.qTimer * 2);
          const pts = 100 + bonus;
          G.score += pts;
          PS.phaseScore += pts;
          PS.correct++;
          document.getElementById("g-score").textContent = G.score;
          document.getElementById("scene-pts").textContent = G.score;
          sfx.correct();
          showPtFly("+" + pts, "#ffd700");
          spawnPfx(player.x + player.w / 2, player.y, "#2ecc71", 10);
        } else {
          PS.errors++;
          G.lives = Math.max(0, G.lives - 1);
          sfx.wrong();
          showPtFly("✗", "#e53935");
          renderHearts();
        }
        document.getElementById("q-next").style.display = "block";
        document.getElementById("q-next").onclick = advanceQ;
      }

      function handleQTimeout() {
        if (PS.answered) return;
        PS.answered = true;
        PS.errors++;
        G.lives = Math.max(0, G.lives - 1);
        document.querySelectorAll(".q-btn").forEach((b) => (b.disabled = true));
        document
          .querySelectorAll(".q-btn")
          [PHASES[G.phase].questions[PS.qIdx].c].classList.add("correct");
        const fbEl = document.getElementById("q-feedback");
        document.getElementById("fb-title").textContent = "⏰ Tempo Esgotado!";
        document.getElementById("fb-body").textContent =
          PHASES[G.phase].questions[PS.qIdx].fb;
        fbEl.className = "q-feedback bad";
        fbEl.style.display = "block";
        renderHearts();
        showPtFly("⏰", "#ff6f00");
        document.getElementById("q-next").style.display = "block";
        document.getElementById("q-next").onclick = advanceQ;
      }

      function advanceQ() {
        clearInterval(PS.qInt);
        if (PS.errors >= 2) {
          // FAIL – restart quiz
          document.getElementById("q-feedback").style.display = "none";
          document.getElementById("q-next").style.display = "none";
          const fo = document.getElementById("fail-overlay");
          fo.classList.add("show");
          setTimeout(() => {
            fo.classList.remove("show");
            // Reset quiz only
            PS.qIdx = 0;
            PS.errors = 0;
            PS.phaseScore = 0;
            PS.correct = 0;
            PS.quizStarted = false;
            PS.allFound = false;
            PS.found = [];
            sceneNpcs.forEach((n) => (n.talked = false));
            sceneGuide.talked = false;
            PS.qActive = false;
            G.lives = 3;
            renderHearts();
            showQ(0); // restart quiz
          }, 2500);
          return;
        }
        const nq = PS.qIdx + 1;
        if (nq >= 5) {
          PS.qActive = false;
          document.getElementById("q-feedback").style.display = "none";
          document.getElementById("q-next").style.display = "none";
          endPhase();
        } else {
          PS.qIdx = nq;
          showQ(nq);
        }
      }

      // ═══ END PHASE ════════════════════════════════════════════════════════
      function endPhase() {
        const elapsed = Math.round((Date.now() - PS.startTime) / 1000);
        G.totalTime += elapsed;
        G.phasesData.push({
          score: PS.phaseScore,
          correct: PS.correct,
          time: elapsed,
          errors: PS.errors,
        });
        const hasRw = PS.errors <= 1;
        const ph = PHASES[G.phase];
        if (hasRw)
          ph.rewards.forEach((r) => {
            if (!G.earned.find((e) => e.emoji === r.emoji)) G.earned.push(r);
          });

        document.getElementById("rw-emoji-big").textContent = hasRw
          ? "🎉"
          : "😓";
        document.getElementById("rw-title").textContent = hasRw
          ? "Fase " + ph.id + " Concluída!"
          : "Fase Completa";
        document.getElementById("rw-sub").textContent = hasRw
          ? "Parabéns! Você errou menos de 2 vezes!"
          : "Você completou a fase, mas errou 2+ vezes.";
        document.getElementById("rw-pts").textContent = PS.phaseScore;
        document.getElementById("rw-acc").textContent = PS.correct + "/5";
        document.getElementById("rw-tm").textContent = elapsed + "s";
        const noRwMsg = document.getElementById("rw-no-reward-msg");
        noRwMsg.style.display = hasRw ? "none" : "block";
        const rwItems = document.getElementById("rw-items");
        rwItems.innerHTML = "";
        ph.rewards.forEach((r) => {
          const d = document.createElement("div");
          d.className = "rw-item";
          d.innerHTML = `<span class="rw-item-emoji" style="${!hasRw ? "filter:grayscale(1);opacity:.3" : ""}">${r.emoji}</span><div class="rw-item-label">${hasRw ? r.nm : "Bloqueado"}</div>`;
          rwItems.appendChild(d);
          if (hasRw) setTimeout(() => d.classList.add("pop"), 200);
        });
        if (hasRw) sfx.victory();
        updateAccBar();
        document.getElementById("ov-reward").classList.add("show");
        document.getElementById("rw-continue").onclick = () => {
          sfx.click();
          document.getElementById("ov-reward").classList.remove("show");
          if (G.phase < 2) {
            G.phase++;
            G.lives = 3;
            renderHearts();
            document.getElementById("phase-tag-bar").textContent =
              "Fase " + (G.phase + 1) + "/3";
            document.getElementById("g-phase-name").textContent =
              "Fase " + (G.phase + 1) + " – " + PHASES[G.phase].title;
            setupPhase(G.phase);
          } else {
            showVictory();
          }
        };
      }

      // ═══ VICTORY ══════════════════════════════════════════════════════════
      function showVictory() {
        gameRunning = false;
        cancelAnimationFrame(raf);
        clearSBubbles();
        document.getElementById("v-player-name").textContent =
          CHARS[G.charIdx].nm + " – " + G.name;
        document.getElementById("v-pts").textContent = G.score;
        document.getElementById("v-time").textContent = formatTime(G.totalTime);
        const entry = {
          name: G.name,
          char: CHARS[G.charIdx].nm,
          score: G.score,
          time: G.totalTime,
          date: new Date().toLocaleDateString("pt-BR"),
        };
        const r = saveRank(entry);
        const pos =
          r.findIndex(
            (e) =>
              e.name === entry.name &&
              e.score === entry.score &&
              e.time === entry.time,
          ) + 1;
        document.getElementById("v-rank").textContent = pos + "º";
        const vr = document.getElementById("v-rewards");
        vr.innerHTML = "";
        ALL_REWARDS.forEach((r) => {
          const has = G.earned.find((e) => e.emoji === r.emoji);
          const d = document.createElement("div");
          d.className = "v-rw";
          d.innerHTML = `<span style="font-size:1.8rem;display:block;margin-bottom:3px;${!has ? "filter:grayscale(1);opacity:.3" : "filter:drop-shadow(0 0 7px gold)"}">${r.emoji}</span><div style="font-size:.68rem;color:var(--dim)">${has ? r.nm : "Bloqueado"}</div>`;
          vr.appendChild(d);
        });
        sfx.victory();
        spawnConfetti();
        renderRankFull();
        document.getElementById("ov-victory").classList.add("show");
      }

      // ═══ SETUP PHASE ══════════════════════════════════════════════════════
      function setupPhase(idx) {
        PS = {
          found: [],
          allFound: false,
          qIdx: 0,
          errors: 0,
          qActive: false,
          answered: false,
          qTimer: 0,
          qMax: 40,
          qInt: null,
          startTime: Date.now(),
          phaseScore: 0,
          correct: 0,
          quizStarted: false,
          guideRead: false,
        };
        particles = [];
        clearSBubbles();
        world.w = PHASE_WORLDS[idx].w;
        world.camX = 0;
        player.x = 80;
        player.y = world.floorY - player.h;
        player.vx = 0;
        player.vy = 0;
        player.onGround = true;
        resizeCanvas();
        // Show phase intro
        const ph = PHASES[idx];
        document.getElementById("ph-badge").textContent = "Fase " + ph.id;
        document.getElementById("ph-icon").textContent = ph.icon;
        document.getElementById("ph-title").textContent = ph.title;
        document.getElementById("ph-desc").textContent =
          ph.story +
          " Explore o cenário, encontre todos os personagens e responda as perguntas!";
        const phNpcs = document.getElementById("ph-npcs");
        phNpcs.innerHTML = "";
        ph.npcs.forEach((n) => {
          const d = document.createElement("div");
          d.className = "ph-npc";
          d.innerHTML = `<span class="ph-npc-emoji">${n.emoji}</span><div class="ph-npc-name">${n.nm}</div>`;
          phNpcs.appendChild(d);
        });
        document.getElementById("ov-phase").classList.add("show");
        document.getElementById("ph-start").onclick = () => {
          sfx.click();
          document.getElementById("ov-phase").classList.remove("show");
          gameRunning = true;
          lastT = performance.now();
          requestAnimationFrame(gameLoop);
        };
        // HUD
        document.getElementById("g-phase-name").textContent =
          "Fase " + (idx + 1) + " – " + ph.title;
        document.getElementById("g-score").textContent = G.score;
        document.getElementById("scene-pts").textContent = G.score;
        renderHearts();
        updateAccBar();
        document.getElementById("phase-tag-bar").textContent =
          "Fase " + (idx + 1) + "/3";
        document.getElementById("g-name-pill").textContent =
          CHARS[G.charIdx].nm + " | " + G.name;
        // Q panel default
        document.getElementById("q-npc-av").textContent = ph.npcs[0].emoji;
        document.getElementById("q-npc-nm").textContent = ph.npcs[0].nm;
        document.getElementById("q-npc-msg").textContent = ph.story;
        document.getElementById("q-num").textContent = "Pergunta - de 5";
        document.getElementById("q-text").textContent =
          "Explore o cenário e fale com todos os personagens para desbloquear as perguntas!";
        document.getElementById("q-hint").textContent =
          "Use E para interagir ao se aproximar de um personagem.";
        document.getElementById("q-answers").innerHTML = "";
        document.getElementById("q-feedback").style.display = "none";
        document.getElementById("q-next").style.display = "none";
        document.getElementById("q-tfill").style.width = "100%";
      }

      // ═══ ACCESSORY BAR ════════════════════════════════════════════════════
      function updateAccBar() {
        const bar = document.getElementById("acc-items");
        bar.innerHTML = "";
        ALL_REWARDS.forEach((r) => {
          const has = G.earned.find((e) => e.emoji === r.emoji);
          const d = document.createElement("div");
          d.className = "acc-item " + (has ? "earned" : "locked");
          d.textContent = r.emoji;
          d.title = has ? r.nm : "Bloqueado";
          bar.appendChild(d);
        });
      }

      // ═══ RANKING ══════════════════════════════════════════════════════════
      function getRank() {
        try {
          return JSON.parse(localStorage.getItem("capycode3") || "[]");
        } catch {
          return [];
        }
      }
      function saveRank(entry) {
        let r = getRank();
        r.push(entry);
        r.sort((a, b) => b.score - a.score || a.time - b.time);
        r = r.slice(0, 50);
        localStorage.setItem("capycode3", JSON.stringify(r));
        return r;
      }
      function renderRankIntro() {
        const r = getRank();
        const el = document.getElementById("rank-list-intro");
        if (!r.length) {
          el.innerHTML =
            '<div style="color:var(--dim);text-align:center;padding:12px;font-size:.85rem">Seja o primeiro!</div>';
          return;
        }
        const m = ["🥇", "🥈", "🥉"];
        el.innerHTML = r
          .slice(0, 3)
          .map(
            (e, i) => `
    <div class="rank-row">
      <span class="rank-medal">${m[i] || "#" + (i + 1)}</span>
      <div class="rank-nm">${e.name} <span style="font-size:.7rem;color:var(--dim)">${e.char || ""}</span></div>
      <span class="rank-pts">⭐${e.score}</span>
      <span class="rank-tm">⏱${formatTime(e.time)}</span>
    </div>`,
          )
          .join("");
      }
      function renderRankFull() {
        const r = getRank();
        const el = document.getElementById("rank-list-full");
        if (!r.length) {
          el.innerHTML =
            '<div style="color:var(--dim);text-align:center;padding:14px">Ninguém jogou ainda!</div>';
          return;
        }
        const m = ["🥇", "🥈", "🥉"];
        el.innerHTML = r
          .map(
            (e, i) => `
    <div class="rank-row">
      <span class="rank-medal">${m[i] || "#" + (i + 1)}</span>
      <div>
        <div class="rank-nm">${e.name} <span style="font-size:.72rem;color:var(--dim)">${e.char || ""}</span></div>
        <div style="font-size:.68rem;color:var(--dim)">${e.date || ""}</div>
      </div>
      <span class="rank-pts">⭐${e.score}</span>
      <span class="rank-tm">⏱${formatTime(e.time)}</span>
    </div>`,
          )
          .join("");
      }

      // ═══ UTILS ════════════════════════════════════════════════════════════
      function formatTime(s) {
        return (
          Math.floor(s / 60)
            .toString()
            .padStart(2, "0") +
          ":" +
          (s % 60).toString().padStart(2, "0")
        );
      }

      function renderHearts() {
        const el = document.getElementById("g-hearts");
        el.innerHTML = "";
        for (let i = 0; i < 3; i++) {
          const s = document.createElement("span");
          s.className = "hud-heart" + (i >= G.lives ? " lost" : "");
          s.textContent = "❤️";
          el.appendChild(s);
        }
      }

      function showPtFly(txt, col) {
        const el = document.createElement("div");
        el.className = "pt-fly";
        el.textContent = txt;
        el.style.color = col;
        el.style.left = 80 + Math.random() * 200 + "px";
        el.style.top = "70px";
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1600);
      }

      function spawnConfetti() {
        const cs = [
          "#ffc107",
          "#2ecc71",
          "#42a5f5",
          "#ff6f00",
          "#e91e8c",
          "#e53935",
        ];
        for (let i = 0; i < 100; i++) {
          const el = document.createElement("div");
          el.className = "conf-piece";
          el.style.cssText = `left:${Math.random() * 100}vw;top:-20px;width:${8 + Math.random() * 10}px;height:${8 + Math.random() * 10}px;background:${cs[Math.floor(Math.random() * cs.length)]};border-radius:${Math.random() > 0.5 ? "50%" : "3px"};animation-duration:${2 + Math.random() * 3}s;animation-delay:${Math.random() * 2}s;`;
          document.body.appendChild(el);
          setTimeout(() => el.remove(), 6000);
        }
      }

      // ═══ MASCOT CANVAS ════════════════════════════════════════════════════
      function drawMascotHero() {
        const cv = document.getElementById("mascotCanvas");
        if (!cv) return;
        cv.width = cv.offsetWidth * 2 || 640;
        cv.height = cv.offsetHeight * 2 || 320;
        const C = cv.getContext("2d"),
          W = cv.width,
          H = cv.height;
        // BG
        const bg = C.createLinearGradient(0, 0, W, H);
        bg.addColorStop(0, "#0a1f5e");
        bg.addColorStop(1, "#1a3a70");
        C.fillStyle = bg;
        C.fillRect(0, 0, W, H);
        // Draw lab bg elements
        C.fillStyle = "rgba(0,100,200,.2)";
        for (let i = 0; i < 3; i++) {
          C.fillRect(30 + i * 180, 10, 140, 90);
          C.strokeStyle = "rgba(0,150,255,.4)";
          C.lineWidth = 1.5;
          C.strokeRect(30 + i * 180, 10, 140, 90);
        }
        // Capivara (boy uniform)
        const cx = W * 0.2,
          cy = H * 0.55,
          bw = W * 0.12,
          bh = H * 0.55;
        C.fillStyle = "#c0783c";
        C.beginPath();
        if (C.roundRect) C.roundRect(cx - bw / 2, cy - bh / 2, bw, bh, 14);
        else C.rect(cx - bw / 2, cy - bh / 2, bw, bh);
        C.fill();
        // White-green uniform
        C.fillStyle = "#fff";
        C.beginPath();
        if (C.roundRect)
          C.roundRect(cx - bw / 2, cy - bh * 0.1, bw, bh * 0.6, 10);
        else C.rect(cx - bw / 2, cy - bh * 0.1, bw, bh * 0.6);
        C.fill();
        // Green stripe
        C.fillStyle = "#1a9e55";
        C.fillRect(cx - bw / 2, cy + bh * 0.15, bw, bh * 0.06);
        C.fillStyle = "#ffd700";
        C.fillRect(cx - bw / 2, cy + bh * 0.21, bw, bh * 0.05);
        C.fillStyle = "#3498db";
        C.fillRect(cx - bw / 2, cy + bh * 0.26, bw, bh * 0.05);
        // Head
        C.fillStyle = "#c0783c";
        C.beginPath();
        C.ellipse(cx, cy - bh / 2 + 8, bw * 0.42, bh * 0.28, 0, 0, Math.PI * 2);
        C.fill();
        C.beginPath();
        C.ellipse(cx - bw * 0.32, cy - bh / 2 - 8, 8, 13, -0.2, 0, Math.PI * 2);
        C.fill();
        C.beginPath();
        C.ellipse(cx + bw * 0.32, cy - bh / 2 - 8, 8, 13, 0.2, 0, Math.PI * 2);
        C.fill();
        C.fillStyle = "#1a0a00";
        C.beginPath();
        C.arc(cx - 12, cy - bh * 0.27, 5, 0, Math.PI * 2);
        C.fill();
        C.beginPath();
        C.arc(cx + 12, cy - bh * 0.27, 5, 0, Math.PI * 2);
        C.fill();
        C.fillStyle = "#fff";
        C.beginPath();
        C.arc(cx - 10, cy - bh * 0.29, 2, 0, Math.PI * 2);
        C.fill();
        C.beginPath();
        C.arc(cx + 14, cy - bh * 0.29, 2, 0, Math.PI * 2);
        C.fill();
        C.fillStyle = "rgba(175,125,90,.7)";
        C.beginPath();
        C.ellipse(cx, cy - bh * 0.12, 12, 8, 0, 0, Math.PI * 2);
        C.fill();
        C.fillStyle = "#2a1000";
        C.beginPath();
        C.arc(cx - 3, cy - bh * 0.09, 2.5, 0, Math.PI * 2);
        C.fill();
        C.beginPath();
        C.arc(cx + 3, cy - bh * 0.09, 2.5, 0, Math.PI * 2);
        C.fill();
        // Mochila
        C.fillStyle = "#2c5f2e";
        C.beginPath();
        if (C.roundRect)
          C.roundRect(cx + bw * 0.35, cy - bh * 0.25, bw * 0.4, bh * 0.55, 8);
        else C.rect(cx + bw * 0.35, cy - bh * 0.25, bw * 0.4, bh * 0.55);
        C.fill();
        C.fillStyle = "rgba(255,255,255,.15)";
        C.fillRect(cx + bw * 0.37, cy - bh * 0.1, bw * 0.36, 4);
        // RoboGuide
        const rx = W * 0.65;
        C.font = `${H * 0.55}px serif`;
        C.textAlign = "center";
        C.fillText("🤖", rx, cy + bh * 0.4);
      }

      // Preview scenes for intro
      function drawPreviewScenes() {
        const types = ["lab", "forest", "stage"];
        types.forEach((t, i) => {
          const cv = document.getElementById("scene-prev-" + (i + 1));
          if (!cv) return;
          cv.width = cv.offsetWidth * 2 || 600;
          cv.height = cv.offsetHeight * 2 || 240;
          const C = cv.getContext("2d"),
            W = cv.width,
            H = cv.height;
          const grads = {
            lab: ["#061830", "#0a2540", "#0d3555"],
            forest: ["#071a07", "#0d2e0a", "#1a3d10"],
            stage: ["#1a0535", "#2a0e60", "#1a1555"],
          };
          const cols = grads[t];
          const g = C.createLinearGradient(0, 0, 0, H);
          g.addColorStop(0, cols[0]);
          g.addColorStop(0.6, cols[1]);
          g.addColorStop(1, cols[2]);
          C.fillStyle = g;
          C.fillRect(0, 0, W, H);
          const flY = H - 50;
          C.fillStyle =
            t === "forest" ? "#1a3500" : t === "stage" ? "#2a0a50" : "#1a3a1a";
          C.fillRect(0, flY, W, H - flY);
          if (t === "lab") {
            for (let j = 0; j < 3; j++) {
              C.fillStyle = "rgba(0,80,160,.25)";
              C.fillRect(20 + j * 180, 15, 140, 75);
              C.strokeStyle = "rgba(0,150,255,.4)";
              C.lineWidth = 1;
              C.strokeRect(20 + j * 180, 15, 140, 75);
            }
          } else if (t === "forest") {
            for (let j = 0; j < 5; j++) {
              const tx = j * 120 + 30;
              const th = 90 + ((j * 12) % 40);
              C.fillStyle = "#3a1e00";
              C.fillRect(tx + 10, flY - th, 12, th);
              C.fillStyle = `hsl(${110 + j * 8},62%,24%)`;
              C.beginPath();
              C.arc(tx + 16, flY - th - 20, 32, 0, Math.PI * 2);
              C.fill();
            }
          } else {
            C.fillStyle = "rgba(100,0,60,.4)";
            C.fillRect(0, 0, 100, H);
            C.fillRect(W - 100, 0, 100, H);
            for (let j = 0; j < 3; j++) {
              const sg = C.createRadialGradient(
                j * (W / 2.5) + 100,
                0,
                0,
                j * (W / 2.5) + 100,
                140,
                140,
              );
              sg.addColorStop(0, "rgba(255,220,100,.18)");
              sg.addColorStop(1, "transparent");
              C.fillStyle = sg;
              C.fillRect(j * (W / 2.5), 0, W / 2, 280);
            }
          }
          // NPCs
          const emojis = [
            ["🦊", "🤖", "🐾"],
            ["🦜", "🐆", "🦅", "😈"],
            ["🦊", "🤖", "🦝"],
          ];
          emojis[i].forEach((e, j) => {
            C.font = `${H * 0.28}px serif`;
            C.textAlign = "center";
            C.fillText(e, 50 + j * (W / (emojis[i].length + 1)), flY - 8);
          });
          // Player
          C.font = `${H * 0.25}px serif`;
          C.fillText("🦫", W * 0.15, flY - 6);
        });
      }

      // Char previews
      function drawCharPreviews() {
        CHARS.forEach((ch, idx) => {
          const cv = document.getElementById("cv-char-" + idx);
          if (!cv) return;
          cv.width = 70;
          cv.height = 70;
          const C = cv.getContext("2d"),
            W = cv.width,
            H = cv.height;
          const cx = W / 2,
            cy = H / 2 + 6,
            bw = 34,
            bh = 44;
          C.fillStyle = ch.fur;
          C.beginPath();
          if (C.roundRect) C.roundRect(cx - bw / 2, cy - bh / 2, bw, bh, 10);
          else C.rect(cx - bw / 2, cy - bh / 2, bw, bh);
          C.fill();
          if (idx === 0) {
            C.fillStyle = ch.jacket;
            C.beginPath();
            if (C.roundRect) C.roundRect(cx - bw / 2, cy + 1, bw, bh * 0.5, 7);
            else C.rect(cx - bw / 2, cy + 1, bw, bh * 0.5);
            C.fill();
            C.fillStyle = ch.hood;
            C.beginPath();
            C.arc(cx, cy - bh / 2 + 5, bw * 0.42, Math.PI, 0);
            C.fill();
          } else if (idx === 1) {
            C.fillStyle = ch.knit;
            C.beginPath();
            if (C.roundRect) C.roundRect(cx - bw / 2, cy - 2, bw, bh * 0.55, 7);
            else C.rect(cx - bw / 2, cy - 2, bw, bh * 0.55);
            C.fill();
            C.fillStyle = ch.bow;
            C.beginPath();
            C.arc(cx - 6, cy - bh / 2 + 1, 7, 0, Math.PI * 2);
            C.fill();
            C.beginPath();
            C.arc(cx + 6, cy - bh / 2 + 1, 7, 0, Math.PI * 2);
            C.fill();
            C.beginPath();
            C.arc(cx, cy - bh / 2 + 3, 4, 0, Math.PI * 2);
            C.fill();
          } else {
            C.fillStyle = ch.shirt;
            C.beginPath();
            if (C.roundRect) C.roundRect(cx - bw / 2, cy - 2, bw, bh * 0.55, 7);
            else C.rect(cx - bw / 2, cy - 2, bw, bh * 0.55);
            C.fill();
            C.strokeStyle = ch.tie;
            C.lineWidth = 1.5;
            C.beginPath();
            C.arc(cx - 7, cy - bh * 0.18, 5, 0, Math.PI * 2);
            C.stroke();
            C.beginPath();
            C.arc(cx + 7, cy - bh * 0.18, 5, 0, Math.PI * 2);
            C.stroke();
            C.beginPath();
            C.moveTo(cx - 2, cy - bh * 0.18);
            C.lineTo(cx + 2, cy - bh * 0.18);
            C.stroke();
          }
          C.fillStyle = ch.fur;
          C.beginPath();
          C.ellipse(
            cx,
            cy - bh / 2 + 4,
            bw * 0.37,
            bh * 0.27,
            0,
            0,
            Math.PI * 2,
          );
          C.fill();
          C.beginPath();
          C.ellipse(
            cx - bw * 0.28,
            cy - bh / 2 - 4,
            6,
            9,
            -0.2,
            0,
            Math.PI * 2,
          );
          C.fill();
          C.beginPath();
          C.ellipse(cx + bw * 0.28, cy - bh / 2 - 4, 6, 9, 0.2, 0, Math.PI * 2);
          C.fill();
          C.fillStyle = "#1a0a00";
          C.beginPath();
          C.arc(cx - 8, cy - bh * 0.27, 3.5, 0, Math.PI * 2);
          C.fill();
          C.beginPath();
          C.arc(cx + 8, cy - bh * 0.27, 3.5, 0, Math.PI * 2);
          C.fill();
          C.fillStyle = "#fff";
          C.beginPath();
          C.arc(cx - 6, cy - bh * 0.29, 1.2, 0, Math.PI * 2);
          C.fill();
          C.beginPath();
          C.arc(cx + 10, cy - bh * 0.29, 1.2, 0, Math.PI * 2);
          C.fill();
          C.fillStyle = "rgba(175,120,90,.7)";
          C.beginPath();
          C.ellipse(cx, cy - bh * 0.12, 9, 6, 0, 0, Math.PI * 2);
          C.fill();
          C.fillStyle = "#2a1000";
          C.beginPath();
          C.arc(cx - 2, cy - bh * 0.09, 2, 0, Math.PI * 2);
          C.fill();
          C.beginPath();
          C.arc(cx + 2, cy - bh * 0.09, 2, 0, Math.PI * 2);
          C.fill();
        });
      }

      function buildCharGrid() {
        const g = document.getElementById("char-grid");
        g.innerHTML = "";
        CHARS.forEach((ch, i) => {
          const d = document.createElement("div");
          d.className = "char-card" + (i === 0 ? " sel" : "");
          d.dataset.idx = i;
          d.innerHTML = `<canvas class="char-cv" id="cv-char-${i}" width="70" height="70"></canvas><div class="char-nm">${ch.nm}</div><div class="char-lbl">${ch.lbl}</div><div class="sel-check">✓</div>`;
          d.addEventListener("click", () => {
            sfx.click();
            document
              .querySelectorAll(".char-card")
              .forEach((c) => c.classList.remove("sel"));
            d.classList.add("sel");
            G.charIdx = i;
          });
          g.appendChild(d);
        });
        setTimeout(drawCharPreviews, 50);
      }

      // ═══ KEYBOARD ════════════════════════════════════════════════════════
      document.addEventListener("keydown", (e) => {
        KEYS[e.key] = true;
        if (
          ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(
            e.key,
          )
        )
          e.preventDefault();
      });
      document.addEventListener("keyup", (e) => (KEYS[e.key] = false));

      // ═══ BUTTON WIRING ════════════════════════════════════════════════════
      function showScreen(id) {
        document
          .querySelectorAll(".screen")
          .forEach((s) => s.classList.remove("active"));
        document.getElementById(id).classList.add("active");
      }

      function startGame() {
        const nm = (
          document.getElementById("inp-name").value ||
          document.getElementById("inp-name2").value
        ).trim();
        if (!nm) {
          const el = document.getElementById("inp-name");
          el.focus();
          el.style.borderColor = "var(--red)";
          setTimeout(() => (el.style.borderColor = ""), 1500);
          return;
        }
        sfx.click();
        G.name = nm;
        G.charIdx = parseInt(
          document.querySelector(".char-card.sel").dataset.idx,
        );
        G.score = 0;
        G.totalTime = 0;
        G.lives = 3;
        G.earned = [];
        G.phasesData = [];
        G.phase = 0;
        showScreen("s-game");
        resizeCanvas();
        setupPhase(0);
      }

      document.getElementById("btn-jogar").onclick = startGame;
      document.getElementById("btn-comecar").onclick = startGame;

      document.getElementById("btn-como").onclick = () => {
        sfx.click();
        document.getElementById("ov-howto").classList.add("show");
      };
      document.getElementById("ov-howto-close").onclick = () => {
        sfx.click();
        document.getElementById("ov-howto").classList.remove("show");
      };
      document.getElementById("btn-cred").onclick = () => {
        sfx.click();
        document.getElementById("ov-credits").classList.add("show");
      };
      document.getElementById("ov-credits-close").onclick = () => {
        sfx.click();
        document.getElementById("ov-credits").classList.remove("show");
      };
      document.getElementById("btn-ver-todos").onclick = () => {
        sfx.click();
        renderRankFull();
        document.getElementById("ov-ranking").classList.add("show");
      };
      document.getElementById("ov-rank-close").onclick = () => {
        sfx.click();
        document.getElementById("ov-ranking").classList.remove("show");
      };

      document.getElementById("v-play-again").onclick = () => {
        sfx.click();
        document.getElementById("ov-victory").classList.remove("show");
        gameRunning = false;
        cancelAnimationFrame(raf);
        showScreen("s-intro");
        renderRankIntro();
      };
      document.getElementById("v-ranking").onclick = () => {
        sfx.click();
        document.getElementById("ov-victory").classList.remove("show");
        gameRunning = false;
        cancelAnimationFrame(raf);
        showScreen("s-intro");
        renderRankFull();
        renderRankIntro();
        document.getElementById("ov-ranking").classList.add("show");
      };

      // Sync name fields
      document.getElementById("inp-name").oninput = (e) => {
        document.getElementById("inp-name2").value = e.target.value;
      };
      document.getElementById("inp-name2").oninput = (e) => {
        document.getElementById("inp-name").value = e.target.value;
      };

      // Resize
      window.addEventListener("resize", () => {
        if (gameRunning) resizeCanvas();
        drawMascotHero();
        drawPreviewScenes();
      });

      // ═══ INIT ════════════════════════════════════════════════════════════
      buildCharGrid();
      renderRankIntro();
      setTimeout(() => {
        drawMascotHero();
        drawPreviewScenes();
      }, 100);
      updateAccBar();

      console.log(
        "%c🦫 CapyCode v3 Premium carregado!",
        "color:#2ecc71;font-weight:bold;font-size:1.2rem",
      );
  
