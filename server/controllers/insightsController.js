import Note from '../models/Note.js';

export const getInsights = async (req, res) => {
  const notes = await Note.find({ user: req.user.id });

  const tagCount = {};
  let aiUsage = 0;

  notes.forEach((note) => {
    aiUsage += note.aiUsageCount;
    note.tags.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  res.json({
    totalNotes: notes.length,
    archivedNotes: notes.filter((n) => n.archived).length,
    aiUsage,
    mostUsedTags: tagCount,
    recentNotes: notes
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 5)
  });
};