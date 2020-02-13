const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

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
