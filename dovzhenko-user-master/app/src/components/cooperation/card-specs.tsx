'use client';
import localFont from 'next/font/local';
import clsx from 'clsx';
import { t, useLang } from '@/hooks/use-lang';
import { X } from 'lucide-react';
import { useState } from 'react';
import Divider from '@/components/cooperation/divider';
import CapacityImageSvg from '@/images/capacity.svg';
import Image from 'next/image';
import { nanoid } from 'nanoid';

const Gilroy = localFont({
	src: '../../../public/fonts/Gilroy-Thin.woff',
});

const GilroyRegular = localFont({
	src: '../../../public/fonts/Gilroy-Regular.woff',
});

const CardSpecs = ({
	title,
	specs,
	capacity,
	rider,
	riderTitle,
}: {
	title: string;
	capacity: number;
	specs: Record<string, string>;
	rider?: Record<string, string[][]>;
	riderTitle?: string;
}) => {
	const language = useLang();
	const [showSpecs, setShowSpecs] = useState(false);
	const [showRider, setShowRider] = useState(false);

	const defineTranslations = (key: string) => {
		switch (key) {
			case 'square':
				return t(['Площа', 'Square']);
			case 'volume':
				return t(["Об'єм", 'Volume']);
			case 'length':
				return t(['Довжина', 'Length']);
			case 'width':
				return t(['Ширина', 'Width']);
			case 'screen':
				return t(['Екран', 'Screen']);
			case 'scene':
				return t(['Сцена', 'Scene']);
			case 'wall':
				return t(['Виставкова площа (стіна)', 'Exhibition area (wall)']);
			default:
				return '';
		}
	};

	const defineMeasurementTranslations = (key: string) => {
		switch (key) {
			case 'square':
				return t(['м кв', 'm sq']);
			case 'volume':
				return t(['м кб', 'm cub']);
			case 'length':
				return t(['м', 'm']);
			default:
				return t(['м', 'm']);
		}
	};

	return (
		<>
			<div className='flex gap-x-4'>
				<button
					className={clsx(
						Gilroy.className,
						'text-[14px] uppercase leading-4 text-white underline underline-offset-4',
					)}
					onClick={() => setShowSpecs(true)}
				>
					{title}
				</button>
				{rider && (
					<button
						className={clsx(
							Gilroy.className,
							'text-[14px] uppercase leading-4 text-white underline underline-offset-4',
						)}
						onClick={() => setShowRider(true)}
					>
						{riderTitle}
					</button>
				)}
			</div>
			{/*Characteristics*/}
			<div
				className={clsx(
					'absolute bottom-0 left-0 right-0 top-0 z-10 bg-cooperation p-8 text-white',
					{ 'translate-y-full transform': !showSpecs },
				)}
			>
				<div className='flex justify-between'>
					<p
						className={clsx(
							'uppercase text-white underline underline-offset-4',
							GilroyRegular.className,
						)}
					>
						{t(['Характеристики зали', 'Hall characteristics'])}
					</p>
					<button onClick={() => setShowSpecs(false)}>
						<X />
					</button>
				</div>
				<Divider className='my-6' />
				{Object.entries(specs).map(([key, value]) => (
					<div key={nanoid()}>
						<div className='flex justify-between'>
							<p className={clsx(Gilroy.className, 'text-base leading-[19px]')}>
								{defineTranslations(key)}
							</p>
							<p
								className={clsx(
									GilroyRegular.className,
									'text-[18px] leading-[21px]',
								)}
							>
								{value}
								{defineMeasurementTranslations(key)}
							</p>
						</div>
						<Divider className='mb-3 mt-1' />
					</div>
				))}
				<p className='flex'>
					{' '}
					<span className='mr-3'>{t(['Вмістимість', 'Capacity'])}</span>{' '}
					{capacity}{' '}
					<Image src={CapacityImageSvg} alt='ucf logo' className='ml-1' />
				</p>
			</div>
			{/*Rider*/}
			{rider && (
				<div
					className={clsx(
						'absolute bottom-0 left-0 right-0 top-0 z-10 bg-cooperation p-8 text-white',
						{ 'translate-y-full transform': !showRider },
					)}
				>
					<div className='flex justify-between'>
						<p
							className={clsx(
								'uppercase text-white underline underline-offset-4',
								GilroyRegular.className,
							)}
						>
							{t(['Технічний райдер', 'Technical rider'])}
						</p>
						<button onClick={() => setShowRider(false)}>
							<X />
						</button>
					</div>
					<Divider className='my-6' />
					{rider[language].map((item) => (
						<div key={nanoid()}>
							<div className='flex justify-between'>
								<p
									className={clsx(Gilroy.className, 'text-base leading-[19px]')}
								>
									{item[0]}
								</p>
								<p
									className={clsx(
										GilroyRegular.className,
										'text-[18px] leading-[21px]',
									)}
								>
									{item[1]} {t(['шт', 'pcs'])}
								</p>
							</div>
							<Divider className='mb-3 mt-1' />
						</div>
					))}
				</div>
			)}
		</>
	);
};

export default CardSpecs;
