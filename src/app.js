const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()

// configura o EJS como view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Dados temporários para armazenar mensagens
let mensagensA = [];
let mensagensB = [];

app.get('/', (req, res) => {
    res.render('index', {mensagensA, mensagensB})
})

app.post('/addMessage', (req, res) => {
    const { texto, destino } = req.body;

    if (!texto.trim()) return res.redirect('/');

    if (destino === 'A') {
        mensagensA.push(texto);
    } else if (destino === 'B') {
        mensagensB.push(texto);
    }

    res.redirect('/');
})

app.post('/moveMessage', (req, res) => {
    const { texto, origem, destino } = req.body;

    if (origem === 'A') {
        mensagensA = mensagensA.filter(msg => msg !== texto);
        mensagensB.push(texto);
    } else if (origem === 'B') {
        mensagensB = mensagensB.filter(msg => msg !== texto);
        mensagensA.push(texto);
    }

    res.redirect('/');
});

// Rota para editar uma mensagem
app.post('/editMessage', (req, res) => {
    const { oldText, newText, origem } = req.body;

    if (origem === 'A') {
        mensagensA = mensagensA.map(msg => (msg === oldText ? newText : msg));
    } else if (origem === 'B') {
        mensagensB = mensagensB.map(msg => (msg === oldText ? newText : msg));
    }

    res.redirect('/');
});

// Rota para deletar uma mensagem
app.post('/deleteMessage', (req, res) => {
    const { texto, origem } = req.body;

    if (origem === 'A') {
        mensagensA = mensagensA.filter(msg => msg !== texto);
    } else if (origem === 'B') {
        mensagensB = mensagensB.filter(msg => msg !== texto);
    }

    res.redirect('/');
});

app.listen(3000, ()=>{
    console.log("Rodando na porta 3000")
})