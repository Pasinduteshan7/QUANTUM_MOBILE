import mongoose from 'mongoose';
import Ecosystem from '../models/Ecosystem.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * @desc    Get all active ecosystems (Public)
 * @route   GET /api/ecosystems
 * @access  Public
 */
export const getAllEcosystems = async (req, res, next) => {
  try {
    const ecosystems = await Ecosystem.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 });
    return sendSuccess(res, 200, 'Ecosystems retrieved successfully', ecosystems);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single ecosystem by brand slug (Public)
 * @route   GET /api/ecosystems/:slug
 * @access  Public
 */
export const getEcosystemBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slug.toLowerCase().trim();
    const ecosystem = await Ecosystem.findOne({ slug, isActive: true });

    if (!ecosystem) {
      return sendError(res, 404, `Ecosystem '${slug}' not found`);
    }

    return sendSuccess(res, 200, 'Ecosystem details retrieved', ecosystem);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Create new Brand Ecosystem
 * @route   POST /api/ecosystems
 * @access  Private / Admin
 */
export const createEcosystem = async (req, res, next) => {
  try {
    const {
      name,
      brand,
      slug,
      tagline,
      headline,
      description,
      accentColor,
      badgeText,
      emblem,
      logoUrl,
      heroTitleMain,
      heroTitleSub,
      heroImage,
      heroVideo,
      videoTitle,
      videoDuration,
      flagship,
      subCategories,
      bundle
    } = req.body;

    const formattedSlug = (slug || brand || name || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '-');

    if (!formattedSlug) {
      return sendError(res, 400, 'Ecosystem slug / brand identifier is required');
    }

    const existing = await Ecosystem.findOne({ slug: formattedSlug });
    if (existing) {
      return sendError(res, 400, `An ecosystem with slug '${formattedSlug}' already exists.`);
    }

    const newEcosystem = await Ecosystem.create({
      slug: formattedSlug,
      name: name || `${brand} Ecosystem`,
      brand: brand || name,
      tagline: tagline || '',
      headline: headline || `Experience the ${brand} Universe`,
      description: description || '',
      accentColor: accentColor || '#0284c7',
      badgeText: badgeText || `${(brand || name).toUpperCase()} FLAGSHIP • DIALOG 5G`,
      emblem: emblem || '✦',
      logoUrl: logoUrl || '',
      heroTitleMain: heroTitleMain || flagship?.name || brand,
      heroTitleSub: heroTitleSub || tagline || 'Engineered for Perfection',
      heroImage: heroImage || flagship?.finishes?.[0]?.image || '/accessories.jpg',
      heroVideo: heroVideo || '',
      videoTitle: videoTitle || `${brand} — Official Keynote Film`,
      videoDuration: videoDuration || '0:45 • 4K HDR',
      flagship: flagship || {
        name: `${brand} Flagship`,
        badge: 'LATEST FLAGSHIP',
        price: 250000,
        finishes: [],
        specs: []
      },
      subCategories: subCategories && subCategories.length > 0 ? subCategories : [
        { id: 'phones', label: 'Phones', icon: '📱' },
        { id: 'watch', label: 'Watch', icon: '⌚' },
        { id: 'audio', label: 'Audio', icon: '🎧' },
        { id: 'chargers', label: 'Chargers & Power', icon: '⚡' },
        { id: 'cases', label: 'Cases & Protection', icon: '🛡️' }
      ],
      bundle: bundle || {
        name: `${brand} Ultimate Ecosystem Trio`,
        price: 320000,
        savings: 25000,
        image: heroImage || '/accessories.jpg'
      }
    });

    // Create Audit Log
    await AuditLog.create({
      user: req.user?._id,
      userName: req.user?.name || 'Store Admin',
      userRole: req.user?.role || 'admin',
      action: 'ECOSYSTEM_CREATE',
      target: `${newEcosystem.name} (${newEcosystem.slug})`,
      details: {
        slug: newEcosystem.slug,
        brand: newEcosystem.brand,
        flagship: newEcosystem.flagship?.name,
        hasHeroVideo: !!newEcosystem.heroVideo
      },
      level: 'success',
      ip: req.ip
    });

    return sendSuccess(res, 201, 'Brand Ecosystem created successfully', newEcosystem);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Update Brand Ecosystem
 * @route   PUT /api/ecosystems/:id
 * @access  Private / Admin
 */
export const updateEcosystem = async (req, res, next) => {
  try {
    const query = mongoose.Types.ObjectId.isValid(req.params.id)
      ? { _id: req.params.id }
      : { slug: req.params.id.toLowerCase() };

    const updated = await Ecosystem.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return sendError(res, 404, 'Ecosystem not found');
    }

    // Create Audit Log
    await AuditLog.create({
      user: req.user?._id,
      userName: req.user?.name || 'Store Admin',
      userRole: req.user?.role || 'admin',
      action: 'ECOSYSTEM_UPDATE',
      target: `${updated.name} (${updated.slug})`,
      details: {
        ecosystemId: updated._id,
        updatedKeys: Object.keys(req.body)
      },
      level: 'info',
      ip: req.ip
    });

    return sendSuccess(res, 200, 'Ecosystem updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Delete / Deactivate Brand Ecosystem
 * @route   DELETE /api/ecosystems/:id
 * @access  Private / Admin
 */
export const deleteEcosystem = async (req, res, next) => {
  try {
    const query = mongoose.Types.ObjectId.isValid(req.params.id)
      ? { _id: req.params.id }
      : { slug: req.params.id.toLowerCase() };

    const ecosystem = await Ecosystem.findOne(query);
    if (!ecosystem) {
      return sendError(res, 404, 'Ecosystem not found');
    }

    await Ecosystem.findOneAndDelete(query);

    // Create Audit Log
    await AuditLog.create({
      user: req.user?._id,
      userName: req.user?.name || 'Store Admin',
      userRole: req.user?.role || 'admin',
      action: 'ECOSYSTEM_DELETE',
      target: `${ecosystem.name} (${ecosystem.slug})`,
      details: { slug: ecosystem.slug, brand: ecosystem.brand },
      level: 'warning',
      ip: req.ip
    });

    return sendSuccess(res, 200, `Ecosystem '${ecosystem.name}' deleted successfully`);
  } catch (error) {
    next(error);
  }
};

