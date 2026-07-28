import asyncHandler from "../helpers/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createSlot,
  getSlotsByService,
  getAllSlots,
  getSlotById,
  updateSlot,
  deleteSlot,
} from "../services/slot.service.js";

/* ==========================================================
   Create Slot
   POST /api/v1/slots
   Access: Admin only
========================================================== */

export const createSlotHandler = asyncHandler(async (req, res) => {
  const slot = await createSlot(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, "Slot created successfully", slot));
});

/* ==========================================================
   Get All Slots  (Admin)
   GET /api/v1/slots
   Access: Admin only
========================================================== */

export const getAllSlotsHandler = asyncHandler(async (req, res) => {
  const { page, limit, serviceId, date, status, isActive } = req.query;

  const result = await getAllSlots({
    page,
    limit,
    serviceId,
    date,
    status,
    isActive,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Slots fetched successfully", result));
});

/* ==========================================================
   Get Slots By Service  (Public)
   GET /api/v1/slots/service/:serviceId
   Access: Public
========================================================== */

export const getSlotsByServiceHandler = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const { date } = req.query;

  const slots = await getSlotsByService(serviceId, { date });

  return res
    .status(200)
    .json(new ApiResponse(200, "Slots fetched successfully", slots));
});

/* ==========================================================
   Get Slot By ID
   GET /api/v1/slots/:id
   Access: Public
========================================================== */

export const getSlotByIdHandler = asyncHandler(async (req, res) => {
  const slot = await getSlotById(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Slot fetched successfully", slot));
});

/* ==========================================================
   Update Slot
   PUT /api/v1/slots/:id
   Access: Admin only
========================================================== */

export const updateSlotHandler = asyncHandler(async (req, res) => {
  const slot = await updateSlot(req.params.id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, "Slot updated successfully", slot));
});

/* ==========================================================
   Delete Slot  (Soft Delete)
   DELETE /api/v1/slots/:id
   Access: Admin only
========================================================== */

export const deleteSlotHandler = asyncHandler(async (req, res) => {
  await deleteSlot(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Slot deactivated successfully"));
});
