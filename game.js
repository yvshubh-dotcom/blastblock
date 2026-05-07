class BlockSet {
    constructor() {
        this.gridSize = 8;
        this.board = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(0));
        this.score = 0;
        this.boardEl = document.getElementById('game-board');
        this.scoreEl = document.getElementById('score');
        this.init();
    }
    init() {
        this.renderBoard();
        this.spawnBlocks();
        this.boardEl.addEventListener('dragover', e => e.preventDefault());
        this.boardEl.addEventListener('drop', e => this.handleDrop(e));
    }
    renderBoard() {
        this.boardEl.innerHTML = '';
        for(let r=0; r<this.gridSize; r++) {
            for(let c=0; c<this.gridSize; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell' + (this.board[r][c] ? ' filled' : '');
                cell.dataset.r = r; cell.dataset.c = c;
                this.boardEl.appendChild(cell);
            }
        }
    }
    spawnBlocks() {
        const shapes = [
            [[1,1],[1,1]], [[1,1,1]], [[1],[1],[1]], [[1,0],[1,1]], [[1,1,1],[0,1,0]]
        ];
        const container = document.getElementById('block-container');
        container.innerHTML = '';
        for(let i=0; i<3; i++) {
            const shape = shapes[Math.floor(Math.random()*shapes.length)];
            const el = this.createBlockUI(shape);
            container.appendChild(el);
        }
    }
    createBlockUI(shape) {
        const wrapper = document.createElement('div');
        wrapper.className = 'draggable-block';
        wrapper.draggable = true;
        wrapper.dataset.shape = JSON.stringify(shape);
        shape.forEach(row => {
            const rDiv = document.createElement('div');
            rDiv.className = 'block-row';
            row.forEach(c => {
                const cDiv = document.createElement('div');
                cDiv.className = 'block-cell' + (c ? ' active' : '');
                rDiv.appendChild(cDiv);
            });
            wrapper.appendChild(rDiv);
        });
        wrapper.ondragstart = (e) => {
            e.dataTransfer.setData('shape', JSON.stringify(shape));
            wrapper.classList.add('dragging');
        };
        return wrapper;
    }
    handleDrop(e) {
        e.preventDefault();
        const shape = JSON.parse(e.dataTransfer.getData('shape'));
        const cell = e.target.closest('.cell');
        if(!cell) return;
        const r = parseInt(cell.dataset.r), c = parseInt(cell.dataset.c);
        if(this.canPlace(shape, r, c)) {
            this.place(shape, r, c);
            this.clearLines();
            document.querySelector('.dragging').remove();
            if(!document.getElementById('block-container').children.length) this.spawnBlocks();
        }
    }
    canPlace(shape, r, c) {
        return shape.every((row, ri) => row.every((val, ci) => {
            if(!val) return true;
            const nr = r + ri, nc = c + ci;
            return nr < this.gridSize && nc < this.gridSize && !this.board[nr][nc];
        }));
    }
    place(shape, r, c) {
        shape.forEach((row, ri) => row.forEach((val, ci) => {
            if(val) this.board[r+ri][c+ci] = 1;
        }));
        this.renderBoard();
        this.score += 10;
        this.scoreEl.innerText = this.score;
    }
    clearLines() {
        let rows = [], cols = [];
        for(let i=0; i<8; i++) {
            if(this.board[i].every(v => v)) rows.push(i);
            if(this.board.every(r => r[i])) cols.push(i);
        }
        rows.forEach(r => this.board[r] = Array(8).fill(0));
        cols.forEach(c => this.board.forEach(r => r[c] = 0));
        if(rows.length || cols.length) {
            this.score += (rows.length + cols.length) * 100;
            this.scoreEl.innerText = this.score;
            this.renderBoard();
        }
    }
}
new BlockSet();