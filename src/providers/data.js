import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with provided credentials
const supabaseClient = createClient(
  "https://ocqghycfqgrvlgqjoort.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jcWdoeWNmcWdydmxncWpvb3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MjkwNzEsImV4cCI6MjA1NzEwNTA3MX0.p3DWXSu6vWL1ey0CeKBhWaeD0iu54Fk6iEHohPNWCRU"
);

/**
 * Maps React Admin filters to Supabase query filters
 * @param {Object} filter - React Admin filter object
 * @returns {Array} - Array of filter operations for Supabase
 */
const KNOWN_OPERATORS = ["gte", "lte", "gt", "lt", "neq", "like", "ilike", "in"];

const mapFilters = (filterObject) => {
  const supabaseFilters = [];

  Object.keys(filterObject).forEach((key) => {
    const value = filterObject[key];
    let operatorFoundAndHandled = false;

    for (const op of KNOWN_OPERATORS) {
      const suffix = `_${op}`;
      if (key.endsWith(suffix)) {
        const field = key.slice(0, -suffix.length);
        if (field) {
          operatorFoundAndHandled = true;
          // console.log(`[mapFilters] Operator Dikenali. Key: "${key}", Field: "${field}", Operator: "${op}", Value:`, value);
          switch (op) {
            case "gte": supabaseFilters.push((query) => query.gte(field, value)); break;
            case "lte": supabaseFilters.push((query) => query.lte(field, value)); break;
            case "gt": supabaseFilters.push((query) => query.gt(field, value)); break;
            case "lt": supabaseFilters.push((query) => query.lt(field, value)); break;
            case "neq": supabaseFilters.push((query) => query.neq(field, value)); break;
            case "like": case "ilike": supabaseFilters.push((query) => query.ilike(field, `%${value}%`)); break;
            case "in":
              if (Array.isArray(value)) {
                supabaseFilters.push((query) => query.in(field, value));
              } else { /* warning */ }
              break;
            default: operatorFoundAndHandled = false; // Fallback
          }
        }
        break;
      }
    }

    if (!operatorFoundAndHandled) {
      // console.log(`[mapFilters] Direct Equality. Key: "${key}", Value:`, value);
      if (value === null) {
        supabaseFilters.push((query) => query.is(key, null));
      } else if (Array.isArray(value)) {
        supabaseFilters.push((query) => query.in(key, value));
      } else if (value !== undefined) { // Pencegahan untuk tidak mengirim 'undefined' ke .eq()
        supabaseFilters.push((query) => query.eq(key, value));
      } else {
        // console.warn(`[mapFilters] Mengabaikan filter untuk key "${key}" karena nilainya undefined.`);
      }
    }
  });
  return supabaseFilters;
};

/**
 * Applies all query modifiers to the Supabase query
 * @param {Object} query - Supabase query object
 * @param {Object} params - React Admin request params
 * @returns {Object} - Modified Supabase query
 */
const applyQueryModifiers = (query, params) => {
  // Apply filters
  if (params.filter) {
    const filters = mapFilters(params.filter);
    filters.forEach((filter) => {
      query = filter(query);
    });
  }

  // Apply sorting
  if (params.sort) {
    const { field, order } = params.sort;
    query = query.order(field, { ascending: order === "ASC" });
  }

  // Apply pagination
  if (params.pagination) {
    const { page, perPage } = params.pagination;
    const start = (page - 1) * perPage;
    const end = page * perPage - 1;
    query = query.range(start, end);
  }

  return query;
};

/**
 * Handles file uploads to Supabase Storage with improved error handling
 * @param {File} file - File object to upload
 * @param {string} bucketName - Name of the storage bucket
 * @param {string} [folderPath=''] - Optional folder path within the bucket
 * @param {string} [fileNameOverride=null] - Optional filename override
 * @returns {Promise} - Promise resolving to the file URL and path
 */
