/* eslint-disable @typescript-eslint/no-explicit-any */
import { Accessor, createContext, createEffect, createSignal, ParentComponent, Setter } from "solid-js";
import { breakpoints, defaultScreenValue, Screen, useScreen } from "./hooks";

type AppContextStore = {
	screen: Accessor<Screen>;
	title: Accessor<string>;
	setTitle: (title: string) => void;
	isMenuOpen: Accessor<boolean>;
	isMemberOpen: Accessor<boolean>;
	setIsMenuOpen: Setter<boolean>;
	setIsMemberOpen: Setter<boolean>;
};

export const AppContext = createContext<AppContextStore>({
	screen: () => defaultScreenValue,
	title: () => "",
	setTitle: () => {},
	isMenuOpen: () => false,
	isMemberOpen: () => false,
	setIsMenuOpen: () => false as any,
	setIsMemberOpen: () => false as any,
});

export const AppProvider: ParentComponent = (props) => {
	let previousWidth = window.screenX;
	const screen = useScreen();

	const [isMenuOpen, setIsMenuOpen] = createSignal(window.innerWidth > 768);
	const [isMemberOpen, setIsMemberOpen] = createSignal(window.innerWidth > 768);
	const [title, setTitle] = createSignal("");

	createEffect(() => {
		if (screen().md) setIsMenuOpen(true);
		if (screen().lg) setIsMemberOpen(true);
		if (window.innerWidth <= breakpoints.md && previousWidth > breakpoints.md) setIsMenuOpen(false);
		if (window.innerWidth <= breakpoints.lg && previousWidth > breakpoints.lg) setIsMemberOpen(false);
		previousWidth = window.innerWidth;
	});

	const store = {
		screen,
		title,
		setTitle,
		isMenuOpen,
		isMemberOpen,
		setIsMenuOpen,
		setIsMemberOpen,
	};

	return <AppContext.Provider value={store}>{props.children}</AppContext.Provider>;
};
