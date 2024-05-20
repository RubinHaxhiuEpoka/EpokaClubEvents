var express = require("express");
var router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const secretKey = "your_secret_key";
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", 
[
  body('student_name').notEmpty().withMessage('Name is required'),
  body('student_surname').notEmpty().withMessage('Surname is required'),
  body('student_email').isEmail().withMessage('Email is not valid'),
  body('student_password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
],

async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { student_name, student_surname, student_email, student_password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(student_password, 10);

    const result = await db.query(
      "INSERT INTO students (student_name, student_surname, student_email, student_password) VALUES ($1, $2, $3, $4) RETURNING student_id",
      [student_name, student_surname, student_email, hashedPassword]
    );

      const token = jwt.sign({ student_id: result.rows[0].student_id }, secretKey, { expiresIn: '1h' })

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while signing up" });
  }
});

router.get('/signup', async (req, res) => {
  try {
      const result = await db.query('SELECT * FROM students ORDER BY student_id DESC');
      res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching students' })
  }
})

router.post('/login', async (req, res) => {
  const { student_email, student_password } = req.body;

  try {
    
    const result = await db.query(
      "SELECT * FROM students WHERE student_email = $1",
      [student_email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const student = result.rows[0];

        const isMatch = await bcrypt.compare(student_password, student.student_password);

        if (!isMatch) {
          return res.status(401).json({ error: "Invalid email or password" });
        }

    const token = jwt.sign({ student_id: student.student_id }, secretKey, {expiresIn: '1h'});

    res.json({ token })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "An error occurred while logging in" })
  }
})

router.post('/presidentlogin', async (req, res) => {
  const { president_email, president_password } = req.body;

  try {
    
    const result = await db.query(
      "SELECT * FROM club_presidents WHERE president_email = $1",
      [president_email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const president = result.rows[0];

    const isMatch = await bcrypt.compare(president_password, president.president_password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ president_id: president.president_id }, secretKey, {expiresIn: '1h'});

    res.json({ token })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "An error occurred while logging in" })
  }
})

router.post('/events', upload.single('event_image'), async (req, res) => {
  
  const { event_title, event_description, event_room, event_date, event_quotas } = req.body
  const event_image = req.file.filename;

  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secretKey);
  const president_id = decodedToken.president_id;

  try {
    const result = await db.query(
      'INSERT INTO events (event_title, event_description, event_image, event_room, event_date, event_quotas, president_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
    [event_title, event_description, event_image, event_room, event_date, event_quotas, president_id]
      );

      res.status(201).json(result.rows[0])
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while inserting the event' })
  }

})

router.get('/events', async (req, res) => {
  try {
      const result = await db.query('SELECT * FROM events ORDER BY event_id DESC');
      res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching events' })
  }
})

router.post('/events/attend', async (req, res) => {
  const { eventId } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secretKey)
  const studentId = decodedToken.student_id;

  try {
    
    const result = await db.query(
      'INSERT INTO my_events (student_id, event_id) VALUES ($1, $2)',
      [studentId, eventId]
    );

    const updateQuotasResult = await db.query(
      'UPDATE events SET event_quotas = event_quotas - 1 WHERE event_id = $1',
      [eventId]
    )

      res.status(201).json({ message: 'Successfully attended the event' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while attending the event' });
  }
})

router.delete('/events/attend/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secretKey)
  const studentId = decodedToken.student_id;

  try {
    
    const result = await db.query(
      'DELETE FROM my_events WHERE student_id = $1 AND event_id = $2' ,
      [studentId, eventId]
    );

    const updateQuotasResult = await db.query(
      'UPDATE events SET event_quotas = event_quotas + 1 WHERE event_id = $1',
      [eventId]
    )

    res.status(200).json({ message: 'Successfully unattended the event' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while unattending the event' })
  }
})

router.get('/attendedEvents', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secretKey);
  const studentId = decodedToken.student_id;

  try {
    const result = await db.query(
      'SELECT event_id, president_confirmed FROM my_events WHERE student_id = $1',
      [studentId]
      );
      res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching attended events' })
  }
});

router.get('/president_events', async (req, res)=>{
  try {
    
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretKey);
    const presidentId = decodedToken.president_id;

    const result = await db.query('SELECT * FROM events WHERE president_id = $1 ORDER BY event_id DESC', [presidentId]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching events' })
  }
});

router.get('/event_attendees/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await db.query(
      `SELECT students.student_name, students.student_surname, my_events.president_confirmed, my_events.student_id
       FROM my_events
       JOIN students ON my_events.student_id = students.student_id
       WHERE my_events.event_id = $1`,
      [eventId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching attendees' });
  }
});

router.put('/confirm_attendance', async (req, res) => {
  try {
    const { eventId, studentId } = req.body;
    await db.query(
      'UPDATE my_events SET president_confirmed = true WHERE event_id = $1 AND student_id = $2',
      [eventId, studentId]
    );
    res.status(200).json({ message: 'Attendance confirmed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while confirming attendance' });
  }
});

router.post('/event/rating', async (req, res) => {
  const { eventId, rating_number, student_comment} = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secretKey);
  const studentId = decodedToken.student_id;

  try {
      await db.query(
          'INSERT INTO event_rating (rating_number, student_comment, student_id, event_id) VALUES ($1, $2, $3, $4)',
          [rating_number, student_comment, studentId, eventId,]
      );

      res.status(200).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while submitting feedback' });
  }
});


router.delete('/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM events WHERE event_id = $1', [id]);
    res.status(200).json({ message: 'Event and all related data deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while deleting the event' });
  }
});


module.exports = router;
