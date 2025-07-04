import React, { useState } from 'react';
import { LucideChevronDown } from 'lucide-react';

const SelectDropdown = ({ options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className="position-relative w-100" style={{ maxWidth: '250px' }}>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="form-select d-flex justify-content-between align-items-center"
                type="button"
            >
                <span>
                    {value ? options.find((opt) => opt.value === value)?.label : placeholder}
                </span>
                <LucideChevronDown className="ms-2" size={18} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="position-absolute bg-white border shadow-sm mt-1 w-100 rounded z-3">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className="dropdown-item py-2 px-3 cursor-pointer"
                            style={{ cursor: 'pointer' }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectDropdown;
