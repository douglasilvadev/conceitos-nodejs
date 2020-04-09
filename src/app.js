/* eslint arrow-parens: ["error", "as-needed"] */

const express = require('express');
const cors = require('cors');

const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositorytId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: 'Invalid repository ID.' });
  }
  return next();
}

app.use('/repositories/:id', validateRepositorytId);

app.get('/repositories', (req, res) => res.json(repositories));

app.post('/repositories', (req, res) => {
  const { title, url, techs } = req.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return res.json(repository);
});

app.put('/repositories/:id', (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  const alteredRepository = repositories.findIndex(repository => repository.id === id);

  if (alteredRepository === -1) {
    return res.status(400).json({ error: 'Repository not found' });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[alteredRepository].likes,
  };

  repositories[alteredRepository] = repository;

  return res.json(repository);
});

app.delete('/repositories/:id', (req, res) => {
  const { id } = req.params;

  const deletedRepository = repositories.findIndex(repository => repository.id === id);

  if (deletedRepository < 0) {
    return res.status(400).json({ error: 'Repository not found' });
  }

  repositories.splice(deletedRepository, 1);

  return res.status(204).send();
});

app.post('/repositories/:id/like', (req, res) => {
  const { id } = req.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return res.status(400).send();
  }

  repository.likes += 1;

  return res.json(repository);
});

module.exports = app;
