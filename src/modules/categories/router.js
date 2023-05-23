import { Router } from "express";
import { checkAdmin } from "../../middlewares/admin.check.js";
import { CategoriesController } from "./controller.js";
import { checkToken } from "../../middlewares/token.check.js";
const CategoryRouter = Router();

// get methods
CategoryRouter.get("/categories", checkToken, CategoriesController.GetCategoris);
CategoryRouter.get("/categories/:id", checkToken, CategoriesController.GetCategoris);

// post methods
CategoryRouter.post(
  "/categories",
  checkAdmin,
  CategoriesController.PostCategory
);

// put methods
CategoryRouter.put(
  "/categories/:id",
  checkAdmin,
  CategoriesController.UpdateCategory
);

// delete methods
CategoryRouter.delete(
  "/categories/:id",
  checkAdmin,
  CategoriesController.DeleteCategory
);

export default CategoryRouter;
