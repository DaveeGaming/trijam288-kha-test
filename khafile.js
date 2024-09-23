let project = new Project('New Project');

await project.addProject('../ccg-kha-starter');

project.addAssets('Assets/**');
project.addShaders('Shaders/**');
project.addSources('Sources');
resolve(project);
