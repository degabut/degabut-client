/* eslint-disable @typescript-eslint/no-explicit-any */
import { Accessor, createContext, createSignal, ParentComponent, Setter } from "solid-js";

type AppContextStore = {
	title: Accessor<string>;
	setTitle: (title: string) => void;
	isMenuOpen: Accessor<boolean>;
	isMemberOpen: Accessor<boolean>;
	setIsMenuOpen: Setter<boolean>;
	setIsMemberOpen: Setter<boolean>;
};

export const AppContext = createContext<AppContextStore>({
	title: () => "",
	setTitle: () => {},
	isMenuOpen: () => false,
	isMemberOpen: () => false,
	setIsMenuOpen: () => false as any,
	setIsMemberOpen: () => false as any,
});

export const AppProvider: ParentComponent = (props) => {
	let previousWidth = window.screenX;

	// TODO: Add breakpoint constant
	window.addEventListener("resize", () => {
		if (window.innerWidth > 768) {
			setIsMenuOpen(true);
		}
		if (window.innerWidth > 1024) {
			setIsMemberOpen(true);
		}
		if (window.innerWidth <= 768 && previousWidth > 768) {
			setIsMenuOpen(false);
		}
		if (window.innerWidth <= 1024 && previousWidth > 1024) {
			setIsMemberOpen(false);
		}
		previousWidth = window.innerWidth;
	});

	const [isMenuOpen, setIsMenuOpen] = createSignal(window.innerWidth > 768);
	const [isMemberOpen, setIsMemberOpen] = createSignal(window.innerWidth > 768);
	const [title, setTitle] = createSignal("");

	const store = {
		title,
		setTitle,
		isMenuOpen,
		isMemberOpen,
		setIsMenuOpen,
		setIsMemberOpen,
	};

	return <AppContext.Provider value={store}>{props.children}</AppContext.Provider>;
};
