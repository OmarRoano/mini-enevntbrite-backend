import * as Events from '../services/event.service.js';
import { Ticket } from '../models/Ticket.js';

export async function list(req, res, next) {
  try {
    const items = await Events.listPublished();
    res.json({ items });
  } catch (e) { next(e); }
}

export async function get(req, res, next) {
  try {
    const item = await Events.getById(req.params.id);
    res.json({ item });
  } catch (e) { next(e); }
}

export async function getOccupied(req, res, next) {
  try {
    const { eventId } = req.params; 

    const seatsOccupied = await Ticket.find(
      { event: eventId },                      
      { 'seat.row': 1, 'seat.col': 1, _id: 0 } 
    ).lean();

    const occupied = seatsOccupied.map(t => ({
      row: t.seat.row,
      col: t.seat.col
    }));

    res.json({ occupied });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const item = await Events.createEvent(req.body, req.user.sub);
    res.status(201).json({ item });
  } catch (e) { next(e); }
}
