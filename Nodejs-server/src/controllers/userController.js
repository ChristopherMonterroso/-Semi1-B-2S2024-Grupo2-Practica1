// controllers/userController.js
const { Op } = require("sequelize");
const AWS = require('aws-sdk');
const multer = require('multer');
const User = require("../models/user");
const bcrypt = require("bcrypt");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// Configura Multer para manejar la carga de archivos
const upload = multer({ storage: multer.memoryStorage() }).single('profilePhoto');

const createUser = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Error uploading file", error: err , status: false});
    }
    console.log(req.file);
    try {
      const { name, lastName, email, password, birthdate } = req.body;
      const rol = "Sub";
      
      if (!name || !email || !password || !lastName || !birthdate || !req.file) {
        return res.status(400).json({ message: "All fields are required" , status: false});
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" , status: false});
      }

      // Encrypt password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Subir imagen a S3
      const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: `Fotos/${Date.now()}_${req.file.originalname}`, 
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const data = await s3.upload(uploadParams).promise();

      const user = await User.create({
        name,
        lastName,
        email,
        password: hashedPassword, 
        birthdate,
        rol,
        profilePhoto: data.Location // Guarda la URL de la imagen en la base de datos
      });

      res.status(201).json({ message: "User created successfully", user, status: true });
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error, status: false });
    }
  });
};



const updateUser = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Error uploading file", error: err, status: false });
    }

    try {
      const { id } = req.params;
      const { name, lastName, email, password } = req.body;

      if (!password) {
        return res.status(400).json({ message: "Password is required", status: false });
      }
      if (!id) {
        return res.status(400).json({ message: "User ID is required", status: false });
      }
      if (id === 1) {
        return res.status(400).json({ message: "You cannot update the admin user", status: false });
      }

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found", status: false });
      }
      if (email){
        const isEmailInUse = await User.findOne({ where: { email, id: { [Op.ne]: id } } });
        if (isEmailInUse) {
          return res.status(400).json({ message: "Email already in use", status: false });
        }
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Incorrect password",  status: false});
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (lastName) updateData.lastName = lastName;
      if (email) updateData.email = email;

      // Si se sube una nueva imagen de perfil
      if (req.file) {
        const uploadParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: `Fotos/U_${Date.now()}_${req.file.originalname}`,
          Body: req.file.buffer,
          ContentType: req.file.mimetype
        };

        const data = await s3.upload(uploadParams).promise();
        updateData.profilePhoto = data.Location; // Guarda la nueva URL de la imagen en la base de datos
      }

      // Solo actualiza si hay algo que actualizar
      if (Object.keys(updateData).length > 0) {
        await User.update(updateData, { where: { id } });
        return res.status(200).json({ message: "User updated successfully", status: true });
      } else {
        return res.status(400).json({ message: "No fields to update", status: false });
      }

    } catch (error) {
      return res.status(500).json({ message: "Error updating user", error, status: false });
    }
  });
};


const authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required", status: false });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found",  status: false});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password", status: false });
    }

    res.status(200).json({ message: "User authenticated successfully", user , status: true});
  } catch (error) {
    res.status(500).json({ message: "Error authenticating user", error, status: false });
  }
}



const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ users, status: true });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error, status: false });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "User ID is required", status: false });  
    }
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully", status: true});
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error, status: false });
  }
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  authenticateUser
};
