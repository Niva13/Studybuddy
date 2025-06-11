"use client";
const InterestsCheckboxes = ({ interests, selectedInterests, onChange }) => (
    <fieldset>
        <legend>Choose your interests:</legend>
        {interests.map((interest, i) => (
            <div key={i}>
                <input
                    type="checkbox"
                    id={interest}
                    name={interest}
                    value={interest}
                    checked={selectedInterests.includes(interest)}
                    onChange={onChange}
                />
                <label htmlFor={interest}>{interest}</label>
            </div>
        ))}
    </fieldset>
);

export default InterestsCheckboxes;
