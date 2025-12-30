document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.hero');
    const codeWindow = document.querySelector('.code-window');

    if (heroSection && codeWindow) {
        heroSection.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            const xRotation = ((clientY - innerHeight / 2) / innerHeight) * 18;
            const yRotation = ((clientX - innerWidth / 2) / innerWidth) * 18;

            codeWindow.style.transition = 'transform 0.1s ease-out';
            codeWindow.style.transform = `perspective(1000px) rotateX(${-xRotation}deg) rotateY(${yRotation / 2}deg)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            codeWindow.style.transition = 'transform 0.5s ease';
            codeWindow.style.transform = 'perspective(1000px) rotateY(-5deg) rotateX(2deg)';
        });
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.glass-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;

        observer.observe(card);
    });

    const codeBlock = document.querySelector('code');
});

(function () {
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    }, false);

    document.addEventListener('keydown', (e) => {
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }

        const isCtrl = e.ctrlKey || e.metaKey;
        const isShift = e.shiftKey;
        const isAlt = e.altKey;

        if (isCtrl && isShift && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
            e.preventDefault();
            return false;
        }

        if (isCtrl && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }

        if (isCtrl && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }

        if (isCtrl && e.keyCode === 80) {
            e.preventDefault();
            return false;
        }

        if (isCtrl && isAlt && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
    }, false);

    document.addEventListener('dragstart', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => e.preventDefault());

    const antiDebug = () => {
        try {
            (function () {
                (function a() {
                    try {
                        (function b(i) {
                            if (("" + i / i).length !== 1 || i % 20 === 0) {
                                (function () { }).constructor("debugger")();
                            } else {
                                debugger;
                            }
                            b(++i);
                        })(0);
                    } catch (e) { }
                })();
            })();
        } catch (e) { }
    };

    setInterval(antiDebug, 1000);

    setInterval(() => {
        console.clear();
        console.log("%cSecurity System Active", "color: red; font-size: 20px; font-weight: bold;");
        console.log("DevTools is disabled for security reasons.");
    }, 1500);
})();

