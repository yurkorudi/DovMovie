'use client';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import MainCarouselTable from '@/components/tables/main-carousel-table';
import StudiosTable from '@/components/tables/studios-table';
import AboutUsTable from '@/components/tables/about-us-table';

const SlidersPage = () => {
	return (
		<>
			<Tabs defaultValue='main-carousel'>
				<div className='flex justify-center'>
					<TabsList>
						<TabsTrigger value='main-carousel'>Головний</TabsTrigger>
						<TabsTrigger value='studios'>Дитячі студіі</TabsTrigger>
						<TabsTrigger value='about'>Про нас</TabsTrigger>
						<TabsTrigger value='coperation'>Кооперація</TabsTrigger>
					</TabsList>
				</div>
				<TabsContent value='main-carousel' className='mt-4'>
					<MainCarouselTable />
				</TabsContent>
				<TabsContent value='studios'>
					<StudiosTable />
				</TabsContent>
				<TabsContent value='about'>
					<AboutUsTable />
				</TabsContent>
				<TabsContent value='coperation'>coperation</TabsContent>
			</Tabs>
		</>
	);
};

export default SlidersPage;
