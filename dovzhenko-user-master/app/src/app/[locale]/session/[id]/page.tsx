'use client';


import { TSession, TSeat } from '@/lib/types/sessions';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
// import { TSession, TSeat } from '@/types/types';
import axios from 'axios';

export default function SessionPage() {
	const { id } = useParams(); // session ID from URL
	const [session, setSession] = useState<TSession | null>(null);
	const [seats, setSeats] = useState<TSeat[][]>([]);

	useEffect(() => {
		if (!id) return;

		axios.get(`/api/sessions/${id}`).then((res) => {
			setSession(res.data.session);
			setSeats(res.data.seats);
		});
	}, [id]);

	if (!session) return <div className='text-white'>Завантаження...</div>;

	return (
		<div className='text-white max-w-4xl mx-auto px-4'>
			<h1 className='text-2xl font-bold mt-6'>{session.filmTitle}</h1>
			<p>Початок: {new Date(session.startTime).toLocaleString()}</p>
			<p>Тривалість: {session.duration} хв</p>
			<p>Ціна: {session.price} грн</p>

			<h2 className='text-xl font-semibold mt-6'>Оберіть місця:</h2>
			<div className='grid gap-2 mt-4' style={{ gridTemplateColumns: `repeat(${session.hall.seatsPerRow}, 1fr)` }}>
				{seats.flat().map((seat) => (
					<div
						key={seat.id}
						className={`text-center border p-2 rounded ${seat.taken ? 'bg-gray-700' : 'bg-green-600 cursor-pointer'}`}
					>
						{seat.row}-{seat.number}
					</div>
				))}
			</div>
		</div>
	);
}
