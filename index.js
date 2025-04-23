require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("./generated/prisma");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.post("/api/user", async (req, res) => {
  const { name, gstin, pan } = req.body;

  try {
    const user = await prisma.user.create({
      data: { name, gstin, pan },
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/search/gstin/:gstin", async (req, res) => {
  const { gstin } = req.params;
  const user = await prisma.user.findFirst({ where: { gstin } });
  res.json(user || { message: "No user found with this GSTIN" });
});

app.get("/api/search/pan/:pan", async (req, res) => {
  const { pan } = req.params;
  const user = await prisma.user.findFirst({ where: { pan } });
  res.json(user || { message: "No user found with this PAN" });
});

const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => res.send(`Server listing on port ${PORT}`));

app.listen(PORT, () =>
  console.log(`Server running on ${PORT}`)
);