import "./PageNotFound.css"
import React from "react"
import { Link } from "react-router-dom"

export const PageNotFound: React.FC = () => {
    return (
        <div className="error-container">
            <img src="/images/error.gif" alt="404" />
            <h1 className="error-heading">Hmmm...</h1>
            <p className="error-content"> It looks like you're lost...</p>
            <p className="error-content">Go back to <Link to="/home">Home</Link> instead?</p>
        </div>
    )
}