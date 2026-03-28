import express from "express";
import { Template } from "../modules/template.model.js";

const router = express.Router();


// ✅ CREATE TEMPLATE
router.post("/", async (req, res) => {
  try {
    const template = await Template.create(req.body);
    res.json(template);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create template" });
  }
});


// ✅ GET ALL TEMPLATES
router.get("/", async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch templates" });
  }
});


// ✅ UPDATE TEMPLATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await Template.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});


// ✅ DELETE TEMPLATE
router.delete("/:id", async (req, res) => {
  try {
    await Template.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete template" });
  }
});


export default router;