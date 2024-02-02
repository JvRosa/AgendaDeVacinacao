const express = require('express');
const connection = require('./database');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

function visualizarAgendamentos(req, res) {
  const usuarioId = req.params.usuarioId;

  const sqlUsuario = "SELECT * FROM Usuarios WHERE id = ?";
  connection.query(sqlUsuario, [usuarioId], (errUsuario, resultUsuario) => {
    if (errUsuario) {
      console.error('Erro ao obter informações do usuário:', errUsuario);
      res.status(500).send('Erro ao obter informações do usuário.');
      return;
    }

    const sqlAgendamentos = "SELECT A.*, V.nome AS vacina_nome FROM Agendas A INNER JOIN Vacinas V ON A.vacina_id = V.id WHERE usuario_id = ?";
    connection.query(sqlAgendamentos, [usuarioId], (errAgendamentos, resultAgendamentos) => {
      if (errAgendamentos) {
        console.error('Erro ao obter agendamentos do usuário:', errAgendamentos);
        res.status(500).send('Erro ao obter agendamentos do usuário.');
      } else {
        res.render('visualizarAgendamentos', { usuario: resultUsuario[0], agendamentos: resultAgendamentos });
      }
    });
  });
}

app.get('/visualizarAgendamentos/:usuarioId', visualizarAgendamentos);

app.get('/listarVacinas', (req, res) => {
  const sql = "SELECT * FROM Vacinas";
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.render('listarVacinas', { vacinas: result });
  });
});

app.get('/listarAlergias', (req, res) => {
  const sql = "SELECT * FROM Alergias";
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.render('listarAlergias', { alergias: result });
  });
});

app.get('/listarUsuarios', (req, res) => {
  const sql = "SELECT * FROM Usuarios";
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.render('listarUsuarios', { usuarios: result });
  });
});

app.get('/listarAgendas', (req, res) => {
  const sql = "SELECT * FROM Agendas";
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.render('listarAgendas', { agendas: result });
  });
});

app.get('/listarAgendas/:filtro?', (req, res) => {
  const filtro = req.params.filtro || 'todas';
  let sql;

  switch (filtro) {
    case 'canceladas':
      sql = "SELECT * FROM Agendas WHERE situacao = 'Cancelado'";
      break;
    case 'realizadas':
      sql = "SELECT * FROM Agendas WHERE situacao = 'Realizado'";
      break;
    default:
      sql = "SELECT * FROM Agendas";
  }

  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Erro ao obter agendas:', err);
      res.status(500).send('Erro ao obter agendas.');
    } else {
      res.render('listarAgendas', { agendas: result, filtro });
    }
  });
});

app.get('/listarAgendasDia', listarAgendasDia);

function listarAgendasDia(req, res) {
  const currentDate = new Date().toISOString().split('T')[0];
  const sql = 'SELECT * FROM Agendas WHERE DATE(data) = ? ORDER BY situacao DESC';

  connection.query(sql, [currentDate], (err, result) => {
    if (err) {
      console.error('Erro ao listar agendas do dia corrente:', err);
      res.status(500).send('Erro ao listar agendas do dia corrente.');
    } else {
      res.render('listarAgendas', { agendas: result });
    }
  });
}

app.post('/darBaixa/:id', darBaixaAgenda);

function darBaixaAgenda(req, res) {
  const agendaId = req.params.id;
  const acao = req.body.acao;
  const dataSituacao = new Date().toISOString().split('T')[0];

  const sql = 'UPDATE Agendas SET situacao = ?, data_situacao = ? WHERE id = ?';
  connection.query(sql, [acao, dataSituacao, agendaId], (err, result) => {
    if (err) {
      console.error('Erro ao dar baixa na agenda:', err);
      res.status(500).send('Erro ao dar baixa na agenda.');
    } else {
      res.redirect('/listarAgendas');
    }
  });
}

app.get('/incluirVacina', (req, res) => {
  res.render('incluirVacina');
});

app.get('/incluirAlergia', (req, res) => {
  res.render('incluirAlergia');
});

app.get('/incluirUsuario', (req, res) => {
  res.render('incluirUsuario');
});

app.get('/incluirAgenda', (req, res) => {
  res.render('incluirAgenda');
});

app.post('/incluirVacina', (req, res) => {
  const { nome, doses, periodicidade, intervalo } = req.body;
  const sql = 'INSERT INTO Vacinas (nome, doses, periodicidade, intervalo) VALUES (?, ?, ?, ?)';
  connection.query(sql, [nome, doses, periodicidade, intervalo], (err, result) => {
    if (err) {
      console.error('Erro ao adicionar vacina:', err);
      res.status(500).send('Erro ao adicionar vacina.');
    } else {
      res.redirect('/listarVacinas');
    }
  });
});

app.post('/incluirAlergia', (req, res) => {
  const { nome, descricao } = req.body;
  const sql = 'INSERT INTO Alergias (nome, descricao) VALUES (?, ?)';
  connection.query(sql, [nome, descricao], (err, result) => {
    if (err) {
      console.error('Erro ao adicionar alergia:', err);
      res.status(500).send('Erro ao adicionar alergia.');
    } else {
      res.redirect('/listarAlergias');
    }
  });
});

