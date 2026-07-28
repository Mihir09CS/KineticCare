import Service from "../models/service.model.js";
import ApiError from "../utils/ApiError.js";

/* ==========================================================
   Create Service
========================================================== */

/**
 * Creates a new service.
 * Guards against duplicate names (case-insensitive).
 *
 * @param {Object} data - { name, description, category, duration, price, imageUrl }
 * @returns {Object} Created service document
 */
export const createService = async (data) => {
  const { name, description, category, duration, price, imageUrl } = data;

  // Guard against duplicate service names (case-insensitive)
  const existing = await Service.findOne({
    name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
  });

  if (existing) {
    throw new ApiError(409, "A service with this name already exists");
  }

  const service = await Service.create({
    name,
    description,
    category,
    duration,
    price,
    imageUrl: imageUrl || "",
  });

  return service;
};

/* ==========================================================
   Get All Services
========================================================== */

/**
 * Retrieves paginated, searchable, and filterable list of services.
 *
 * @param {Object} options - { page, limit, search, category, isActive }
 * @returns {{ services: Array, pagination: Object }}
 */
export const getAllServices = async ({
  page = 1,
  limit = 10,
  search,
  category,
  isActive,
} = {}) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  // Build filter query
  const filter = {};

  // isActive filter — defaults to showing only active services to public
  // Admins can pass isActive=false to see inactive ones
  if (isActive !== undefined) {
    filter.isActive = isActive === "true" || isActive === true;
  } else {
    filter.isActive = true;
  }

  // Category filter
  if (category) {
    filter.category = category;
  }

  // Partial/substring search across name, description, and category.
  // Uses a case-insensitive regex so "physio" matches "Physiotherapy Session".
  // MongoDB $text was intentionally avoided here because it only matches
  // whole words — making partial queries like "physio" return zero results.
  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    filter.$or = [
      { name: searchRegex },
      { description: searchRegex },
      { category: searchRegex },
    ];
  }

  // Build the query — always sort by newest first
  const query = Service.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 });

  const [services, total] = await Promise.all([
    query.lean(),
    Service.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return {
    services,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  };
};

/* ==========================================================
   Get Service By ID
========================================================== */

/**
 * Retrieves a single service by ID.
 *
 * @param {string} id - Service MongoDB ObjectId
 * @returns {Object} Service document
 */
export const getServiceById = async (id) => {
  const service = await Service.findById(id).lean();

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  return service;
};

/* ==========================================================
   Update Service
========================================================== */

/**
 * Updates an existing service by ID.
 * Allows partial updates. Guards against duplicate names on rename.
 *
 * @param {string} id - Service MongoDB ObjectId
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated service document
 */
export const updateService = async (id, updates) => {
  const service = await Service.findById(id);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  // If name is being changed, check for duplicates
  if (updates.name && updates.name.trim() !== service.name) {
    const existing = await Service.findOne({
      name: { $regex: new RegExp(`^${updates.name.trim()}$`, "i") },
      _id: { $ne: id },
    });

    if (existing) {
      throw new ApiError(409, "A service with this name already exists");
    }
  }

  // Apply updates
  Object.assign(service, updates);

  await service.save();

  return service;
};

/* ==========================================================
   Delete Service (Soft Delete)
========================================================== */

/**
 * Soft-deletes a service by setting isActive to false.
 * Preserves historical data for existing bookings.
 *
 * @param {string} id - Service MongoDB ObjectId
 * @returns {{ success: boolean }}
 */
export const deleteService = async (id) => {
  const service = await Service.findById(id);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  if (!service.isActive) {
    throw new ApiError(409, "Service is already deactivated");
  }

  service.isActive = false;

  await service.save();

  return { success: true };
};
