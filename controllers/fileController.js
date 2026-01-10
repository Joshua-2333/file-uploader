// controllers/fileController.js
const path = require("path");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  async uploadFile(req, res) {
    const file = req.file;
    const folderId = parseInt(req.body.folderId);

    if (!file) return res.redirect("back");

    await prisma.file.create({
      data: {
        name: file.originalname,
        size: file.size,
        path: file.path,
        url: `/uploads/${file.filename}`,
        folderId,
        userId: req.user.id,
      },
    });

    res.redirect(`/folders/${folderId}`);
  },

  async downloadFile(req, res) {
    const id = parseInt(req.params.id);

    const file = await prisma.file.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!file) {
      return res.status(404).render("404", { user: req.user });
    }

    res.download(path.resolve(file.path), file.name);
  },

  async deleteFile(req, res) {
    const id = parseInt(req.params.id);

    const file = await prisma.file.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!file) {
      return res.status(404).render("404", { user: req.user });
    }

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    await prisma.file.delete({ where: { id } });

    res.redirect("back");
  },
};
