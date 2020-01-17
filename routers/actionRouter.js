const express = require("express");
const { get, insert, update, remove } = require("../data/helpers/actionModel");
const projectModel = require("../data/helpers/projectModel");

const actionRouter = express.Router();

actionRouter.get("/", (req, res) => {
  get()
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(error => {
      res
        .status(500)
        .json({ errorMessage: "Actions cannot be retrieved at this time" });
    });
});

actionRouter.get("/:id", validateActionId, (req, res) => {
  res.status(200).json(res.action);
});

actionRouter.post("/", validatePostData, (req, res) => {
  const newAction = req.body;
  insert(newAction)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(error => {
      res
        .status(500)
        .json({ errorMessage: "Unable to add new action at this time" });
    });
});

actionRouter.put("/:id", validateActionId, validatePostData, (req, res) => {
  update(req.action.id, req.body)
    .then(async data => {
      const updatedAction = await get(req.action.id);
      res.status(200).json(updatedAction);
    })
    .catch(error => {
      res
        .status(500)
        .json({ errorMessage: "Unable to edit action at this time" });
    });
});

actionRouter.delete("/:id", validateActionId, (req, res) => {
  remove(req.action.id)
    .then(data => {
      res
        .status(200)
        .json({ message: `Action with id ${req.action.id} has been deleted` });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: `Action with id ${req.action.id} cannot be deleted at this time`
      });
    });
});

// -------------------------------
// MIDDLEWARES
// -------------------------------

async function validateActionId(req, res, next) {
  const { id } = req.params;
  const action = await get(id);
  if (action) {
    req.action = action;
    next();
  } else {
    res.status(400).json({ message: "Action ID is invalid" });
  }
}

async function validateProjectID(req, res, next) {
  const { id } = req.body;
  const project = await projectModel.get(id);
  if (project) {
    next();
  } else {
    res.status(404).json({ errorMessage: "There is no Project with that ID" });
  }
}

function validatePostData(req, res, next) {
  const newAction = req.body;
  if (newAction) {
    if (newAction.project_id && newAction.description && newAction.notes) {
      next();
    } else {
      res.status(400).json({
        message:
          "Please Include all required fields: project_id, description and notes"
      });
    }
  } else {
    res.status(400).json({
      message: "Missing required fields"
    });
  }
}

module.exports = actionRouter;
