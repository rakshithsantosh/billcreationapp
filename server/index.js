
const express = require('express');
const cors = require('cors');
const documentRoutes = require('./routes/documentRoutes');

const app = express();
// Force Restart Trigger
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', documentRoutes);

app.get('/', (req, res) => {
  res.send('Bill & Quotation API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
