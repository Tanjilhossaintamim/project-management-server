import { Router } from "express";
import verifyManager from "../middlewares/verify/verify.js";
import Project from "../schemas/project/projectSchema.js";

const projectRouter = Router();

projectRouter.post("/", verifyManager, async (req, res) => {
  const projectInfo = req.body;
  // check if all required value is provide or not
  if (!projectInfo.name || !projectInfo.description) {
    return res.status(403).send({ message: "please provide all field !" });
  }
  const newProject = new Project({
    name: projectInfo.name,
    description: projectInfo.description,
    createdBy: req.manager._id,
  });
  try {
    const result = await newProject.save();
    res.status(201).send({ project: result });
  } catch (error) {
    res.status(500).send(error);
  }
});

projectRouter.get("/", verifyManager, async (req, res) => {
  const query = {};
  if (req.query?.me) {
    query.createdBy = req.manager._id;
  }
  try {
    const results = await Project.find(query)
      .populate({
        path: "createdBy",
        select: ["-password", "-createdAt"],
      })
      .populate("tasks");

    res.status(201).send(results);
    res.send(results);
  } catch (error) {
    res.status(500).send(error);
  }
});
projectRouter.get("/:id", verifyManager, async (req, res) => {
  const project_id = req.params.id;
  try {
    const result = await Project.findById(project_id).populate("tasks");
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

projectRouter.patch("/:id", verifyManager, async (req, res) => {
  const project_id = req.params.id;
  const data = req.body;

  const filter = {
    _id: project_id,
  };
  const updatedData = {
    complete: data?.complete,
  };
  try {
    const result = await Project.updateOne(filter, updatedData);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default projectRouter;
