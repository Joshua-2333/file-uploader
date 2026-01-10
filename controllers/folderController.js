// controllers/folderController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  async listFolders(req, res) {
    const folders = await prisma.folder.findMany({
      where: { userId: req.user.id },
      include: { files: true },
      orderBy: { createdAt: "desc" },
    });

    res.render("index", {
      user: req.user,
      folders,
    });
  },

  async folderDetails(req, res) {
    const id = parseInt(req.params.id);

    const folder = await prisma.folder.findFirst({
      where: { id, userId: req.user.id },
      include: { files: true },
    });

    if (!folder) {
      return res.status(404).render("404", { user: req.user });
    }

    res.render("folder", {
      user: req.user,
      folder,
    });
  },

  async createFolder(req, res) {
    const { name } = req.body;
    if (!name) return res.redirect("/");

    await prisma.folder.create({
      data: {
        name,
        userId: req.user.id,
      },
    });

    res.redirect("/");
  },

  async deleteFolder(req, res) {
    const id = parseInt(req.params.id);

    await prisma.file.deleteMany({
      where: { folderId: id },
    });

    await prisma.folder.delete({
      where: { id },
    });

    res.redirect("/");
  },
};
