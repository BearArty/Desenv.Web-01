const form_edit = document.getElementById('editar_receita');
const url = new URLSearchParams(window.location.search);
const id_url = url.get('id');

let id = document.getElementById('id_edit');
let nome = document.getElementById('nome');
let porcoes = document.getElementById('porcoes');
let tempo = document.getElementById('tempo');
let descricao = document.getElementById('descricao');
let img_receita = document.getElementById('img_receita');

document.addEventListener('DOMContentLoaded', async () => {  

    const response = await fetch('api/paginas');
    const receitas = await response.json();
    const receita = receitas.find(receita => receita.id == id_url);

    if (receita) {
        id.value = receita.id;
        nome.value = receita.nome;
        porcoes.value = receita.porcoes
        tempo.value = receita.tempo;
        descricao.value = receita.descricao; 
    } else {
        alert("Receita não encontrada!");
        window.location.href = '/listar';
    }

});

form_edit.addEventListener('submit', async (e) => {

    e.preventDefault();

    const att_dados = new FormData();

    att_dados.append('nome', nome.value);
    att_dados.append('porcoes', porcoes.value);
    att_dados.append('tempo', tempo.value);
    att_dados.append('descricao', descricao.value);
    
    // Caso seja adicionado uma nova imagem
    if (img_receita.files.length > 0) {
        att_dados.append('img_receita', img_receita.files[0]);
    }

    await fetch(`/api/paginas/${id.value}`, {
        method: 'PUT',
        body: att_dados,
    });

    alert("Produto alterado com sucesso!!");
    window.location.href = '/listar';

});