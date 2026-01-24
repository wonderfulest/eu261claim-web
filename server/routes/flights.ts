import { Router, Request, Response } from 'express';
import { flightService } from '../services/FlightService';

const router = Router();

/**
 * GET /api/flights/search
 * Search flights with filters and pagination
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    console.log('🔍 Flight search request received:', req.query);
    
    const {
      flightNumber,
      airlineName,
      scheduledDepartureDate,
      actualDepartureDate,
      page = '0',
      size = '10'
    } = req.query;

    const result = await flightService.searchFlights({
      flightNumber: flightNumber as string,
      airlineName: airlineName as string,
      scheduledDepartureDate: scheduledDepartureDate as string,
      actualDepartureDate: actualDepartureDate as string,
      page: parseInt(page as string, 10),
      size: parseInt(size as string, 10)
    });

    console.log('✅ Flight search successful, found:', result.totalElements, 'flights');
    res.json(result);
  } catch (error) {
    console.error('❌ Error searching flights:', error);
    res.status(500).json({ error: 'Failed to search flights', details: (error as Error).message });
  }
});

export default router;
