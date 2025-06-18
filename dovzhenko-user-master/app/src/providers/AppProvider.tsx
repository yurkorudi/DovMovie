import { createContext, PropsWithChildren } from 'react';

export const AppContext = createContext<{
	isOpen: boolean;
	setIsOpen: (state: boolean) => void;
}>({} as any);

const AppProvider = ({
	children,
	isOpen,
	setIsOpen,
}: PropsWithChildren<{
	isOpen: boolean;
	setIsOpen: (state: boolean) => void;
}>) => {
	return (
		<AppContext.Provider value={{ isOpen, setIsOpen }}>
			{children}
		</AppContext.Provider>
	);
};

export default AppProvider;
