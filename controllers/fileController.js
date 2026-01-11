// controllers/fileController.js
const fs = require("fs");
const path = require("path");

exports.upload = (prisma) => async (req, res) => {
  const folderId = Number(req.body.folderId);

  await prisma.file.create({
    data: {
      name: req.file.originalname,
      size: req.file.size,
      path: req.file.path,
      url: `/uploads/${req.file.filename}`,
      folderId,
      userId: req.user.id,
    },
  });

  res.redirect(`/folders/${folderId}`);
};

exports.download = (prisma) => async (req, res) => {
  const file = await prisma.file.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id },
  });

  if (!file) return res.status(404).render("404", { user: req.user });
  res.download(path.resolve(file.path), file.name);
};

exports.delete = (prisma) => async (req, res) => {
  const file = await prisma.file.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id },
  });

  if (!file) return res.status(404).render("404", { user: req.user });

  if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
  await prisma.file.delete({ where: { id: file.id } });

  res.redirect("back");
};
