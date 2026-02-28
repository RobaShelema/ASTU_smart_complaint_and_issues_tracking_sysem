/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {T} [data]
 * @property {string} [message]
 * @property {Object.<string, string[]>} [errors]
 * @property {Object} [meta]
 * @property {number} meta.current_page
 * @property {number} meta.last_page
 * @property {number} meta.per_page
 * @property {number} meta.total
 * @template T
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {'student'|'staff'|'admin'} role
 * @property {string} [department]
 * @property {string} [phone]
 * @property {string} [avatar]
 * @property {'active'|'inactive'|'suspended'} status
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Complaint
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} category
 * @property {'low'|'medium'|'high'|'urgent'} priority
 * @property {'pending'|'in_progress'|'resolved'|'closed'} status
 * @property {string} location
 * @property {string} studentId
 * @property {string} studentName
 * @property {string} [assignedTo]
 * @property {string} [assignedToName]
 * @property {Array<{name: string, url: string, size: number}>} [attachments]
 * @property {Array<{id: string, userId: string, userName: string, text: string, createdAt: string}>} [comments]
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} [resolvedAt]
 * @property {string} [deadline]
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email
 * @property {string} password
 * @property {boolean} [remember]
 */

/**
 * @typedef {Object} RegisterData
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} password_confirmation
 * @property {string} [universityId]
 * @property {string} [department]
 * @property {string} [phone]
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token
 * @property {string} [refreshToken]
 * @property {User} user
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} totalUsers
 * @property {number} totalComplaints
 * @property {number} pendingComplaints
 * @property {number} resolvedComplaints
 * @property {number} activeStaff
 * @property {number} avgResolutionTime
 * @property {number} satisfactionRate
 * @property {number} escalatedCount
 */

/**
 * @typedef {Object} TrendData
 * @property {string} date
 * @property {number} submitted
 * @property {number} resolved
 */

// Export empty object to make this a module
export default {};