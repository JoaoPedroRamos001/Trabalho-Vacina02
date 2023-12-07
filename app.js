const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3055;

app.use(bodyParser.urlencoded({ extended: false }));

const db = new sqlite3.Database('database.db');


db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS formularios (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, cidade TEXT, telefone TEXT, mensagem TEXT)");
});

app.use(express.static(__dirname));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


app.post('/submit', (req, res) => {
  const { nome, email, cidade, telefone, mensagem  } = req.body;

 
  console.log(`Nome: ${nome}, Email: ${email}, Cidade: ${cidade}, Telefone: ${telefone}, Mensagem: ${mensagem},`);

 
  const stmt = db.prepare("INSERT INTO formularios (nome, email, mensagem, cidade, telefone) VALUES (?, ?, ?, ?, ?)");
  stmt.run(nome, email, cidade, telefone,  mensagem,);
  stmt.finalize();

 
  res.redirect('/confirmacao');
});


app.get('/confirmacao', (req, res) => {
  res.sendFile(__dirname + '/confirmacao.html');
});


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});