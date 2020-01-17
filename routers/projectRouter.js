const express = require("express");
const {
  get,
  insert,
  update,
  remove,
  getProjectActions
} = require("../data/helpers/projectModel");

const projectRouter = express.Router();

projectRouter.get("/", (req, res) => {
  get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(error => {
      res
        .status(500)
        .json({ errorMessage: "Projects cannot be retrieved at this time" });
    });
});

projectRouter.get("/:id", validateProjectId, (req, res) => {
  res.status(200).json(req.project);
});

projectRouter.get("/:id/actions", validateProjectId, (req, res) => {
  getProjectActions(req.project.id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: "Unable to get actions for the project at this time"
      });
    });
});

projectRouter.post("/", validatePostData, (req, res) => {
  const newProject = req.body;
  insert(newProject)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(error => {
      res
        .status(500)
        .json({ errorMessage: "Unable to add new project at this time" });
    });
});

projectRouter.put("/:id", validateProjectId, validatePostData, (req, res) => {
  update(req.project.id, req.body)
    .then(async data => {
      const updatedProject = await get(req.project.id);
      res.status(200).json(updatedProject);
    })
    .catch(error => {
      res
        .status(500)
        .json({ errorMessage: "Unable to edit project at this time" });
    });
});

projectRouter.delete("/:id", validateProjectId, (req, res) => {
  remove(req.project.id)
    .then(data => {
      res.status(200).json({
        message: `Project with id ${req.project.id} has been deleted`
      });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: `Project with id ${req.project.id} cannot be deleted at this time`
      });
    });
});

// -------------------------------
// MIDDLEWARES
// -------------------------------

async function validateProjectId(req, res, next) {
  const { id } = req.params;
  const project = await get(id);
  if (project) {
    req.project = project;
    next();
  } else {
    res.status(400).json({ message: "Project ID is invalid" });
  }
}

function validatePostData(req, res, next) {
  const newProject = req.body;
  if (newProject) {
    if (newProject.name && newProject.description) {
      next();
    } else {
      res.status(400).json({
        message: "Please Include all required fields: name and description"
      });
    }
  } else {
    res.status(400).json({
      message: "Missing required fields"
    });
  }
}

module.exports = projectRouter;
