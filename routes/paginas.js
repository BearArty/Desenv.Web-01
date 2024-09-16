const express = require('express');
const fs = require('fs');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware.js');
const path = require('path');
const multer = require('multer');
const DATA_PATH = './data/dados.json';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        // Renomeando o arquivo de imagem ( imagem.jpg => 1749373949.jpg)
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

const lerDados = () => {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
}

const escreverDados = (data) => {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

/* Rotas para acessar as páginas através de autenticação */
router.get('/admin', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'admin.html'));
});

router.get('/listar', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'listar.html'));
});

router.get('/cadastrar', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'cadastrar.html'));
});


/* Rota para acessar dados do JSON produtos / index */
router.get('/', (req, res) => {
    const data = lerDados();
    res.json(data);
});

router.post('/', upload.single('img_receita'), (req, res) => {
    const data = lerDados();

    const novoDado = {
        id: Date.now(),
            nome: req.body.nome,
            porcoes: Number(req.body.porcoes),
            tempo: req.body.tempo,
            descricao: req.body.descricao,
            img_receita: req.file ? `/uploads/${req.file.filename}` : null,
            curtidas: req.body.curtidas
        };
    data.push(novoDado);
    escreverDados(data);
    res.json(novoDado);
});

router.put('/:id', upload.single('img_receita'), (req, res) => {
    const data = lerDados();
    const id_edit = Number(req.params.id);
    const index = data.findIndex(receita => receita.id === id_edit);

    if (index !== -1) {
        const receita_edit = data[index];

        receita_edit.nome = req.body.nome || receita_edit.nome;
        receita_edit.porcoes = Number(req.body.porcoes) || receita_edit.porcoes;
        receita_edit.tempo = req.body.tempo || receita_edit.tempo;
        receita_edit.descricao = req.body.descricao || receita_edit.descricao;
        
        // Substituir a imagem se uma nova for enviada
        if (req.file) {
            // Excluir a imagem antiga, se houver
            if (receita_edit.img_receita) {
                const img_antiga = path.join(__dirname, '..', receita_edit.img_receita);
                fs.unlink(img_antiga, (erro) => {
                    if (erro) {
                        console.error("Erro ao tentar excluir a imagem antiga!", erro);
                    } else {
                        console.log("Imagem antiga excluída com sucesso!", img_antiga);
                    }
                });
            } 
            // Atualizar o caminho da nova imagem
            receita_edit.img_receita = `/uploads/${req.file.filename}`;
        } 
        // Atualiza o produto no Json
        data[index] = receita_edit;
        escreverDados(data);
        res.json(receita_edit);
    } else {
        res.status(404).send({message: 'Erro ao tentar atualizar a receita!'});
    }

});

router.delete('/:id', (req, res) => {
    const data = lerDados();
    const id_del = Number(req.params.id);
    const filtro = data.filter(receita => receita.id !== id_del);
    const idx = data.findIndex(receita => receita.id === id_del);
    
    if (data.length !== filtro.length) {

        const img_del = data[idx];

        // Se tiver uma imagem associada ela será excluída
        if (img_del.img_receita) {
            const imagePath = path.join(__dirname, '..', img_del.img_receita);
            fs.unlink(imagePath, (erro) => {
                if (erro) {
                    console.error("Erro ao tentar excluir a imagem antiga!", erro);
                } else {
                    console.log("Imagem antiga excluída com sucesso!", imagePath);
                }
            });
        } 

        escreverDados(filtro);
        res.json({message: 'Receita Excluída com Sucesso!'});
    } else {
        res.status(404).send({message: 'Erro ao tentar excluir a receita!'});
    }
});

module.exports = router;