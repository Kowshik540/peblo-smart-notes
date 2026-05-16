import Note from '../models/Note.js';
import crypto from 'crypto';

export const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user.id }).sort({ updatedAt: -1 });
  res.json(notes);
};

export const createNote = async (req, res) => {
  const note = await Note.create({
    user: req.user.id,
    ...req.body
  });
  res.json(note);
};

export const updateNote = async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );
  res.json(note);
};

export const shareNote = async (req, res) => {
  const shareId = crypto.randomBytes(8).toString('hex');

  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { isPublic: true, shareId },
    { new: true }
  );

  res.json(note);
};

export const getSharedNote = async (req, res) => {
  const note = await Note.findOne({ shareId: req.params.shareId, isPublic: true });

  if (!note) return res.status(404).json({ message: 'Not found' });

  res.json(note);
};