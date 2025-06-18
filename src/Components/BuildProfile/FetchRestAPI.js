"use client"

import { useState, useEffect } from "react";
import BuildYourProfile from "./BuildYourProfile";

const FetchRestAPI = (props) => {

    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchInstitutions = async () => {
            try {
                const response = await fetch("http://localhost:5000/items");
                const data = await response.json();
                setInstitutions(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching institutions:", error);
                setLoading(false);
            }
        }

        fetchInstitutions();

    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <BuildYourProfile items={institutions} />
        </div>
    );
}; 

export default FetchRestAPI
