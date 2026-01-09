// controllers/folderController.js
module.exports = {
  // List all folders for logged-in user
  listFolders: async (req, res) => {
    const folders = await req.prisma.folder.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: { files: true },
    });
    res.render("index", { folders });
  },

  // Render folder page with files
  folderDetails: async (req, res) => {
    const { id } = req.params;
    const folder = await req.prisma.folder.findUnique({
      where: { id: parseInt(id) },
      include: { files: true },
    });

    if (!folder) return res.status(404).render("404");

    res.render("folder", { folder });
  },

  // Create a new folder
  createFolder: async (req, res) => {
    const { name } = req.body;
    if (!name) return res.redirect("/");

    await req.prisma.folder.create({
      data: { name, userId: req.user.id },
    });

    res.redirect("/");
  },

  // Delete a folder and its files
  deleteFolder: async (req, res) => {
    const { id } = req.params;

    // Delete files inside the folder
    await req.prisma.file.deleteMany({ where: { folderId: parseInt(id) } });

    // Delete the folder
    await req.prisma.folder.delete({ where: { id: parseInt(id) } });

    res.redirect("/");
  },
};
