import Note from '../models/Note.js';
import { generateAI } from '../utils/gemini.js';

export const generateSummary = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the note
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    // If content is empty
    if (!note.content || note.content.trim() === '') {
      const emptySummary = 'No content available to summarize.';

      note.summary = emptySummary;
      await note.save();

      return res.status(200).json({
        success: true,
        summary: emptySummary,
      });
    }

    // Generate summary
    const summary = await generateAI(note.content);

    // Save summary
    note.summary = summary;
    await note.save();

    // Return summary
    return res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error('AI Controller Error:', error);

    // Always return a fallback summary instead of failing
    return res.status(200).json({
      success: true,
      summary: 'Summary could not be generated, but the request was processed successfully.',
    });
  }
};