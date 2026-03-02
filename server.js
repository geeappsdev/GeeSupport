import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let station = {
  name: "Lofi Beats",
  url: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1",
  isCustom: false
};

app.get('/api/station', (req, res) => {
  res.json(station);
});

app.post('/api/station', (req, res) => {
  const { name, url, isCustom } = req.body;
  if(url) {
    station = { name: name || "Custom Station", url, isCustom: !!isCustom };
  }
  res.json(station);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
