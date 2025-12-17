// Snow Animation Logic
class Snowflake {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        const height = canvas.height || window.innerHeight;
        this.y = Math.random() * height;
    }

    reset() {
        const width = this.canvas.width || window.innerWidth;
        this.x = Math.random() * width;
        this.y = -10;
        this.size = Math.random() * 2 + 1;
        this.speed = Math.random() * 0.5 + 0.3;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.wind = Math.random() * 0.3 - 0.15;
    }

    update() {
        this.y += this.speed;
        this.x += this.wind;

        if (this.y > this.canvas.height) {
            this.reset();
        }

        if (this.x < 0) {
            this.x = this.canvas.width;
        } else if (this.x > this.canvas.width) {
            this.x = 0;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

class SnowAnimation {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.snowflakes = [];
        this.isRunning = false;
        this.flakeCount = 80;
        this.resizeHandler = null;
    }

    init() {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'advent-snow-canvas';

            // Check if already exists (though CSS handles styles now, we keep ID check)
            const existingCanvas = document.getElementById('advent-snow-canvas');
            if (existingCanvas) {
                this.canvas = existingCanvas;
            } else {
                document.body.appendChild(this.canvas);
            }

            this.ctx = this.canvas.getContext('2d');

            this.resizeHandler = () => {
                if (this.canvas) {
                    this.canvas.width = window.innerWidth;
                    this.canvas.height = window.innerHeight;
                }
            };

            this.resizeHandler();
            window.addEventListener('resize', this.resizeHandler);

            for (let i = 0; i < this.flakeCount; i++) {
                this.snowflakes.push(new Snowflake(this.canvas));
            }
        }
    }

    start() {
        if (!this.isRunning) {
            if (!this.canvas) {
                this.init();
            }
            this.isRunning = true;
            this.animate();
        }
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.canvas && this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    destroy() {
        this.stop();
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.remove();
            this.canvas = null;
            this.ctx = null;
        }
    }

    animate() {
        if (!this.isRunning || !this.canvas || !this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.snowflakes.forEach(flake => {
            flake.update();
            flake.draw(this.ctx);
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

let snowInstance = null;

function initAdventSnow() {
    if (!snowInstance) {
        snowInstance = new SnowAnimation();
    }

    // Check preference from chrome.storage
    // Note: chrome.storage is async, so we wrap the start logic
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.get({ snowDisabled: false, allAnimationsDisabled: false }, function (items) {
            const isSnowDisabled = items.snowDisabled;
            const isAllDisabled = items.allAnimationsDisabled;

            if (isAllDisabled) {
                return;
            }

            const isDisabled = isSnowDisabled;

            const now = new Date();
            const month = now.getMonth(); // 0 = Jan, 11 = Dec

            if ((month === 11 || month === 0 || month === 1) && !isDisabled) {
                snowInstance.start();
            }
        });
    } else {
        // Fallback for non-extension environment (local testing)
        // or if permissions are missing
        const now = new Date();
        const month = now.getMonth();
        if (month === 11 || month === 0 || month === 1) {
            snowInstance.start();
        }
    }

    return snowInstance;
}

// Auto-start on load
initAdventSnow();