app.post('/incluirUsuario', (req, res) => {
  const { nome, sexo, uf } = req.body;
  const sql = 'INSERT INTO Usuarios (nome, sexo, uf) VALUES (?, ?, ?)';
  connection.query(sql, [nome, sexo, uf], (err, result) => {
    if (err) {
      console.error('Erro ao adicionar usuário:', err);
      res.status(500).send('Erro ao adicionar usuário.');
    } else {
      res.redirect('/listarUsuarios');
    }
  });
});

app.post('/incluirAgenda', (req, res) => {
  const { usuario_id, vacina_id, data, situacao, data_situacao } = req.body;
  const sql = 'INSERT INTO Agendas (usuario_id, vacina_id, data, situacao, data_situacao) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [usuario_id, vacina_id, data, situacao, data_situacao], (err, result) => {
    if (err) {
      console.error('Erro ao adicionar agenda:', err);
      res.status(500).send('Erro ao adicionar agenda.');
    } else {
      res.redirect('/listarAgendas');
    }
  });
});

app.get('/excluirVacina/:id', excluirVacina);

function excluirVacina(req, res) {
  const vacinaId = req.params.id;

  const sql = 'DELETE FROM Vacinas WHERE id = ?';
  connection.query(sql, [vacinaId], (err, result) => {
    if (err) {
      console.error('Erro ao excluir vacina:', err);
      res.status(500).send('Erro ao excluir vacina.');
    } else {
      res.redirect('/listarVacinas');
    }
  });
}

app.get('/excluirAlergia/:id', excluirAlergia);

function excluirAlergia(req, res) {
  const alergiaId = req.params.id;

  const removeReferenciasSQL = 'DELETE FROM usuarios_alergias WHERE alergia_id = ?';
  connection.query(removeReferenciasSQL, [alergiaId], (errRemoverReferencias) => {
    if (errRemoverReferencias) {
      console.error('Erro ao remover referências da alergia:', errRemoverReferencias);
      res.status(500).send('Erro ao remover referências da alergia.');
    } else {
      const excluirAlergiaSQL = 'DELETE FROM Alergias WHERE id = ?';
      connection.query(excluirAlergiaSQL, [alergiaId], (errExcluirAlergia) => {
        if (errExcluirAlergia) {
          console.error('Erro ao excluir alergia:', errExcluirAlergia);
          res.status(500).send('Erro ao excluir alergia.');
        } else {
          res.redirect('/listarAlergias');
        }
      });
    }
  });
}

app.get('/excluirUsuario/:id', excluirUsuario);

function excluirUsuario(req, res) {
  const usuarioId = req.params.id;

  const consultarAgendas = 'SELECT * FROM Agendas WHERE usuario_id = ?';
  connection.query(consultarAgendas, [usuarioId], (err, agendasResult) => {
    if (err) {
      console.error('Erro ao consultar agendas associadas ao usuário:', err);
      res.status(500).send('Erro ao excluir usuário.');
      return;
    }

    const excluirAgendas = 'DELETE FROM Agendas WHERE usuario_id = ?';
    connection.query(excluirAgendas, [usuarioId], (err) => {
      if (err) {
        console.error('Erro ao excluir agendas associadas ao usuário:', err);
        res.status(500).send('Erro ao excluir usuário.');
        return;
      }

      const excluirUsuario = 'DELETE FROM Usuarios WHERE id = ?';
      connection.query(excluirUsuario, [usuarioId], (err) => {
        if (err) {
          console.error('Erro ao excluir usuário:', err);
          res.status(500).send('Erro ao excluir usuário.');
        } else {
          res.redirect('/listarUsuarios');
        }
      });
    });
  });
}

app.get('/excluirAgenda/:id', excluirAgenda);

function excluirAgenda(req, res) {
  const agendaId = req.params.id;

  const sql = 'DELETE FROM Agendas WHERE id = ?';
  connection.query(sql, [agendaId], (err, result) => {
    if (err) {
      console.error('Erro ao excluir agenda:', err);
      res.status(500).send('Erro ao excluir agenda.');
    } else {
      res.redirect('/listarAgendas');
    }
  });
}

app.get('/editar/:id', editarCandidato);

function editarCandidato(req, res) {
  const candidatoId = req.params.id;
  const sql = "SELECT * FROM CANDIDATO WHERE codigo = ?";

  connection.query(sql, [candidatoId], (err, result) => {
    if (err) throw err;
    res.render('editar', { candidato: result[0] });
  });
}

app.post('/atualizar/:id', atualizarCandidato);

function atualizarCandidato(req, res) {
  const candidatoId = req.params.id;
  const { nome, sexo, data_nasc, cargo_pretendido, texto_curriculo } = req.body;

  const sql = 'UPDATE CANDIDATO SET nome = ?, sexo = ?, data_nasc = ?, cargo_pretendido = ?, texto_curriculo = ? WHERE codigo = ?';
  connection.query(sql, [nome, sexo, data_nasc, cargo_pretendido, texto_curriculo, candidatoId], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar candidato:', err);
      res.status(500).send('Erro ao atualizar candidato.');
    } else {
      res.redirect('/listar');
    }
  });
}

app.listen(port, async () => {
  try {
    await connection.connect();
    console.log('Database connected');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
});
