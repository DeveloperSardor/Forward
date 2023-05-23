import { Router } from "express";
import { checkAdmin } from "../../middlewares/admin.check.js";
import { RoleController } from "./controller.js";

const roleRouter = Router();

// Get Methods
roleRouter.get("/role", checkAdmin, RoleController.GetRolesOnlyAdmin);
roleRouter.get("/role/:id", checkAdmin, RoleController.GetRolesOnlyAdmin);

// Post Methods
roleRouter.post("/role/add", checkAdmin, RoleController.PostRoleOnlyAdmin);

// Put Methods
roleRouter.put("/role/:id", checkAdmin, RoleController.UpdateRole);

// Delete Methods
roleRouter.delete("/role/:id", checkAdmin, RoleController.DeleteRole);

export default roleRouter;
