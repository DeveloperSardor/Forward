import CategoryModel from "./schema.js";
import ContentModel from "../../modules/content/schema.js";
import { VERIFY } from "../../utils/jwt.js";

export class CategoriesController {
  constructor() {}

  //   Get Categories
  static async GetCategoris(req, res) {
    let { category } = req.query;
    let { id } = req.params;
    try {
      if (id) {
        let findCategoryById = await ContentModel.find({
          category_content: id,
        });
        if (findCategoryById == undefined) {
          throw new Error(`Not Found ${id} - Category`);
        }
        res.send({
          status: 200,
          success: true,
          message: `Ok`,
          data: await findCategoryById,
        });
      } else if (category) {
        if(category.toLowerCase()=='all'){
          res.send({
            status : 200,
            message : 'ok',
            success : true,
            data : await ContentModel.find().populate('user')
          })
          return
        }
        let findCategoryByQuery = await CategoryModel.findOne({
          category_name: category.toLowerCase(),
        });
        let data = await ContentModel.find({
          category_content: findCategoryByQuery._id,
        }).populate('user');

        res.send({
          status: 200,
          success: true,
          message: `Ok`,
          data,
        });
      } else {
        res.send({
          status: 200,
          success: true,
          message: `Ok`,
          data: await CategoryModel.find(),
        });
      }
    } catch (error) {
      res
        .send({
          status: 404,
          mesage: `Error: ${error.mesage}`,
          success: false,
        })
        .status(404);
    }
  }

  //    Post Category

  static async PostCategory(req, res) {
    try {
      let { category_name } = req.body;
      let newCategory = await CategoryModel.create({ category_name });
      if (newCategory == undefined) {
        throw new Error(`Category not added`);
      }
      res.send({
        message: "Data added!",
        status: 201,
        success: true,
        added_data: newCategory,
      });
    } catch (error) {
      res.send({
        status: 400,
        message: `Error: ${error.mesage}!`,
        success: false,
      });
    }
  }

  //   Put Category

  static async UpdateCategory(req, res) {
    try {
      let { id } = req.params;
      let { category_name } = req.body;
      if (!category_name) {
        throw new Error(`You are not sent data from request body!`);
      }
      let findCategory = await CategoryModel.findById(id);
      if (findCategory == undefined) {
        throw new Error(`Not Found ${id}-category`);
      }

      let updatedCategory = await CategoryModel.findByIdAndUpdate(id, {
        category_name,
      });
      if ((await updatedCategory) == undefined) {
        throw new Error(`Not Updated category`);
      }
      res.send({
        status: 200,
        message: `${id} - category updated was successfuly`,
        success: true,
        updated_data: await CategoryModel.findById(id),
      });
    } catch (error) {
      res.send({
        status: 400,
        message: `Error: ${error.mesage}!`,
        success: false,
      });
    }
  }

  //  Delete Category
  static async DeleteCategory(req, res) {
    try {
      let { id } = req.params;
      let findCategory = await CategoryModel.findById(id);
      console.log(findCategory);
      if (findCategory == undefined) {
        throw new Error(`Not Found ${id}-category`);
      }
      let deletedCategory = await CategoryModel.findByIdAndDelete(id);
      if (deletedCategory == undefined) {
        throw new Error(`Not Deleted category`);
      }
      res.send({
        status: 200,
        message: `${id} - category deleted was successfuly`,
        success: true,
        deleted_date: findCategory,
      });
    } catch (error) {
      res.send({
        status: 400,
        message: `Error: ${error.mesage}!`,
        success: false,
      });
    }
  }
}

// console.log(await ContentModel.find().populate('category_content_ref_id'));

// console.log(await CategoryModel.find().populate('contents'));

// console.log(await CategoryModel.findOne({category_name : 'Sport'}._id));
