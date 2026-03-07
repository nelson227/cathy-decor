import { body, validationResult, param, query } from 'express-validator';

// Validation error handler middleware
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Register validation rules
export const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom est obligatoire')
];

// Login validation rules
export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est obligatoire')
];

// Create/Update decoration validation
export const validateDecoration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom est obligatoire'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('La description est obligatoire'),
  body('category')
    .isIn(['mariage', 'anniversaire', 'baby-shower', 'bapteme', 'funeraire', 'corporate', 'exterieur', 'interieur'])
    .withMessage('Catégorie invalide'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Le prix doit être un nombre positif')
];

// Create/Update salle validation
export const validateSalle = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom est obligatoire'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('La description est obligatoire'),
  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('La ville est obligatoire'),
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('L\'adresse est obligatoire'),
  body('capacity.min')
    .isInt({ min: 1 })
    .withMessage('Capacité minimale invalide'),
  body('capacity.max')
    .isInt({ min: 1 })
    .withMessage('Capacité maximale invalide'),
  body('pricePerDay')
    .isFloat({ min: 0 })
    .withMessage('Le prix par jour doit être un nombre positif')
];

// Create commande validation
export const validateCommande = [
  body('customer.name')
    .trim()
    .notEmpty()
    .withMessage('Le nom du client est obligatoire'),
  body('customer.phone')
    .matches(/^[0-9\s\-\+\(\)]+$/)
    .withMessage('Numéro de téléphone invalide'),
  body('customer.email')
    .isEmail()
    .withMessage('Email invalide'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Au moins un article est requis'),
  body('event.type')
    .trim()
    .notEmpty()
    .withMessage('Le type d\'événement est obligatoire')
];

// Create testimonial validation
export const validateTestimonial = [
  body('author')
    .trim()
    .notEmpty()
    .withMessage('Le nom de l\'auteur est obligatoire'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Le contenu doit contenir au moins 10 caractères'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('La note doit être entre 1 et 5')
];

// Pagination validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page doit être un nombre positif'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit doit être entre 1 et 100')
];

// ID validation
export const validateId = [
  param('id')
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage('ID invalide')
];

// Price range validation
export const validatePriceRange = [
  query('priceMin')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Prix minimum invalide'),
  query('priceMax')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Prix maximum invalide')
];
