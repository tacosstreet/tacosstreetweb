'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Nombre: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${message}`;
    const subj = subject || 'Contacto desde tacosstreet.es';
    window.location.href = `mailto:infotacosstreet@gmail.com?subject=${encodeURIComponent(subj)}&body=${body}`;
    setSent(true);
  };

  return (
    <section className="contact-section" id="contacto">
      <div className="contact-wrap">
        <div className="contact-l">
          <p className="sec-ey">Contacto</p>
          <h2 className="sec-title">Habla<br /><span>con nosotros</span></h2>
          <p className="contact-desc">Reservas para grupos, eventos, colaboraciones, prensa o cualquier duda.</p>
          <div className="contact-info">
            <div className="ci-row"><span className="ci-lbl">Email</span><a href="mailto:infotacosstreet@gmail.com" className="ci-val">infotacosstreet@gmail.com</a></div>
            <div className="ci-row"><span className="ci-lbl">Instagram</span><a href="https://www.instagram.com/tacosstreet.es/" target="_blank" rel="noopener noreferrer" className="ci-val">@tacosstreet.es</a></div>
            <div className="ci-row"><span className="ci-lbl">Las Fuentes</span><span className="ci-val">C/ Minas 19, Zaragoza</span></div>
            <div className="ci-row"><span className="ci-lbl">El Actur</span><span className="ci-val">C/ Gabriel Celaya 14, Zaragoza</span></div>
          </div>
        </div>
        <form className="contact-form" onSubmit={onSubmit}>
          <div className="cf-row">
            <label className="cf-field">
              <span className="cf-lbl">Nombre</span>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" />
            </label>
            <label className="cf-field">
              <span className="cf-lbl">Email</span>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" />
            </label>
          </div>
          <label className="cf-field">
            <span className="cf-lbl">Asunto</span>
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Reserva, evento, colaboracion..." />
          </label>
          <label className="cf-field">
            <span className="cf-lbl">Mensaje</span>
            <textarea required rows={5} value={message} onChange={e => setMessage(e.target.value)} placeholder="Cuentanos en que podemos ayudarte" />
          </label>
          <button type="submit" className="cf-submit">Enviar mensaje &rarr;</button>
          {sent && <p className="cf-sent">Abriendo tu cliente de email...</p>}
        </form>
      </div>
    </section>
  );
}
