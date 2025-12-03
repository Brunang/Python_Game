import levelService from '../services/levelService.js';

// Get all levels
export const getAllLevels = async (req, res, next) => {
  try {
    const levels = await levelService.getAllLevels();
    res.json(levels);
  } catch (error) {
    next(error);
  }
};

// Get specific level
export const getLevel = async (req, res, next) => {
  try {
    const { id } = req.params;

    const level = await levelService.getLevelById(id);
    if (!level) {
      return res.status(404).json({ error: 'Level not found' });
    }

    res.json(level);
  } catch (error) {
    next(error);
  }
};

// Create a new level
export const createLevel = async (req, res, next) => {
  try {
    const { title, description, level_number, difficulty, theme, character_name } = req.body;

    if (!title || !level_number) {
      return res.status(400).json({ error: 'Title and level_number are required' });
    }

    const result = await levelService.createLevel(
      title,
      description,
      level_number,
      difficulty,
      theme,
      character_name
    );

    res.status(201).json({
      message: 'Level created successfully',
      id: result.id,
    });
  } catch (error) {
    next(error);
  }
};

// Update a level
export const updateLevel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    await levelService.updateLevel(id, updateData);
    res.json({ message: 'Level updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Delete a level
export const deleteLevel = async (req, res, next) => {
  try {
    const { id } = req.params;

    await levelService.deleteLevel(id);
    res.json({ message: 'Level deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export default { getAllLevels, getLevel, createLevel, updateLevel, deleteLevel };
