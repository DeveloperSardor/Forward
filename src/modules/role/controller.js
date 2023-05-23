import RoleModel from "./schema.js";
import UserModel from "../../modules/users/schema.js";

export class RoleController {
  constructor() {}

  //   Get Methods
  static async GetRolesOnlyAdmin(req, res) {
    try {
      let { id } = req.params;
      let { role } = req.query;
      if (id) {
        let findRoleById = await UserModel.find().populate("role");
        let x = findRoleById.map((el) => {
          if (el.role._id == id) {
            res.send({
              status: 200,
              message: `ok, ${id} - role's users`,
              success: true,
              data: el,
            });
          } else return;
        });
      } else if (role) {
        let findRoleByRole = await UserModel.find().populate("role");
        let x = findRoleByRole.filter((el) => {
          res.send({
            message: `Ok, ${role} - role's users`,
            status: 200,
            success: true,
            data: el.role.role.toLowerCase() == role,
          });
        });
      }
      let roles = RoleModel.find();
      res.send({
        status: 200,
        message: `Ok , roles data`,
        success: true,
        data: roles,
      });
    } catch (error) {
      res.send({
        status: 404,
        message: `Error: ${error.message}`,
        success: false,
      });
    }
  }

  //   Post Methods

  static async PostRoleOnlyAdmin(req, res) {
    try {
      let { role } = req.body;
      if (!role) throw new Error(`You are not sent data from request body❌`);
      let newRole = await RoleModel.create({ role });
      if (newRole) {
        res.send({
          status: 201,
          message: `Ok, role added was successfuly ✅`,
          success: true,
          data: newRole,
        });
      }
    } catch (error) {
      res.send({
        status: 404,
        message: `Error: ${error.message}`,
        success: false,
      });
    }
  }

  //  Put Methods

  static async UpdateRole(req, res) {
    try {
      let { id } = req.params;
      let { role } = req.body;
      if (!role) throw new Error(`You are not sent data from request body❌`);
      let updatedRole = await RoleModel.findByIdAndUpdate(id, { role });
      if (updatedRole) {
        res.send({
          status: 200,
          message: `${id} - role updated was successfuly`,
          success: true,
          data: await RoleModel.findById(id),
        });
      } else throw new Error(`Not Updated ${id} - role 😕`);
    } catch (error) {
      res.send({
        status: 404,
        message: `Error: ${error.message}`,
        success: false,
      });
    }
  }

  static async DeleteRole(req, res) {
    try {
      let { id } = req.params;
      let findRoleById = await RoleModel.findById(id);
      if (!findRoleById) throw new Error(`Not Found ${id} - role`);
      let deleted_role = await RoleModel.findByIdAndDelete(id);
      res.send({
        status: 200,
        message: `${id} - role deleted was successfuly`,
        success: true,
        data: deleted_role,
      });
    } catch (error) {
      res.send({
        status: 404,
        message: `Error: ${error.message}`,
        success: false,
      });
    }
  }
}
