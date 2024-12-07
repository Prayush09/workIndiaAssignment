import Train from '../models/train.js';
import logger from '../config/logger.js';


export default {
  async create(req, res) {
    try {
      const train = await Train.create(req.body);
      res.status(201).json(train);
    } catch (error) {
      logger.error('Train creation error:', error);
      res.status(500).json({ message: 'Failed to create train' });
    }
  },

  async seatCount(req, res){
    try{
      const { trainId } = req.body;
      const seatCount = await Train.seatCount(trainId);
      res.status(200).json({SeatCount: seatCount});
    }catch(error){
      logger.error('Seat Count error:', error);
      res.status(500).json({message:"Failed to fetch count!"})
    }
  },

  async search(req, res) {
    try {
      const { source, destination } = req.body;
      console.log(source)
      const trains = await Train.findByRoute(source, destination);
      res.json(trains);
    } catch (error) {
      logger.error('Train search error:', error);
      res.status(500).json({ message: 'Failed to search trains' });
    }
  },

  async updateSeats(req, res) {
    try {
      const { trainId } = req.params;
      const { seats } = req.body;
      const train = await Train.updateSeats(trainId, seats);
      res.json(train);
    } catch (error) {
      logger.error('Seat update error:', error);
      res.status(500).json({ message: 'Failed to update seats' });
    }
  }
};