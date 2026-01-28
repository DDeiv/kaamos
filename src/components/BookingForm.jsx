import React from 'react'

export default function BookingForm() {
    return (
        <section id="booking" className="booking-section">
            <form className="booking-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id="name" className="booking-input" placeholder="Your name" required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" className="booking-input" placeholder="your@email.com" required />
                </div>
                <div className="form-group">
                    <label htmlFor="idea">Tattoo Idea</label>
                    <textarea id="idea" className="booking-input booking-textarea" placeholder="Describe your project, size, and placement" required></textarea>
                </div>
                <button type="submit" className="submit-button">Send Request</button>
            </form>
        </section>
    )
}
