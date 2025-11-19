document.addEventListener('DOMContentLoaded', () => {
    
    const apiUrl = 'api.php';

    const recadoForm = document.getElementById('recadoForm');
    const muralRecados = document.getElementById('muralRecados');
    const recadoIdInput = document.getElementById('recadoId');
    const mensagemInput = document.getElementById('mensagem');
    const btnCancelar = document.getElementById('btnCancelar');
    const btnSalvar = document.getElementById('btnSalvar');
    const loadingDiv = document.getElementById('loading');
    const btnToggleTema = document.getElementById('btnToggleTema');

    function setFormLoading(isLoading) {
        btnSalvar.disabled = isLoading;
        btnCancelar.disabled = isLoading;
        mensagemInput.disabled = isLoading;

        if (isLoading) {
            btnSalvar.innerHTML = '<i class="ph-fill ph-spinner"></i> Salvando...';
        } else {
            btnSalvar.innerHTML = '<i class="ph-fill ph-check"></i> Salvar';
        }
    }

    function setMuralLoading(isLoading) {
        if (isLoading) {
            muralRecados.classList.add('hidden');
            loadingDiv.classList.remove('hidden');
        } else {
            muralRecados.classList.remove('hidden');
            loadingDiv.classList.add('hidden');
        }
    }

    function aplicarTema(tema) {
        document.documentElement.setAttribute('data-theme', tema);
        localStorage.setItem('tema', tema);
    }

    btnToggleTema.addEventListener('click', () => {
        const temaAtual = localStorage.getItem('tema') || 'light';
        const novoTema = temaAtual === 'light' ? 'dark' : 'light';
        aplicarTema(novoTema);
    });

    const temaSalvo = localStorage.getItem('tema') || 'light';
    aplicarTema(temaSalvo);

    async function carregarRecados() {
        setMuralLoading(true);
        try {
            const response = await fetch(`${apiUrl}?action=readAll`);
            if (!response.ok) {
                throw new Error('Erro ao buscar recados');
            }
            const recados = await response.json();
            renderRecados(recados);
        } catch (error) {
            console.error(error);
            muralRecados.innerHTML = '<p>Erro ao carregar recados.</p>';
        } finally {
            setMuralLoading(false);
        }
    }

    function renderRecados(recados) {
        muralRecados.innerHTML = ''; 

        if (recados.length === 0) {
            muralRecados.innerHTML = '<p>Nenhum recado no mural ainda.</p>';
            return;
        }

        recados.forEach(recado => {
            const recadoDiv = document.createElement('div');
            recadoDiv.className = `recado ${recado.status == 1 ? 'favorito' : ''}`;
            recadoDiv.setAttribute('data-id', recado.id);
            recadoDiv.setAttribute('data-status', recado.status);
            recadoDiv.setAttribute('draggable', 'true');

            const data = new Date(recado.data_criacao);
            const dataFormatada = data.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            recadoDiv.innerHTML = `
                <p class="recado-mensagem">${recado.mensagem}</p>
                <p class="recado-data">Postado em: ${dataFormatada}</p>
                <div class="recado-botoes">
                    <button class="btn-acao btn-favoritar ${recado.status == 1 ? 'favorito' : ''}" 
                            title="Favoritar">
                        <i class="ph-fill ph-star"></i>
                    </button>
                    <div>
                        <button class="btn-acao btn-editar" title="Editar">
                            <i class="ph-fill ph-pencil-simple"></i>
                        </button>
                        <button class="btn-acao btn-deletar" title="Deletar">
                            <i class="ph-fill ph-trash-simple"></i>
                        </button>
                    </div>
                </div>
            `;
            muralRecados.appendChild(recadoDiv);
        });
        
        adicionarDragAndDrop();
    }

    async function handleFormSubmit(event) {
        event.preventDefault(); 
        setFormLoading(true);

        const id = recadoIdInput.value;
        const mensagem = mensagemInput.value;

        const dados = { mensagem };
        let action = 'create';
        
        if (id) {
            dados.id = id;
            action = 'update';
        }

        try {
            const response = await fetch(`${apiUrl}?action=${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados),
            });

            await response.json();
            
            resetForm();
            carregarRecados(); 

        } catch (error) {
            console.error(error);
            alert('Erro ao salvar recado.');
        } finally {
            setFormLoading(false);
        }
    }

    async function handleEditClick(event) {
        const btn = event.target.closest('.btn-editar');
        if (!btn) return;

        const recadoDiv = btn.closest('.recado');
        const id = recadoDiv.dataset.id;
        
        try {
            const response = await fetch(`${apiUrl}?action=readOne&id=${id}`);
            const recado = await response.json();

            recadoIdInput.value = recado.id;
            mensagemInput.value = recado.mensagem;

            btnCancelar.classList.remove('hidden');
            window.scrollTo(0, 0);
            mensagemInput.focus();

        } catch (error) {
            console.error(error);
        }
    }

    async function handleDeleteClick(event) {
        const btn = event.target.closest('.btn-deletar');
        if (!btn) return;

        const recadoDiv = btn.closest('.recado');
        const id = recadoDiv.dataset.id;
        
        if (!confirm('Tem certeza que deseja apagar este recado?')) {
            return;
        }

        try {
            const response = await fetch(`${apiUrl}?action=delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id }),
            });

            await response.json();
            carregarRecados();

        } catch (error) {
            console.error(error);
            alert('Erro ao deletar recado.');
        }
    }

    async function handleFavoritarClick(event) {
        const btn = event.target.closest('.btn-favoritar');
        if (!btn) return;

        const recadoDiv = btn.closest('.recado');
        const id = recadoDiv.dataset.id;
        const statusAtual = recadoDiv.dataset.status;

      
        
        try {
            const response = await fetch(`${apiUrl}?action=favoritar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id, statusAtual: statusAtual }),
            });

            await response.json();
            carregarRecados(); 

        } catch (error) {
            console.error(error);
        }
    }

    function resetForm() {
        recadoForm.reset();
        recadoIdInput.value = ''; 
        btnCancelar.classList.add('hidden'); 
    }

 
    let recadoArrastado = null;

    function adicionarDragAndDrop() {
        const recados = muralRecados.querySelectorAll('.recado');
        recados.forEach(recado => {
            recado.addEventListener('dragstart', handleDragStart);
            recado.addEventListener('dragover', handleDragOver);
            recado.addEventListener('dragleave', handleDragLeave);
            recado.addEventListener('drop', handleDrop);
            recado.addEventListener('dragend', handleDragEnd);
        });
    }

    function handleDragStart(e) {
        recadoArrastado = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
        this.classList.add('arrastando');
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (this !== recadoArrastado) {
            this.classList.add('drag-over');
        }
    }

    function handleDragLeave() {
        this.classList.remove('drag-over');
    }

    function handleDrop(e) {
        e.stopPropagation();
        this.classList.remove('drag-over');

        if (recadoArrastado !== this) {
            const todosRecados = Array.from(muralRecados.querySelectorAll('.recado'));
            const indexArrastado = todosRecados.indexOf(recadoArrastado);
            const indexAlvo = todosRecados.indexOf(this);

            if (indexArrastado > indexAlvo) {
                muralRecados.insertBefore(recadoArrastado, this);
            } else {
                muralRecados.insertBefore(recadoArrastado, this.nextSibling);
            }
            
        
        }
    }

    function handleDragEnd() {
        this.classList.remove('arrastando');
        const recados = muralRecados.querySelectorAll('.recado');
        recados.forEach(recado => recado.classList.remove('drag-over'));
        recadoArrastado = null;
    }

    carregarRecados();

    recadoForm.addEventListener('submit', handleFormSubmit);
    btnCancelar.addEventListener('click', resetForm);

    muralRecados.addEventListener('click', (event) => {
        handleEditClick(event);
        handleDeleteClick(event);
        handleFavoritarClick(event);
    });

});
