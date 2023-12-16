import { Router } from "express";
import varifyManager from "../middlewares/varify/checkManage.js";
import Project from "../schemas/project/projectSchema.js";

const projectRouter = Router();

projectRouter.post("/", varifyManager, async (req, res) => {
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

projectRouter.get("/", varifyManager, async (req, res) => {
  const query = {};
  if (req.query?.me) {
    query.createdBy = req.manager._id;
  }
  try {
    const results = await Project.find(query).populate({
      path: "createdBy",
      select: ["-password", "-createdAt"],
    });

    res.status(201).send(results);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default projectRouter;
