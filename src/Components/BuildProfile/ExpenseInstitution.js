"use client"
import React from "react";


function ExpenseInstitutions({ name, image, degrees })  {

    return (
        <div style={{ border: "1px solid #ccc", padding: 10, margin: 10 }}>
            <h3>{name}</h3>
            <img src={image} alt={name} style={{ width: 150, height: "auto" }} />
            <p>Degrees offered: {Array.isArray(degrees) ? degrees.join(", ") : degrees}</p>
        </div>
    );
};


export default ExpenseInstitutions;
