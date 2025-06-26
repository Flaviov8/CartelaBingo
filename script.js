document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate');
    const downloadBtn = document.getElementById('download');
    const cardsContainer = document.getElementById('cards-container');
    const quantityInput = document.getElementById('quantity');
    
    let generatedCards = [];
    
    generateBtn.addEventListener('click', generateCards);
    downloadBtn.addEventListener('click', downloadPDF);
    
    function generateCards() {
        const quantity = parseInt(quantityInput.value);
        
        if (isNaN(quantity) || quantity < 1 || quantity > 100) {
            alert('Por favor, insira um número entre 1 e 100');
            return;
        }
        
        cardsContainer.innerHTML = '';
        generatedCards = [];
        
        for (let i = 0; i < quantity; i++) {
            const card = createBingoCard(i + 1);
            cardsContainer.appendChild(card);
            generatedCards.push(card.outerHTML);
        }
    }
    
    function createBingoCard(id) {
        const card = document.createElement('div');
        card.className = 'bingo-card';
        
        // Cabeçalho
        const header = document.createElement('div');
        header.className = 'bingo-header';
        header.textContent = 'BINGO';
        card.appendChild(header);
        
        // Criação das colunas (B, I, N, G, O)
        const grid = document.createElement('div');
        grid.className = 'bingo-grid';
        
        // Gera números para a cartela (5 números de cada faixa)
        const cardNumbers = generateCardNumbers();
        
        // Preenche a cartela
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const cell = document.createElement('div');
                cell.className = 'bingo-cell';
                
                // Célula central é FREE
                if (col === 2 && row === 2) {
                    cell.textContent = 'FREE';
                    cell.classList.add('free');
                } else {
                    cell.textContent = cardNumbers[col][row];
                }
                
                grid.appendChild(cell);
            }
        }
        
        card.appendChild(grid);
        
        // ID da cartela
        const cardId = document.createElement('div');
        cardId.className = 'bingo-id';
        cardId.textContent = `Cartela #${id}`;
        card.appendChild(cardId);
        
        return card;
    }
    
    function generateCardNumbers() {
        // Define os intervalos para cada coluna
        const ranges = [
            { min: 1, max: 15 },   // B
            { min: 16, max: 30 },  // I
            { min: 31, max: 45 },  // N
            { min: 46, max: 60 },  // G
            { min: 61, max: 75 }   // O
        ];
        
        const columns = [[], [], [], [], []];
        const usedNumbers = new Set();
        
        // Preenche cada coluna com 5 números únicos
        for (let col = 0; col < 5; col++) {
            const { min, max } = ranges[col];
            
            while (columns[col].length < 5) {
                const num = Math.floor(Math.random() * (max - min + 1)) + min;
                
                // Garante que o número não se repita na cartela
                if (!usedNumbers.has(num)) {
                    columns[col].push(num);
                    usedNumbers.add(num);
                }
            }
            
            // Ordena a coluna
            columns[col].sort((a, b) => a - b);
        }
        
        return columns;
    }
    
    function downloadPDF() {
        if (generatedCards.length === 0) {
            alert('Gere pelo menos uma cartela antes de baixar o PDF');
            return;
        }
        
        const element = document.createElement('div');
        element.className = 'pdf-container';
        
        // Adiciona todas as cartelas ao elemento
        generatedCards.forEach(cardHtml => {
            element.innerHTML += cardHtml;
        });
        
        // Configurações do PDF
        const opt = {
            margin: 10,
            filename: 'cartelas_bingo.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        // Gera o PDF
        html2pdf().from(element).set(opt).save();
    }
});