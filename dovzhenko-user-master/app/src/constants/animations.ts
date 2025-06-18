import { Variants } from 'framer-motion';

export const leftAnimation = (delay?: number) => ({
	hidden: {
		x: -100,
		opacity: 0,
	},
	visible: {
		x: 0,
		opacity: 1,
		transition: {
			delay: delay || 0,
		},
	},
});

export const rightAnimation = (delay: number) => ({
	hidden: {
		x: 200,
		opacity: 0,
	},
	visible: {
		x: 0,
		opacity: 1,
		transition: {
			delay: delay || 0,
		},
	},
});

export const topAnimation = (delay: number) => ({
	hidden: {
		y: -200,
		opacity: 0,
	},
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			delay: delay,
		},
	},
});

export const bottomAnimation = (delay?: number, startPosition?: number) => ({
	hidden: {
		y: startPosition || 150,
		opacity: 0,
	},
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			delay: delay || 0,
		},
	},
});

export const widthAnimation = () => ({
	hidden: {
		width: 0,
	},
	visible: {
		width: '100%',
		transition: {
			duration: 3,
			delay: 0.4,
		},
	},
});

export const equalizerVariants: Variants = {
	hidden: { y: -200, opacity: 0 },
	visible: (i: number) => ({
		y: [100, -100, 50, 0],
		opacity: 1,
		transition: {
			duration: 0.8,
			delay: i * 0.2,
		},
	}),
};
