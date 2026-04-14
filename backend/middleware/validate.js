import { ZodError } from "zod";

const formatZodError = (err) => {
  if (!(err instanceof ZodError)) return undefined;
  return err.issues.map((i) => ({
    path: i.path.join("."),
    message: i.message,
  }));
};

export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: formatZodError(result.error),
    });
  }
  req.body = result.data;
  return next();
};

export const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: formatZodError(result.error),
    });
  }
  // Some runtimes/framework versions expose req.params as non-writable.
  // Merge in-place to avoid "has only a getter" errors.
  if (req.params && typeof req.params === "object") {
    Object.assign(req.params, result.data);
  } else {
    req.params = result.data;
  }
  return next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: formatZodError(result.error),
    });
  }
  // Some runtimes/framework versions expose req.query as non-writable.
  // Merge in-place to avoid "has only a getter" errors.
  if (req.query && typeof req.query === "object") {
    Object.assign(req.query, result.data);
  } else {
    req.query = result.data;
  }
  return next();
};
