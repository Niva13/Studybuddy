"use client";

const UsernameInput = ({ value, onChange }) => (
    <div className="new-expense__control">
        <label>Username</label>
        <input type="text" value={value} onChange={onChange} />
    </div>
);

export default UsernameInput;
