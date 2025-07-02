import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	const sessionId = params.id;

	try {
		const session = await prisma.session.findUnique({
			where: { id: sessionId },
			include: {
				hall: true,
			},
		});

		if (!session) {
			return NextResponse.json({ error: 'Сеанс не знайдено' }, { status: 404 });
		}

		const allSeats = await prisma.seat.findMany({
			where: { hallId: session.hallId },
		});

		const takenTickets = await prisma.ticket.findMany({
			where: { sessionId },
			select: { seatId: true },
		});

		const takenSeatIds = takenTickets.map((t) => t.seatId);

		// групуємо по рядках для зручності
		const seatsGrouped = Array.from({ length: session.hall.rows }, (_, rowIndex) => {
			return allSeats
				.filter((seat) => seat.row === rowIndex + 1)
				.map((seat) => ({
					id: seat.id,
					row: seat.row,
					number: seat.number,
					taken: takenSeatIds.includes(seat.id),
				}));
		});

		return NextResponse.json({
			session: {
				id: session.id,
				filmTitle: session.filmTitle,
				filmPoster: session.filmPoster,
				startTime: session.startTime,
				duration: session.duration,
				price: session.price,
				hall: {
					id: session.hall.id,
					name: session.hall.name,
					seatsPerRow: session.hall.seatsPerRow,
					rows: session.hall.rows,
				},
			},
			seats: seatsGrouped,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 });
	}
}
