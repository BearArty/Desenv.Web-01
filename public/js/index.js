const listarPtable = document.getElementById("listarReceitas");
const searchInput = document.getElementById("searchInput");

let receitas = [];  // Armazena todas as receitas carregadas

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/paginas');
    receitas = await response.json();  // Salva todas as receitas no array global
    listarReceitas(receitas);
});

function filtrarReceitas() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredReceitas = receitas.filter(receita =>
        receita.nome.toLowerCase().includes(searchTerm) ||
        receita.descricao.toLowerCase().includes(searchTerm)
    );
    listarReceitas(filteredReceitas);
}

function atualizarContadorCurtidas(index) {
    receitas[index].curtidas++;
    listarReceitas(receitas);
}

const listarReceitas = (receitas) => {
    listarPtable.innerHTML = '';

    receitas.forEach((receita, index) => {
        let col = document.createElement('div');
        col.classList.add('col');

        let card = document.createElement('div');
        card.classList.add('card', 'border-secondary');
        card.style.width = '16rem'; 
        card.style.height = '30rem'; 
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.justifyContent = 'space-between';
        col.appendChild(card);

        let img = document.createElement('img');
        img.src = receita.img_receita; 
        img.classList.add('card-img-top', 'img-fluid', 'img-thumbnail');
        img.alt = receita.nome;
        img.style.maxHeight = '12rem'; 
        img.style.objectFit = 'cover'; 
        card.appendChild(img);

        let cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'text-secondary');
        cardBody.style.display = 'flex';
        cardBody.style.flexDirection = 'column';
        cardBody.style.flex = '1';
        cardBody.style.overflowY = 'auto'; // Adiciona rolagem vertical
        cardBody.style.overflowX = 'hidden'; // Evita rolagem horizontal

        card.appendChild(cardBody);

        let h5 = document.createElement('h5');
        h5.classList.add('card-title');
        h5.textContent = receita.nome;
        cardBody.appendChild(h5);

        let porcoes = document.createElement('p');
        porcoes.classList.add('card-text');
        porcoes.innerHTML = `<strong>Porções:</strong> ${receita.porcoes}`;
        cardBody.appendChild(porcoes);

        let tempo = document.createElement('p');
        tempo.classList.add('card-text');
        tempo.innerHTML = `<strong>Tempo de receita:</strong> ${receita.tempo}`;
        cardBody.appendChild(tempo);

        let descricao = document.createElement('p');
        descricao.classList.add('card-text');
        descricao.innerHTML = `<strong>Descrição:</strong> ${receita.descricao}`;
        cardBody.appendChild(descricao);

        let divButtonGroup = document.createElement('div');
        divButtonGroup.classList.add('button-group');
        divButtonGroup.style.marginTop = 'auto'; // Empurra o grupo de botões para baixo
        cardBody.appendChild(divButtonGroup);

        let btnCurtir = document.createElement('a');
        btnCurtir.classList.add('btn', "botaoCurtir", 'btn-primary', 'me-3');
        btnCurtir.href = '#';
        btnCurtir.textContent = 'CURTIR';
        btnCurtir.onclick = (e) => {
            e.preventDefault();
            atualizarContadorCurtidas(index);
        };
        divButtonGroup.appendChild(btnCurtir);

        if (receita.curtidas == null) {
            receita.curtidas = 0;
        }

        let curtidas = document.createElement('p');
        curtidas.classList.add('card-text');
        curtidas.innerHTML = `<strong>Curtidas:</strong> ${receita.curtidas}`;
        cardBody.appendChild(curtidas);

        listarPtable.appendChild(col);
    });
};



const delReceita = async (id) => {
    await fetch(`/api/paginas/${id}`, {
        method: 'DELETE',
    });
    
    alert("Receita Excluída com Sucesso!");
    window.location.href = 'listar.html';
};

document.addEventListener('click', (e) => {
    let result = e.target.classList.contains('btn-danger');
    if (result) {
        const id_ex = e.target.getAttribute('data-id');
        const nome_ex = e.target.getAttribute('data-name');
        let ok = confirm(`Tem certeza que deseja excluir esta receita: ${nome_ex}?`);
        if (ok) {
            delReceita(id_ex);
        } else {
            window.location.href = 'listar.html';
        }
    } 
});