import { validationResult } from "express-validator";
import ApiResponse from "../utils/ApiResponse.js";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(
      new ApiResponse(
        400,
        "Validation failed",
        errors.array().map((error) => ({
          field: error.path,
          message: error.msg,
        })),
      ),
    );
  }

  next();
};

export default validate;
