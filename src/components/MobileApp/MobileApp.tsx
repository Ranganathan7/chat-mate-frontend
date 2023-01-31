import "./MobileApp.css"
import React from "react"

export const MobileApp: React.FC = () => {
    return (
        <div className="mobile-app">
            <img className="image" src="/images/mobile-app.gif" alt="mobile-app"/>
            <p className="text">
                Don't worry, I'm in the process of learning React Native and developing a mobile app
                to ensure optimal viewing on all devices.
            </p>
            <p className="text">
                <b>In the meantime, for the best experience, I 
                recommend accessing this website on a screen with a minimum resolution of 1200 x 450</b>
            </p>
        </div>
    )
}