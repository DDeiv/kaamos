import React, { useState, useRef } from 'react'

export default function BookingForm() {
    const [status, setStatus] = useState('idle') // 'idle', 'submitting', 'success', 'error'
    const formRef = useRef(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('submitting')

        const formData = new FormData(e.target)
        // Note: You will need to get a free access key from https://web3forms.com/
        // and replace 'YOUR_ACCESS_KEY_HERE' below.
        formData.append("access_key", "219dd87c-3db9-48b2-bca1-beecc541908a")

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            })

            const data = await response.json()

            if (data.success) {
                setStatus('success')
                e.target.reset()
                // Reset textarea height
                const textarea = e.target.querySelector('textarea')
                if (textarea) textarea.style.height = 'auto'
            } else {
                console.error("Submission failed", data)
                setStatus('error')
            }
        } catch (err) {
            console.error("Submission error", err)
            setStatus('error')
        }
    }

    if (status === 'success') {
        return (
            <section id="booking" className="booking-section success-state">
                <div className="status-message">
                    <h2 className="booking-title">THANK YOU.</h2>
                    <p className="status-text">YOUR VISION HAS BEEN RECEIVED. I WILL REACH OUT TO YOU SOON VIA EMAIL.</p>
                    <button onClick={() => setStatus('idle')} className="submit-button" style={{ marginTop: '2rem' }}>SEND ANOTHER</button>
                </div>
            </section>
        )
    }

    return (
        <section id="booking" className="booking-section">
            <form className="booking-form" onSubmit={handleSubmit} ref={formRef}>
                {/* Honeypot Spam Protection */}
                <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

                <div className="form-group">
                    <label htmlFor="name">01. WANT A TATTOO?</label>
                    <input name="name" type="text" id="name" className="booking-input" placeholder="NAME / SURNAME" required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">02. YOUR EMAIL</label>
                    <input name="email" type="email" id="email" className="booking-input" placeholder="EMAIL ADDRESS" required />
                </div>
                <div className="form-group">
                    <label htmlFor="idea">03. YOUR VISION</label>
                    <textarea
                        name="idea"
                        id="idea"
                        className="booking-input booking-textarea"
                        placeholder="DESCRIBE YOUR IDEA, PLACEMENT & SIZE"
                        required
                        rows="1"
                        onInput={(e) => {
                            e.target.style.height = 'inherit';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                    ></textarea>
                </div>

                <div className="form-footer" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <button type="submit" className="submit-button" disabled={status === 'submitting'}>
                        {status === 'submitting' ? 'SENDING...' : 'SUBMIT REQUEST'}
                    </button>
                    {status === 'error' && <span className="status-error">SOMETHING WENT WRONG. PLEASE TRY AGAIN.</span>}
                </div>
            </form>
        </section>
    )
}
