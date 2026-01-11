// controllers/folderController.js
exports.list = (prisma) => async (req, res) => {
  const folders = await prisma.folder.findMany({
    where: { userId: req.user.id },
    include: { files: true },
    orderBy: { createdAt: "desc" },
  });

  res.render("index", { user: req.user, folders });
};

exports.create = (prisma) => async (req, res) => {
  await prisma.folder.create({
    data: { name: req.body.name, userId: req.user.id },
  });
  res.redirect("/");
};

exports.details = (prisma) => async (req, res) => {
  const folder = await prisma.folder.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id },
    include: { files: true },
  });

  if (!folder) return res.status(404).render("404", { user: req.user });
  res.render("folder", { user: req.user, folder });
};
