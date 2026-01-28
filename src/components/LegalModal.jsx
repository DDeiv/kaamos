import React, { useState, useEffect } from 'react'

const CONTENT = {
    terms: {
        title: 'TERMS & CONDITIONS',
        body: `
1. ELIGIBILITY
You must be at least 18 years of age to receive a tattoo at KAAMOS. Valid government-issued photo ID is required for every appointment. We reserve the right to refuse service to anyone at our discretion.

2. DEPOSITS & BOOKINGS
A non-refundable deposit is required to secure every appointment. This deposit will be applied toward the final cost of your tattoo on the day of your appointment. For multi-session projects, the deposit will be applied to the final session.

3. CANCELLATION & RESCHEDULING
We require at least 72 hours notice for any rescheduling or cancellations. If you reschedule with at least 72 hours notice, your deposit will remain valid for the new date. Cancellations or rescheduling with less than 72 hours notice will result in the forfeiture of your deposit.

4. HEALTH & SAFETY
Clients must disclose any medical conditions, allergies (especially to pigments or latex), or medications that may affect the tattooing process or healing. You must not be under the influence of alcohol or drugs during your appointment.

5. INTELLECTUAL PROPERTY
All custom designs created by KAAMOS remain the intellectual property of the artist. The tattoo as applied to the skin is intended for personal use. Commercial reproduction of the design is prohibited without written consent.

6. AFTERCARE
Professional aftercare instructions will be provided. KAAMOS is not responsible for any issues arising from improper healing due to failure to follow the provided aftercare guidance.
        `
    },
    privacy: {
        title: 'PRIVACY POLICY',
        body: `
1. DATA COLLECTION
We collect personal information that you provide voluntarily through our booking form, including your name, email address, and tattoo project details.

2. PURPOSE OF DATA
This data is used exclusively for managing your booking request, communicating about your appointment, and ensuring the safety and quality of the tattoo service provided.

3. DATA RETENTION
We retain your personal information for as long as necessary to provide our services and to comply with legal obligations (such as tax and commercial regulations in Germany).

4. THIRD PARTIES
Your data is stored securely. We do not sell or trade your personal information. We may use trusted third-party services (such as our database provider Sanity) to process and store your data solely for the purposes mentioned above.

5. YOUR RIGHTS
Under GDPR, you have the right to access, correct, or request the deletion of your personal data at any time. To exercise these rights, please contact us at info@kaamos.com.

6. COOKIES
Our website is designed to be as privacy-respecting as possible. We use minimal technical cookies necessary for the operation of the site.
        `
    }
}

export default function LegalModal({ isOpen, type, onClose }) {
    if (!isOpen) return null

    const data = CONTENT[type] || { title: '', body: '' }

    return (
        <div className="legal-modal-overlay" onClick={onClose}>
            <div className="legal-modal-content" onClick={e => e.stopPropagation()}>
                <button className="legal-modal-close" onClick={onClose}>CLOSE [X]</button>
                <div className="legal-modal-header">
                    <h2>{data.title}</h2>
                </div>
                <div className="legal-modal-body">
                    {data.body.trim().split('\n\n').map((para, i) => (
                        <div key={i} className="legal-modal-section">
                            <p>{para}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
