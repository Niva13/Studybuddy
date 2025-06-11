"use client";
import Select from "react-select";

const DegreeSelector = ({ degrees, selectedDegree, onChange }) => {
    const options = degrees.map((name) => ({
        value: name,
        label: name
    }));

    return (
        <div style={{ width: 300 }}>
            <label style={{ marginBottom: 5, display: "block" }}>Select your degree:</label>
            <Select
                options={options}
                value={selectedDegree}
                onChange={onChange}
                placeholder="Choose degree..."
                isClearable
            />
        </div>
    );
};

export default DegreeSelector;
