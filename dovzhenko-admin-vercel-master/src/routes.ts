/**
 * An array of App Router paths.
 * @type {ROUTER_PATHS[]}
 */
export enum ROUTER_PATHS {
	MAIL = '/mail',
	SLIDERS = '/sliders',
	EVENTS = '/events',
	ADMIN = '/admin',
	CLIENT = '/client',
	CONTACTS = '/contacts',
	EMPLOYEES = '/users',
	SETTINGS = '/settings',
	HELP = '/help',
	LOGIN = '/auth/login',
	REGISTRATION = '/auth/register',
	RESET_PASSWORD = '/auth/reset',
	NEW_PASSWORD = '/auth/new-password',
	EMAIL_VERIFICATION = '/auth/email-verification',
	ERROR = '/auth/error',
	ADD_MAIN_CAROUSEL_SLIDE = '/sliders/main/add',
	EDIT_MAIN_CAROUSEL_SLIDE = '/sliders/main/edit',
	ADD_EVENT = '/events/add',
	EDIT_EVENT = '/events/edit',
	ADD_STUDIO = '/sliders/studios/add',
	EDIT_STUDIO = '/sliders/studios/edit',
	ADD_ABOUT_SLIDE = '/sliders/about/add',
	EDIT_ABOUT_SLIDE = '/sliders/about/edit',
	ADD_USER = '/users/add',
	EDIT_USER = '/users/edit',
	MOVIES = '/movies',
	CREATE_MOVIE = '/movies/create',
	EDIT_MOVIE = '/movies/edit',
}

/**
 * An array of API Routes
 * @type {ROUTER_PATHS[]}
 */
export enum API_ROUTES {
	AUTH = '/api/auth',
	UPLOAD = '/api/upload',
	MAIN_CAROUSEL = '/api/main-carousel',
	EVENTS = '/api/events',
	STUDIOS = '/api/studios',
	ABOUT_US = '/api/about-us',
	CONTACTS = '/api/contacts',
	MESSAGES = '/api/message',
	MOVIE = '/api/movie',
	MOVIE_GETBYID = '/api/movie/get',
}

/**
 * An array of public sidebar.
 *
 * These sidebar do not require authentication.
 * @type {string[]}
 */
export const publicRoutes = ['/', ROUTER_PATHS.EMAIL_VERIFICATION];

export const publicApiRoutes = [
	API_ROUTES.MAIN_CAROUSEL,
	API_ROUTES.UPLOAD,
	API_ROUTES.EVENTS,
	API_ROUTES.STUDIOS,
	API_ROUTES.ABOUT_US,
	API_ROUTES.CONTACTS,
	API_ROUTES.MESSAGES,
	API_ROUTES.MOVIE,
	API_ROUTES.MOVIE_GETBYID,
];

/**
 * An array of sidebar that are used for authentication.
 *
 * These sidebar will redirect logged-in users to protected pages.
 * @type {ROUTER_PATHS[]}
 */
export const authRoutes = [
	'/auth/login',
	'/auth/register',
	'/auth/error',
	'/auth/reset',
	'/auth/new-password',
];

/**
 * The default redirect path after logging in.
 * @type {string}
 */
export const DEFAULT_REDIRECT = ROUTER_PATHS.MAIL;

/**
 * An array of App Router paths for page title.
 * @type {API_ROUTES[]}
 */
export const TITLE_ROUTES = [
	{
		path: ROUTER_PATHS.ADD_ABOUT_SLIDE,
		name: 'Додати слайд',
	},
	{
		path: ROUTER_PATHS.EDIT_ABOUT_SLIDE,
		name: 'Редагувати слайд',
	},
	{
		path: ROUTER_PATHS.ADD_STUDIO,
		name: 'Додати студію',
	},
	{
		path: ROUTER_PATHS.EDIT_STUDIO,
		name: 'Редагувати студію',
	},
	{
		path: ROUTER_PATHS.ADD_MAIN_CAROUSEL_SLIDE,
		name: 'Додати слайд',
	},
	{
		path: ROUTER_PATHS.EDIT_MAIN_CAROUSEL_SLIDE,
		name: 'Редагувати слайд',
	},
	{
		path: ROUTER_PATHS.ADD_EVENT,
		name: 'Додати подію',
	},
	{
		path: ROUTER_PATHS.EDIT_EVENT,
		name: 'Додати подію',
	},
	{
		path: ROUTER_PATHS.MAIL,
		name: 'Повідомлення',
	},
	{
		path: ROUTER_PATHS.SLIDERS,
		name: 'Слайдери',
	},
	{
		path: ROUTER_PATHS.EVENTS,
		name: 'Події',
	},
	{
		path: ROUTER_PATHS.ADMIN,
		name: 'Role Check',
	},
	{
		path: ROUTER_PATHS.CLIENT,
		name: 'Client Component',
	},
	{
		path: ROUTER_PATHS.CONTACTS,
		name: 'Контакти',
	},
	{
		path: ROUTER_PATHS.SETTINGS,
		name: 'Account Settings',
	},
	{
		path: ROUTER_PATHS.HELP,
		name: 'Help',
	},
	{
		path: ROUTER_PATHS.LOGIN,
		name: 'Login',
	},
	{
		path: ROUTER_PATHS.REGISTRATION,
		name: 'Register',
	},
	{
		path: ROUTER_PATHS.RESET_PASSWORD,
		name: 'Reset Password',
	},
	{
		path: ROUTER_PATHS.ADD_USER,
		name: 'Додати користувача',
	},
	{
		path: ROUTER_PATHS.EDIT_USER,
		name: 'Редагувати користувача',
	},
	{
		path: ROUTER_PATHS.EMPLOYEES,
		name: 'Користувачі',
	},
	{
		path: ROUTER_PATHS.MOVIES,
		name: 'Фільми',
	},
	{
		path: ROUTER_PATHS.CREATE_MOVIE,
		name: 'Створити фільм',
	},
	{
		path: ROUTER_PATHS.EDIT_MOVIE,
		name: 'Редагувати фільм',
	},
];
