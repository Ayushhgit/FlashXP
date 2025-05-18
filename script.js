        // Initialize AOS
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });

        // Typing effect
        const texts = [
            "Level up your learning",
            "Track. Improve. Conquer.",
            "Study smarter, not harder."
        ];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        const typingElement = document.getElementById('typing-text');

        function typeText() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typingSpeed = 1500; // Pause at the end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500; // Pause before typing next text
            }

            setTimeout(typeText, typingSpeed);
        }

        // Start typing effect
        window.addEventListener('load', typeText);

        // Loading animation
        const loaderOverlay = document.getElementById('loader');
        const progressBar = document.getElementById('progress');
        const loadingText = document.getElementById('loading-text');
        const launchButtons = [document.getElementById('launch-btn'), document.getElementById('cta-btn')];

        launchButtons.forEach(button => {
            if (button) {
                button.addEventListener('click', function() {
                    // Show loader
                    loaderOverlay.style.display = 'flex';
                    
                    // Animation for progress bar
                    let width = 0;
                    const interval = setInterval(function() {
                        if (width >= 100) {
                            clearInterval(interval);
                            // Redirect after 5 seconds
                            setTimeout(function() {
                                window.location.href = 'tracker.html';
                            }, 500);
                        } else {
                            width += 2;
                            progressBar.style.width = width + '%';
                            
                            // Update loading text at certain points
                            if (width === 20) {
                                loadingText.textContent = "Preparing your dashboard...";
                            } else if (width === 50) {
                                loadingText.textContent = "Loading study data...";
                            } else if (width === 80) {
                                loadingText.textContent = "Almost there...";
                            }
                        }
                    }, 100);
                });
            }
        });

        // Simple parallax effect
        document.addEventListener('mousemove', function(e) {
            const blobs = document.querySelectorAll('.blob');
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            blobs.forEach((blob, index) => {
                const speed = (index + 1) * 15;
                const xOffset = (x - 0.5) * speed;
                const yOffset = (y - 0.5) * speed;
                blob.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            });
        });