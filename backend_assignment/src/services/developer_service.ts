import Developer, { IDeveloper } from '../models/developer_model';

interface Filters {
  skill?: string;
  location?: string;
  search?: string;
}

interface Pagination {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Fetch developers with filters and pagination
 */
export const fetchDevelopers = async (
  filters: Filters = {},
  pagination: Pagination = {}
): Promise<IDeveloper[]> => {
  const query: Record<string, any> = {};

  // Filter by skill 
  if (filters.skill) {
    query.skills = { $regex: new RegExp(filters.skill, 'i') };
  }

  // Filter by location
  if (filters.location) {
    query.location = { $regex: new RegExp(filters.location, 'i') };
  }


  if (filters.search) {
    query.$or = [
      { name: { $regex: new RegExp(filters.search, 'i') } },
      { email: { $regex: new RegExp(filters.search, 'i') } },
    ];
  }

  // Pagination
  const page = Math.max(1, pagination.page || 1);
  const limit = Math.min(100, pagination.limit || 10);
  const skip = (page - 1) * limit;

  // Sorting
  const sortField = pagination.sortBy || 'createdAt';
  const sortOrder = pagination.sortOrder === 'asc' ? 1 : -1;

  const developers = await Developer.find(query)
    .sort({ [sortField]: sortOrder })
    .skip(skip)
    .limit(limit);

  return developers;
};
