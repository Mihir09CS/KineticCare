import asyncHandler from "../helpers/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from "../services/service.service.js";

/* ==========================================================
   Create Service
   POST /api/v1/services
   Access: Admin only
========================================================== */

export const createServiceHandler = asyncHandler(async (req, res) => {
  const service = await createService(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, "Service created successfully", service));
});

/* ==========================================================
   Get All Services
   GET /api/v1/services
   Access: Public
========================================================== */

export const getAllServicesHandler = asyncHandler(async (req, res) => {
  const { page, limit, search, category, isActive } = req.query;

  const result = await getAllServices({ page, limit, search, category, isActive });

  return res
    .status(200)
    .json(new ApiResponse(200, "Services fetched successfully", result));
});

/* ==========================================================
   Get Service By ID
   GET /api/v1/services/:id
   Access: Public
========================================================== */

export const getServiceByIdHandler = asyncHandler(async (req, res) => {
  const service = await getServiceById(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Service fetched successfully", service));
});

/* ==========================================================
   Update Service
   PUT /api/v1/services/:id
   Access: Admin only
========================================================== */

export const updateServiceHandler = asyncHandler(async (req, res) => {
  const service = await updateService(req.params.id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, "Service updated successfully", service));
});

/* ==========================================================
   Delete Service (Soft Delete)
   DELETE /api/v1/services/:id
   Access: Admin only
========================================================== */

export const deleteServiceHandler = asyncHandler(async (req, res) => {
  await deleteService(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Service deactivated successfully"));
});
