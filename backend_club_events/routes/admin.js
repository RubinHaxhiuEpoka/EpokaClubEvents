var express = require("express");
var router = express.Router();
const db = require("../db");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const secretKey = "your_secret_key";
const { body, validationResult } = require('express-validator');

router.delete("/students/:id", async (req, res) => {
    const { id } = req.params;
  try {
    await db.query("DELETE FROM students WHERE student_id = $1", [id]);
    res
    .status(200)
    .json({ message: "Student and all related data deleted successfully" });
} catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the student" });
    }
});

router.put('/students/:id', async (req, res) => {
    const { id } = req.params;
    const { student_name, student_surname, student_email, student_password, isPasswordChanged } = req.body;
    
    try {
      let newPasswordHash = student_password;
        if (isPasswordChanged) {
          newPasswordHash = await bcrypt.hash(student_password, 10);
        }
      await db.query(
        'UPDATE students SET student_name = $1, student_surname = $2, student_email = $3, student_password = $4 WHERE student_id = $5',
        [student_name, student_surname, student_email, newPasswordHash, id]
      );
      res.status(200).json({ message: 'Student updated successfully' });
    } catch (err) {
        console.error(err);
      res.status(500).json({ error: 'An error occurred while updating the student' });
    }
});

router.get("/clubpresident", async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM club_presidents");
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while fetching students" });
    }
});

router.post('/president_post',

  [
    body('club_name').notEmpty().withMessage('Name is required'),
    body('president_email').isEmail().withMessage('Email is not valid'),
    body('president_password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  ],

  async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
  const { club_name, president_email, president_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(president_password, 10);

    const result = await db.query(
      "INSERT INTO club_presidents (club_name, president_email, president_password) VALUES ($1, $2, $3)",
      [club_name, president_email, hashedPassword]
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while creating president" });
  }

})

router.put('/clubpresidents/:id', async (req, res) => {
    const { id } = req.params;
    const { club_name, president_email, president_password, isPasswordChanged } = req.body;
  
    try {
        let newPasswordHash = president_password;
        if (isPasswordChanged) {
          newPasswordHash = await bcrypt.hash(president_password, 10);
        }
      await db.query(
        'UPDATE club_presidents SET club_name = $1, president_email = $2, president_password = $3 WHERE president_id = $4',
        [club_name,  president_email, newPasswordHash, id]
      );
      res.status(200).json({ message: 'Club president updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while updating the club president' });
    }
});

router.delete('/clubpresidents/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM club_presidents WHERE president_id = $1', [id]);
      res.status(200).json({ message: 'Club president and all related data deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while deleting the club president' });
    }
});

router.put('/events/:id', upload.single('event_image'), async (req, res) => {
    const { id } = req.params;
    const { event_title, event_description, event_room, event_date, event_quotas } = req.body;
    const event_image = req.file ? req.file.filename : null;

    try {
        if (event_image) {
            await db.query(
                'UPDATE events SET event_title = $1, event_description = $2, event_image = $3, event_room = $4, event_date = $5, event_quotas = $6 WHERE event_id = $7',
                [event_title, event_description, event_image, event_room, event_date, event_quotas, id]
            );
        } else {
            const currentEvent = await db.query('SELECT event_image FROM events WHERE event_id = $1', [id]);
            const currentImage = currentEvent.rows[0].event_image;

            await db.query(
                'UPDATE events SET event_title = $1, event_description = $2, event_image = $3, event_room = $4, event_date = $5, event_quotas = $6 WHERE event_id = $7',
                [event_title, event_description, currentImage, event_room, event_date, event_quotas, id]
            );
        }
        res.status(200).json({ message: 'Event updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the Event' });
    }
});

router.delete('/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM events WHERE event_id = $1', [id]);
    res.status(200).json({ message: 'Events deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while deleting the club president' });
  }
});

router.get('/event_ratings', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM event_rating');
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching event ratings' });
    }
});

router.delete('/event_ratings/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM event_rating WHERE rating_id = $1', [id]);
      res.status(200).json({ message: 'Event rating deleted successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while trying to delete the event.' });
    }
});

router.post('/admin-login', async (req, res) => {
    const { admin_username, admin_password } = req.body;
  
    try {
      
      const result = await db.query(
        "SELECT * FROM admin WHERE admin_username = $1",
        [admin_username]
      );
  
      if (result.rows.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      const admin = result.rows[0];
  
          const isMatch = await bcrypt.compare(admin_password, admin.admin_password);
  
          if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
          }
  
      const token = jwt.sign({ admin_id: admin.admin_id }, secretKey, {expiresIn: '1h'});
  
      res.json({ token })
  
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "An error occurred while logging in" })
    }
  })

module.exports = router;
