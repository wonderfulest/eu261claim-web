import pool from '../models/db';
import { RowDataPacket } from 'mysql2';

export interface CompensableFlight {
  id: number;
  flightNumber: string;
  airlineName: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  actualDeparture: string | null;
  actualArrival: string | null;
  cabinClass: string | null;
  cabinCode: string | null;
  compensationMin: number;
  compensationMax: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FlightSearchParams {
  flightNumber?: string;
  airlineName?: string;
  scheduledDepartureDate?: string;
  actualDepartureDate?: string;
  page?: number;
  size?: number;
}

export interface FlightSearchResponse {
  flights: CompensableFlight[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export class FlightService {
  /**
   * Search flights with filters and pagination
   */
  async searchFlights(params: FlightSearchParams): Promise<FlightSearchResponse> {
    const {
      flightNumber,
      airlineName,
      scheduledDepartureDate,
      actualDepartureDate,
      page = 0,
      size = 10
    } = params;

    // Build WHERE clause
    const conditions: string[] = ['is_active = TRUE'];
    const values: any[] = [];

    if (flightNumber) {
      conditions.push('flight_number LIKE ?');
      values.push(`%${flightNumber}%`);
    }

    if (airlineName) {
      conditions.push('airline_name LIKE ?');
      values.push(`%${airlineName}%`);
    }

    if (scheduledDepartureDate) {
      conditions.push('DATE(scheduled_departure) = ?');
      values.push(scheduledDepartureDate);
    }

    if (actualDepartureDate) {
      conditions.push('DATE(actual_departure) = ?');
      values.push(actualDepartureDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total records
    const countQuery = `SELECT COUNT(*) as total FROM compensable_flights ${whereClause}`;
    const [countRows] = await pool.query<RowDataPacket[]>(countQuery, values);
    const totalElements = countRows[0].total;
    const totalPages = Math.ceil(totalElements / size);

    // Get paginated results
    const offset = page * size;
    const dataQuery = `
      SELECT 
        id, flight_number, airline_name,
        scheduled_departure, scheduled_arrival,
        actual_departure, actual_arrival,
        cabin_class, cabin_code,
        compensation_min, compensation_max,
        is_active, created_at, updated_at
      FROM compensable_flights
      ${whereClause}
      ORDER BY scheduled_departure DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query<RowDataPacket[]>(dataQuery, [...values, size, offset]);

    const flights: CompensableFlight[] = rows.map(row => ({
      id: row.id,
      flightNumber: row.flight_number,
      airlineName: row.airline_name,
      scheduledDeparture: row.scheduled_departure,
      scheduledArrival: row.scheduled_arrival,
      actualDeparture: row.actual_departure,
      actualArrival: row.actual_arrival,
      cabinClass: row.cabin_class,
      cabinCode: row.cabin_code,
      compensationMin: row.compensation_min,
      compensationMax: row.compensation_max,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    return {
      flights,
      currentPage: page,
      pageSize: size,
      totalElements,
      totalPages
    };
  }

  /**
   * Get all active flights (for initial load)
   */
  async getAllActiveFlights(): Promise<CompensableFlight[]> {
    const query = `
      SELECT 
        id, flight_number, airline_name,
        scheduled_departure, scheduled_arrival,
        actual_departure, actual_arrival,
        cabin_class, cabin_code,
        compensation_min, compensation_max,
        is_active, created_at, updated_at
      FROM compensable_flights
      WHERE is_active = TRUE
      ORDER BY scheduled_departure DESC
    `;

    const [rows] = await pool.query<RowDataPacket[]>(query);

    return rows.map(row => ({
      id: row.id,
      flightNumber: row.flight_number,
      airlineName: row.airline_name,
      scheduledDeparture: row.scheduled_departure,
      scheduledArrival: row.scheduled_arrival,
      actualDeparture: row.actual_departure,
      actualArrival: row.actual_arrival,
      cabinClass: row.cabin_class,
      cabinCode: row.cabin_code,
      compensationMin: row.compensation_min,
      compensationMax: row.compensation_max,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }
}

export const flightService = new FlightService();
