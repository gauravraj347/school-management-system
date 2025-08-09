const Joi = require('joi');
const { addSchool, getAllSchools } = require('../models/schoolModel');
const { haversineDistance } = require('../utils/distance');

const addSchoolSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required(),
  address: Joi.string().trim().min(1).max(500).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required()
});

const listSchoolsSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required()
});

async function createSchool(req, res) {
  try {
    const { error, value } = addSchoolSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const id = await addSchool(value);
    res.status(201).json({ success: true, message: 'School added', data: { id } });
  } catch (err) {
    console.error('createSchool error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function listSchools(req, res) {
  try {
    const { error, value } = listSchoolsSchema.validate(req.query);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { latitude, longitude } = value;
    const schools = await getAllSchools();

    const schoolsWithDistance = schools.map(school => ({
      ...school,
      distance_km: Number(
        haversineDistance(latitude, longitude, school.latitude, school.longitude).toFixed(4)
      )
    }));

    schoolsWithDistance.sort((a, b) => a.distance_km - b.distance_km);

    res.json({ success: true, count: schoolsWithDistance.length, data: schoolsWithDistance });
  } catch (err) {
    console.error('listSchools error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = { createSchool, listSchools };
