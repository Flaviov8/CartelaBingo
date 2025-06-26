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
        const columns = ['B', 'I', 'N', 'G', 'O'];
        const grid = document.createElement('div');
        grid.className = 'bingo-grid';
        
        // Gera números para cada coluna
        const allNumbers = generateBingoNumbers();
        
        for (let col = 0; col < 5; col++) {
            for (let row = 0; row < 5; row++) {
                const cell = document.createElement('div');
                cell.className = 'bingo-cell';
                
                // Célula central é FREE
                if (col === 2 && row === 2) {
                    cell.textContent = 'FREE';
                    cell.classList.add('free');
                } else {
                    const numbers = allNumbers[col];
                    cell.textContent = numbers[row];
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
    
    function generateBingoNumbers() {
        const columns = [
            { letter: 'B', min: 1, max: 15 },
            { letter: 'I', min: 16, max: 30 },
            { letter: 'N', min: 31, max: 45 },
            { letter: 'G', min: 46, max: 60 },
            { letter: 'O', min: 61, max: 75 }
        ];
        
        const allNumbers = [];
        
        for (const col of columns) {
            const numbers = [];
            
            // Gera 5 números únicos para a coluna
            while (numbers.length < 5) {
                const num = Math.floor(Math.random() * (col.max - col.min + 1)) + col.min;
                if (!numbers.includes(num)) {
                    numbers.push(num);
                }
            }
            
            // Ordena os números
            numbers.sort((a, b) => a - b);
            allNumbers.push(numbers);
        }
        
        return allNumbers;
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
