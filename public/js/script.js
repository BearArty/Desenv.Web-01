const listarPTable = document.getElementById('listarReceitas');

document.addEventListener('DOMContentLoaded', async () => {

    const response = await fetch('/api/paginas/');
    const receitas = await response.json();
    listarReceitas(receitas); 

});

const listarReceitas = (receitas) => {

    listarPTable.innerHTML = '';
    receitas.forEach(receita => {
        const tr = document.createElement('tr');

        const td_id = document.createElement('td');
        td_id.textContent = receita.id;
        tr.appendChild(td_id);

        const td_nome = document.createElement('td');
        td_nome.textContent = receita.nome;
        tr.appendChild(td_nome);

        const td_porcoes = document.createElement('td');
        td_porcoes.textContent = receita.porcoes;
        tr.appendChild(td_porcoes);

        const td_tempo = document.createElement('td');
        td_tempo.textContent = receita.tempo;
        tr.appendChild(td_tempo);

        const td_descricao = document.createElement('td');
        td_descricao.textContent = receita.descricao;
        tr.appendChild(td_descricao);

        const td_img = document.createElement('td');
        if (receita.img_receita) {
            const img = document.createElement('img');
            img.src = receita.img_receita;
            img.alt = receita.nome;
            img.width = 100; // Definindo o tamanho da imagem
            td_img.appendChild(img);
        }
        tr.appendChild(td_img);

        const td_acao = document.createElement('td');
        let btnEditar = document.createElement('a');
        btnEditar.classList.add('btn', "botaoEdit", 'btn-warning', 'me-3');
        btnEditar.href = `editar.html?id=${receita.id}`;
        btnEditar.textContent = 'EDITAR';
        td_acao.appendChild(btnEditar);

        let btnExcluir = document.createElement('button');
        btnExcluir.classList.add('btn', "botaoExc", 'btn-danger', 'me-3');
        btnExcluir.textContent = 'EXCLUIR';
        btnExcluir.dataset.id = receita.id;
        btnExcluir.dataset.name = receita.nome;
        td_acao.appendChild(btnExcluir);
        td_acao.classList.add('text-center');

        tr.appendChild(td_acao);

        listarPTable.appendChild(tr);

    });

};

const delReceita = async (id) => {
    await fetch(`/api/paginas/${id}`, {
        method: 'DELETE',
    });

    alert("Receita excluída com Sucesso!!");

    window.location.href = '/listar';

};

document.addEventListener('click', (e) => {
    let result = e.target.classList.contains('btn-danger');
    if (result) {
       const id_ex = e.target.getAttribute('data-id');
       const nome_ex = e.target.getAttribute('data-name');
       let ok = confirm(`Tem certeza que deseja excluir a receita: ${nome_ex}?`);
       if (ok) {
        delReceita(id_ex);
       } else {
        exibirReceitas();
       }      
    }
    
});