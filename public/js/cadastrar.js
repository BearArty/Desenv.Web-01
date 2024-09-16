const cadastro = document.getElementById('cadastro');

let nome = document.getElementById('nome');
let porcoes = document.getElementById('porcoes');
let tempo = document.getElementById('tempo');
let descricao = document.getElementById('descricao');
let img_receita = document.getElementById('img_receita');
let curtidas = document.getElementById("curtidas");

cadastro.addEventListener('submit', async (e) => {

    e.preventDefault();

    const carregarDados = new FormData();
    carregarDados.append('nome', nome.value);
    carregarDados.append('porcoes', porcoes.value);
    carregarDados.append('tempo', tempo.value);
    carregarDados.append('descricao', descricao.value);
    carregarDados.append('img_receita', img_receita.files[0]);
    carregarDados.append('curtidas', curtidas);

    await fetch('/api/paginas', {
        method: 'POST',
        body: carregarDados,
    });

    window.location.href = '/admin';

});
