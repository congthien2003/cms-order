import { useState } from "react";
import { SidebarContext } from "./SidebarContext";

export type SidebarContextType = {
	isOpen: boolean;
	toggle: () => void;
};

export function SidebarProvider({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(true);

	const toggle = () => {
		setIsOpen(!isOpen);
	};

	return (
		<SidebarContext.Provider value={{ isOpen, toggle }}>
			{children}
		</SidebarContext.Provider>
	);
}