const uploadFile = async (
  file,
  bucketName,
  folderPath = "",
  fileNameOverride = null
) => {
  if (!file) {
    return null;
  }

  // Create a unique filename or use the override if provided
  const fileName =
    fileNameOverride || `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;

  // Construct the full path
  const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

  try {
    // Instead of getBucket (which doesn't exist), check bucket existence with listBuckets
    // const { data: buckets, error: bucketsError } =
    //   await supabaseClient.storage.listBuckets();

    // if (bucketsError) {
    //   console.error("Error listing buckets:", bucketsError);
    //   // Continue with upload attempt
    // } else {
    //   // Check if our bucket exists in the list
    //   const bucketExists = buckets.some((bucket) => bucket.name === bucketName);
    //   if (!bucketExists) {
    //     console.warn(
    //       `Bucket "${bucketName}" does not exist in your Supabase project.`
    //     );
    //     // You might want to create the bucket here or throw an error
    //   }
    // }

    // Upload the file to Supabase Storage
    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type, // Explicitly set the content type
      });

    if (error) {
      console.error("Supabase storage upload error:", error);

      // Check for specific error types
      if (
        error.message.includes("new row violates row-level security policy")
      ) {
        throw new Error(
          `File upload denied due to security policy. Please check bucket permissions for "${bucketName}".`
        );
      }

      throw new Error(`Error uploading file: ${error.message}`);
    }

    // Get the public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabaseClient.storage.from(bucketName).getPublicUrl(filePath);

    return {
      url: publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error("Upload error details:", error);
    throw error;
  }
};

/**
 * Process raw form data to handle file uploads before saving to database
 * @param {Object} data - Form data potentially containing File objects
 * @param {Array} fileFields - Array of field configurations for file uploads
 * @returns {Promise} - Promise resolving to processed data with file URLs
 */
/**
 * Process raw form data to handle file uploads before saving to database
 * @param {Object} data - Form data potentially containing File objects
 * @param {Array} fileFields - Array of field configurations for file uploads
 * @returns {Promise} - Promise resolving to processed data with file URLs
 */
const processFileUploads = async (data, fileFields) => {
  const processedData = { ...data };

  // Process each configured file field
  for (const fieldConfig of fileFields) {
    const {
      source,
      bucket = "gambar", // default bucket name
      folder = "", // default empty folder path
      fileNameField = null, // optional field to store filename
    } = fieldConfig;

    // Get the file from the data
    const fieldValue = data[source];

    // Skip if nothing in this field
    if (!fieldValue) {
      console.log(`Skipping field ${source}: No value found`);
      continue;
    }

    // Debug log to see what we're dealing with
    console.log(`Processing field ${source}:`, fieldValue);

    // Extract the actual File object based on different possible structures
    let file = null;

    // Case 1: Direct File object
    if (fieldValue instanceof File) {
      file = fieldValue;
      console.log(`Found direct File object in ${source}`);
    }
    // Case 2: { rawFile: File } format (React Admin's FileInput)
    else if (fieldValue.rawFile instanceof File) {
      file = fieldValue.rawFile;
      console.log(`Found rawFile in ${source}`);
    }
    // Case 3: { src: File } format (sometimes used in ImageInput)
    else if (fieldValue.src instanceof File) {
      file = fieldValue.src;
      console.log(`Found src File in ${source}`);
    }
    // Case 4: Object with title and either a File or a string URL
    else if (typeof fieldValue === "object" && fieldValue.title) {
      // If src is a File
      if (fieldValue.src instanceof File) {
        file = fieldValue.src;
        console.log(`Found File in object with title in ${source}`);
      }
      // If src is a string URL and hasn't changed, keep the existing value
      else if (typeof fieldValue.src === "string") {
        console.log(
          `Field ${source} contains URL, not changing:`,
          fieldValue.src
        );
        processedData[source] = fieldValue; // Keep the existing structure
        continue;
      }
    }
    // Case 5: Array of objects (multiple files)
    else if (Array.isArray(fieldValue) && fieldValue.length > 0) {
      // Take the first file object
      const firstItem = fieldValue[0];

      // Extract File from the first item
      if (firstItem instanceof File) {
        file = firstItem;
      } else if (firstItem.rawFile instanceof File) {
        file = firstItem.rawFile;
      } else if (firstItem.src instanceof File) {
        file = firstItem.src;
      }

      console.log(`Processing first item from array in ${source}`);
    }

    // Skip if no valid file was found
    if (!file) {
      console.log(`No valid File object found in field ${source}`);
      continue;
    }

    console.log(`Uploading file from ${source}: ${file.name} (${file.type})`);

    try {
      // Upload the file
      const uploadResult = await uploadFile(file, bucket, folder);

      if (uploadResult) {
        // Store the URL in the original field
        if (typeof fieldValue === "object" && fieldValue.title) {
          // Preserve the structure with title but update src
          processedData[source] = {
            ...fieldValue,
            src: uploadResult.url,
          };
        } else {
          // Just store the URL
          processedData[source] = uploadResult.url;
        }

        // Optionally store the file path in another field
        if (fileNameField) {
          processedData[fileNameField] = uploadResult.path;
        }

        console.log(
          `Successfully uploaded file from ${source} to ${uploadResult.url}`
        );
      }
    } catch (error) {
      console.error(`Error uploading file from field ${source}:`, error);
      // Continue with other fields even if one fails
    }
  }

  return processedData;
};

const dataProvider = {
  /**
   * Get a list of resources
   * @param {string} resource - Resource name (table)
   * @param {Object} params - Request parameters
   * @returns {Promise} - Promise resolving to { data, total }
   */
  getList: async (resource, params) => {
    // Create a base query
    let query = supabaseClient.from(resource).select("*", { count: "exact" });

    // Apply filters, sorting, pagination
    query = applyQueryModifiers(query, params);

    // Execute the query
    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Error fetching ${resource}: ${error.message}`);
    }

    return {
      data: data || [],
      total: count || 0,
    };
  },

  /**
   * Get a single resource by ID with better error handling
   * @param {string} resource - Resource name (table)
   * @param {Object} params - Request parameters
   * @returns {Promise} - Promise resolving to { data }
   */
  getOne: async (resource, params) => {
    try {
      // First check if the resource exists
      const { count, error: countError } = await supabaseClient
        .from(resource)
        .select("*", { count: "exact", head: true })
        .eq("id", params.id);

      if (countError) {
        console.error(
          `Error checking existence of ${resource}/${params.id}:`,
          countError
        );
      } else if (count === 0) {
        throw new Error(`Resource ${resource} with id ${params.id} not found`);
      } else if (count > 1) {
        console.warn(
          `Found ${count} rows for ${resource}/${params.id}, expected 1. Using first record.`
        );
      }

      // Get the data
      const { data, error } = await supabaseClient
        .from(resource)
        .select("*")
        .eq("id", params.id)
        .maybeSingle(); // Use maybeSingle() instead of single() for more resilient handling

      if (error) {
        throw new Error(
          `Error fetching ${resource}/${params.id}: ${error.message}`
        );
      }

      if (!data) {
        throw new Error(`Resource ${resource} with id ${params.id} not found`);
      }

      return { data };
    } catch (error) {
      console.error(`Error in getOne for ${resource}/${params.id}:`, error);
      throw error;
    }
  },

  /**
   * Get multiple resources by ID
   * @param {string} resource - Resource name (table)
   * @param {Object} params - Request parameters
   * @returns {Promise} - Promise resolving to { data }
   */
  getMany: async (resource, params) => {
    const { data, error } = await supabaseClient
      .from(resource)
      .select("*")
      .in("id", params.ids);

    if (error) {
      throw new Error(`Error fetching multiple ${resource}: ${error.message}`);
    }

    return { data: data || [] };
  },

  /**
   * Get resources related to another resource
   * @param {string} resource - Resource name (table)
   * @param {Object} params - Request parameters
   * @returns {Promise} - Promise resolving to { data, total }
   */
  getManyReference: async (resource, params) => {
    const { target, id } = params;

    // Create a base query with the reference filter
    let query = supabaseClient
      .from(resource)
      .select("*", { count: "exact" })
      .eq(target, id);

    // Apply additional filters, sorting, pagination
    query = applyQueryModifiers(query, params);

    // Execute the query
    const { data, error, count } = await query;

    if (error) {
      throw new Error(
        `Error fetching references for ${resource}: ${error.message}`
      );
    }

    return {
      data: data || [],
      total: count || 0,
    };
  },

  /**
   * Create a new resource with support for file uploads
   * @param {string} resource - Resource name (table)
   * @param {Object} params - Request parameters
   * @param {Array} fileFields - Array of file field configurations
   * @returns {Promise} - Promise resolving to { data }
   */
  create: async (resource, params, fileFields = []) => {
    // Process any file uploads first
    const processedData = await processFileUploads(params.data, fileFields);

    // Insert the processed data
    const { data, error } = await supabaseClient
      .from(resource)
      .insert(processedData)
      .select();

    if (error) {
      throw new Error(`Error creating ${resource}: ${error.message}`);
    }

    return { data: data[0] };
  },

  /**
   * Update a resource with support for file uploads
   * @param {string} resource - Resource name (table)
   * @param {Object} params - Request parameters
   * @param {Array} fileFields - Array of file field configurations
   * @returns {Promise} - Promise resolving to { data }
   */
  update: async (resource, params, fileFields = []) => {
    // Process any file uploads first
    const processedData = await processFileUploads(params.data, fileFields);

    // Update the record with processed data
    const { data, error } = await supabaseClient
      .from(resource)
      .update(processedData)
      .eq("id", params.id)
      .select();

    if (error) {
      throw new Error(
        `Error updating ${resource}/${params.id}: ${error.message}`
      );
    }

    return { data: data[0] };
  },

  /**
   * Update multiple resources
   * @param {string} resource - Resource name (table)
   * @param {Object} params - Request parameters
   * @returns {Promise} - Promise resolving to { data }
   */
  updateMany: async (resource, params) => {
    const { data, error } = await supabaseClient
      .from(resource)
      .update(params.data)
      .in("id", params.ids)
      .select();

    if (error) {
      throw new Error(`Error updating multiple ${resource}: ${error.message}`);
    }

    return { data: params.ids };
  },

  /**
   * Delete a resource
   * @param {string} resource - Resource name (table)
   * @param {Object} params - Request parameters
   * @returns {Promise} - Promise resolving to { data }
   */
  delete: async (resource, params) => {
    // First get the record so we can return it
    const { data: record } = await supabaseClient
      .from(resource)
      .select("*")
      .eq("id", params.id)
      .single();

    // Then delete it
    const { error } = await supabaseClient
      .from(resource)
      .delete()
      .eq("id", params.id);

    if (error) {
      throw new Error(
        `Error deleting ${resource}/${params.id}: ${error.message}`
      );
    }

    return { data: record };
  },

  /**
   * Delete multiple resources
   * @param {string} resource - Resource name (table)
   * @param {Object} params - Request parameters
   * @returns {Promise} - Promise resolving to { data }
   */
  deleteMany: async (resource, params) => {
    const { error } = await supabaseClient
      .from(resource)
      .delete()
      .in("id", params.ids);

    if (error) {
      throw new Error(`Error deleting multiple ${resource}: ${error.message}`);
    }

    return { data: params.ids };
  },

  /**
   * Directly upload a file to Supabase storage
   * @param {File} file - File to upload
   * @param {string} bucketName - Storage bucket name
   * @param {string} [folderPath=''] - Optional folder path
   * @param {string} [fileName=null] - Optional file name override
   * @returns {Promise} - Promise resolving to the file URL and path
   */
  uploadFile: uploadFile,

  /**
   * Delete a file from Supabase storage
   * @param {string} filePath - Path of the file to delete
   * @param {string} bucketName - Storage bucket name
   * @returns {Promise} - Promise resolving when the file is deleted
   */
  deleteFile: async (filePath, bucketName) => {
    const { error } = await supabaseClient.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      throw new Error(`Error deleting file: ${error.message}`);
    }

    return { success: true };
  },
};

// Export the data provider instance
export default dataProvider;
