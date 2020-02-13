const express = require('express');
/**
 * Iniciação do servidor
 */
const server = express();

/**
 * Configuração do express para aceitar o campo body como JSON
 */

server.use(express.json());

/**
 * Variável onde vamos colocar os projetos
 */
const projects = [];

/**
 * Middleware global para poder mostrar no console a quantidade de requisições que foram feitas
 * @param {*} _req Corpo da requisição
 * @param {*} _res Resposta da requisição
 * @param {*} next Executar a próxima função
 */
function countLog(_req, _res, next) {
	// eslint-disable-next-line no-console
	console.count('Número de requisições');
	return next();
}
/**
 * Middleware de reaproveitamento de código, para validar se o projeto existe dentro da variável de projetos
 * @param {*} req Corpo da requisição
 * @param {*} res Resposta da requisição
 * @param {*} next Executar a próxima função
 */
function checkProjectExists(req, res, next) {
	const { id } = req.params;
	const projectExists = projects.find(p => p.id === id);
	// Verificação se o projeto existe
	if (!projectExists) {
		return res
			.status(400)
			.json({ error: 'Project with this ID does not exists.' });
	}
	return next();
}

/**
 * Habilitando o middleware de contagem de requisições
 */
server.use(countLog);

/**
 * Criar um projeto novo
 */
server.post('/projects', (req, res) => {
	const { id, title } = req.body;

	// Verifica se os campos existem
	if (!id || !title) {
		return res.status(400).json({
			error: 'Bad request: Not all fields are providden.',
		});
	}
	const projectExists = projects.find(p => p.id === id);

	// Verifica se o projeto existe
	if (projectExists) {
		return res.status(400).json({
			error: 'Bad request: Project with that ID already exists.',
		});
	}

	const project = {
		id,
		title,
		tasks: [],
	};

	// Adiciona o novo projeto e retorna ele
	projects.push(project);
	return res.json(projects);
});

/**
 * Pegar todos os projetos
 */
server.get('/projects', (_req, res) => {
	res.json(projects);
});

/**
 * Habilitar a middleware de checagem se o projeto requerido existe
 */
server.use(checkProjectExists);

/**
 * Alteração do título do projeto
 */
server.put('/projects/:id', (req, res) => {
	const { id } = req.params;
	const { title } = req.body;

	// Verifica se os campos existem
	if (!id || !title) {
		res.status(400).json({
			error: 'Bad request: Missing arguments.',
		});
	}

	const project = projects.find(p => p.id === id);

	// Altera o título do projeto e retorna ele
	project.title = title;
	return res.json(project);
});

/**
 * Deletar o projeto
 */
server.delete('/projects/:id', (req, res) => {
	const { id } = req.params;
	const projectIndex = projects.findIndex(p => p.id === id);

	// Pega o projeto pelo índice dele, remove da array e retorna o sucesso
	projects.splice(projectIndex, 1);
	return res.json({ ok: true });
});

/**
 * adicionar uma nova tarefa no projeto
 */
server.post('/projects/:id/tasks', (req, res) => {
	const { id } = req.params;
	const { title } = req.body;
	const project = projects.find(p => p.id === id);

	// Adiciona novas tarefas no projeto e retorna o mesmo
	project.tasks.push(title);
	return res.json(project);
});

/**
 * Execução do servidor na porta 3000
 */
server.listen(3000);
