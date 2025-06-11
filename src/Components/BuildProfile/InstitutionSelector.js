"use client";
import Select from "react-select";

const InstitutionSelector = ({ institutions, selectedInstitution, onChange }) => (
    <div style={{ width: 300 }}>
        <label style={{ marginBottom: 5, display: "block" }}>Select an academic institution:</label>
        <Select
            options={institutions}
            value={selectedInstitution}
            onChange={onChange}
            placeholder="Choose institution..."
            isClearable
            formatOptionLabel={({ label, image }) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                        src={image}
                        alt={label}
                        style={{ width: 24, height: 24, marginRight: 10, borderRadius: 4 }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/24";
                        }}
                    />
                    <span>{label}</span>
                </div>
            )}
        />
    </div>
);

export default InstitutionSelector;
