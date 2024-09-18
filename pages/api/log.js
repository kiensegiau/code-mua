export default function handler(req, res) {
    if (req.method === 'POST') {
      console.log('Client log:', req.body);
      res.status(200).json({ message: 'Log received' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }