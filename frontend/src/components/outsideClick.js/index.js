import { useEffect, useState, useRef, useCallback } from "react";

const Dropdown = ({ value, options, placeholder = "Select", onChange }) => {
	const node = useRef();

	const [open, setOpen] = useState(false);

	const handleClick = useCallback((e) => {
		if (node.current.contains(e.target)) {
			// inside click
			return;
		}
		// outside click
		setOpen(false);
	});

	const handleChange = (selectedValue) => {
		onChange(selectedValue);
		setOpen(false);
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClick);

		return () => {
			document.removeEventListener("mousedown", handleClick);
		};
	}, [handleClick]);

	return (
		<div ref={node} className="dropdown">
			<button
				className="dropdown-toggler"
				onClick={(e) => setOpen(!open)}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						setOpen(!open);
					}
				}}
				tabIndex={0} // Makes the div focusable
				role="button" // Indicates the div behaves as a button
				type="button"
			>
				{value || placeholder}
			</button>
			{open && (
				<ul className="dropdown-menu">
					{options.map((opt) => (
						<li
							key={opt.id}
							className="dropdown-menu-item"
							onClick={(e) => handleChange(opt)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									handleChange(opt);
								}
							}}
						>
							{opt}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Dropdown;
