// controllers/fileController.js
const path = require("path");
const fs = require("fs");

module.exports = {
  uploadFile: async (req, res) => {
    const file = req.file; // multer puts uploaded file here
    const { folderId } = req.body;

    if (!file) return res.redirect("back");

    await req.prisma.file.create({
      data: {
        name: file.originalname,
        size: file.size,
        path: file.path,
        url: `/uploads/${file.filename}`,
        folderId: parseInt(folderId),
        userId: req.user.id,
      },
    });

    res.redirect(`/folders/${folderId}`);
  },

  downloadFile: async (req, res) => {
    const { id } = req.params;
    const file = await req.prisma.file.findUnique({ where: { id: parseInt(id) } });

    if (!file) return res.status(404).render("404");

    res.download(path.resolve(file.path), file.name);
  },

  deleteFile: async (req, res) => {
    const { id } = req.params;
    const file = await req.prisma.file.findUnique({ where: { id: parseInt(id) } });

    if (!file) return res.status(404).render("404");

    // Remove from filesystem
    fs.unlinkSync(file.path);

    // Remove from DB
    await req.prisma.file.delete({ where: { id: parseInt(id) } });

    res.redirect("back");
  },
};
