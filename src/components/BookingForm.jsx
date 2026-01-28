import React from 'react'

export default function BookingForm() {
    return (
        <section id="booking" className="booking-section">
            <form className="booking-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label htmlFor="name">01. WHO ARE YOU?</label>
                    <input type="text" id="name" className="booking-input" placeholder="NAME / SURNAME" required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">02. WHERE TO REPLY?</label>
                    <input type="email" id="email" className="booking-input" placeholder="EMAIL ADDRESS" required />
                </div>
                <div className="form-group">
                    <label htmlFor="idea">03. YOUR VISION?</label>
                    <textarea id="idea" className="booking-input booking-textarea" placeholder="DESCRIBE YOUR IDEA, PLACEMENT & SIZE" required></textarea>
                </div>
                <button type="submit" className="submit-button">SUBMIT REQUEST</button>
            </form>
        </section>
    )
}
