const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

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

server.put('/projects/:id', checkProjectExists, (req, res) => {
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

server.delete('/projects/:id', checkProjectExists, (req, res) => {
	const { id } = req.params;
	const projectIndex = projects.findIndex(p => p.id === id);
	projects.splice(projectIndex, 1);
	return res.json({ ok: true });
});
