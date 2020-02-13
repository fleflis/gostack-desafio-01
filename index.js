const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

function countLog(_req, _res, next) {
	console.count('Número de requisições');

	return next();
}

function checkProjectExists(req, res, next) {
	const { id } = req.params;
	const projectExists = projects.find(p => p.id === id);
	if (!projectExists) {
		return res
			.status(400)
			.json({ error: 'Project with this ID does not exists.' });
	}
	return next();
}
server.use(countLog);

server.post('/projects', (req, res) => {
	const { id, title } = req.body;
	if (!id || !title) {
		return res.status(400).json({
			error: 'Bad request: Not all fields are providden.',
		});
	}
	const projectExists = projects.find(p => p.id === id);
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

	projects.push(project);
	return res.json(projects);
});

server.get('/projects', (_req, res) => {
	res.json(projects);
});

server.use(checkProjectExists);

server.put('/projects/:id', (req, res) => {
	const { id } = req.params;
	const { title } = req.body;

	if (!id || !title) {
		res.status(400).json({
			error: 'Bad request: Missing arguments.',
		});
	}

	const project = projects.find(p => p.id === id);
	project.title = title;

	return res.json(project);
});

server.delete('/projects/:id', (req, res) => {
	const { id } = req.params;
	const projectIndex = projects.findIndex(p => p.id === id);
	projects.splice(projectIndex, 1);
	return res.json({ ok: true });
});

server.post('/projects/:id/tasks', (req, res) => {
	const { id } = req.params;
	const { title } = req.body;
	const project = projects.find(p => p.id === id);
	project.tasks.push(title);
	return res.json(project);
});
