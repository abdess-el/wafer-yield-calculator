   
        // DOM Elements DOM
        const defectSlider = document.getElementById('defectDensity');
        const defectValue = document.getElementById('defectValue');
        const areaSlider = document.getElementById('dieArea');
        const areaValue = document.getElementById('areaValue');
        const yieldResult = document.getElementById('yieldResult');
        const goodDiesSpan = document.getElementById('goodDies');
        const badDiesSpan = document.getElementById('badDies');
        const canvas = document.getElementById('waferCanvas');

        // Constants 
        const TOTAL_DIES = 100;  // Total number of dies on the wafer

        /**
         * Calculate yield using Murphy's model
         * Formula: Yield = (1 - e^(-D × A)) / (D × A)
         * @param {number} defectDensity - Defects per cm² (D)
         * @param {number} dieArea - Die area in mm² (A)
         * @returns {number} Yield value between 0 and 1
         */
        function calculateYield(defectDensity, dieArea) {
            // Convert die area from mm² to cm² (1 cm² = 100 mm²)
            const dieAreaCm2 = dieArea / 100;
            
            // Calculate D × A (defect density × area in cm²)
            const DA = defectDensity * dieAreaCm2;
            
            // Avoid division by zero
            if (DA === 0) return 1.0;
            
            // Murphy's Model: Yield = (1 - e^(-D×A)) / (D×A)
            const yieldValue = (1 - Math.exp(-DA)) / DA;
            
            // Clamp between 0 and 1, round to 4 decimal places
            return Math.min(1.0, Math.max(0, yieldValue));
        }

    
        function drawWafer(defectDensity, dieArea) {
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = width / 2 - 5;
            
            // Clear previous drawing
            ctx.clearRect(0, 0, width, height);
            
            // Draw wafer background (gray circle)
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fillStyle = '#e0e0e0';
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Calculate number of defects to draw
            // Higher defect density = more red dots
            // Scale: 0 defects/cm² = 0 dots, 2 defects/cm² = ~30 dots
            const defectCount = Math.min(40, Math.floor(defectDensity * 15));
            
            // Draw defects as red dots at random positions within the circle
            for (let i = 0; i < defectCount; i++) {
                // Generate random coordinates within the circle
                const angle = Math.random() * 2 * Math.PI;
                const r = Math.sqrt(Math.random()) * (radius - 5);
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                
                ctx.beginPath();
                ctx.arc(x, y, 2.5, 0, 2 * Math.PI);
                ctx.fillStyle = '#ff0000';
                ctx.fill();
            }
        }

        /**
         * Update all results and visualizations when sliders move
         */
        function updateResults() {
            // Read current values from sliders
            const defectDensity = parseFloat(defectSlider.value);
            const dieArea = parseFloat(areaSlider.value);
            
            // Update displayed values
            defectValue.textContent = defectDensity.toFixed(2);
            areaValue.textContent = dieArea.toFixed(1);
            
            // Calculate yield
            const yieldValue = calculateYield(defectDensity, dieArea);
            const yieldPercentage = (yieldValue * 100).toFixed(2);
            
            // Display yield percentage
            yieldResult.textContent = `${yieldPercentage}%`;
            
            // Calculate good and bad dies (out of 100 total dies)
            const goodDies = Math.floor(TOTAL_DIES * yieldValue);
            const badDies = TOTAL_DIES - goodDies;
            
            goodDiesSpan.textContent = goodDies;
            badDiesSpan.textContent = badDies;
            
            // Update wafer visualization
            drawWafer(defectDensity, dieArea);
        }

        // Add event listeners to sliders amd
        defectSlider.addEventListener('input', updateResults);
        areaSlider.addEventListener('input', updateResults);

        // Initialize the calculator when page loads
        updateResults();

        // Console output for developers
        console.log('Wafer Yield Calculator - Ready!');
        console.log('Murphy\'s Model: Yield = (1 - e^(-D×A)) / (D×A)');
 