export default function HomePage() {
  return (
    <main style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#111', width: '100%' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 4rem', borderBottom: '0.5px solid #e5e5e5', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '17px', fontWeight: 500 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" fill="#534AB7"/>
            <ellipse cx="14" cy="14" rx="13" ry="5.5" stroke="#AFA9EC" strokeWidth="1.2" fill="none"/>
            <ellipse cx="14" cy="14" rx="5.5" ry="13" stroke="#AFA9EC" strokeWidth="1.2" fill="none"/>
            <circle cx="14" cy="14" r="3" fill="#CECBF6" opacity="0.8"/>
          </svg>
          Earthify
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '14px', color: '#666' }}>
          <a href="#modules" style={{ color: '#666', textDecoration: 'none' }}>Модулі</a>
          <a href="#pricing" style={{ color: '#666', textDecoration: 'none' }}>Тарифи</a>
          <a href="#demo" style={{ color: '#666', textDecoration: 'none' }}>Демо</a>
        </div>
        <a href="/register" style={{ background: '#534AB7', color: '#fff', padding: '8px 20px', borderRadius: '8px', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>
          Спробувати →
        </a>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '5rem 2rem 4rem', background: 'linear-gradient(180deg, #f8f7ff 0%, #ffffff 100%)' }}>
        <h1 style={{ fontSize: '52px', fontWeight: 600, lineHeight: 1.15, marginBottom: '1.2rem', letterSpacing: '-0.03em' }}>
          Earthify<br />
          <span style={{ color: '#534AB7' }}>Software as a Service</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#555', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Earthify об&apos;єднує управління готелем, спа, салоном краси, рестораном, кафе та басейном в одній платформі. Вмикай тільки потрібні модулі — платиш за те, що використовуєш.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/register" style={{ background: '#534AB7', color: '#fff', padding: '14px 32px', borderRadius: '10px', fontSize: '16px', textDecoration: 'none', fontWeight: 500 }}>
            Почати безкоштовно
          </a>
          <a href="#demo" style={{ background: 'transparent', color: '#111', border: '1px solid #ddd', padding: '14px 32px', borderRadius: '10px', fontSize: '16px', textDecoration: 'none' }}>
            Дивитись демо
          </a>
        </div>
        <p style={{ fontSize: '13px', color: '#aaa', marginTop: '1.2rem' }}>
          14 днів безкоштовно · Без кредитної картки · Скасуй будь-коли
        </p>
      </section>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', background: '#fff' }}>
        {[
          { num: '6', label: 'бізнес-модулів' },
          { num: '$29', label: 'старт / місяць' },
          { num: '18+', label: 'авто-тригерів' },
          { num: '4', label: 'мови інтерфейсу' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '2rem 1rem', borderRight: i < 3 ? '1px solid #f0f0f0' : 'none' }}>
            <div style={{ fontSize: '32px', fontWeight: 600, color: '#534AB7' }}>{s.num}</div>
            <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* MODULES */}
      <section id="modules" style={{ padding: '5rem 4rem', background: '#fafafa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontSize: '12px', color: '#534AB7', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem', fontWeight: 600 }}>Модулі</div>
          <h2 style={{ fontSize: '36px', fontWeight: 600, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Вибери що потрібно твоєму бізнесу</h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '3rem', maxWidth: '520px', lineHeight: 1.6 }}>
            Кожен модуль незалежний. Вмикай і вимикай у налаштуваннях. Платиш тільки за активні.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {modules.map((mod, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: '16px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow 0.2s' }}>
                <div dangerouslySetInnerHTML={{ __html: mod.svg }} />
                <div style={{ fontSize: '15px', fontWeight: 600 }}>{mod.name}</div>
                <div style={{ fontSize: '13px', color: '#777', lineHeight: 1.6 }}>{mod.desc}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {mod.features.map((f, j) => (
                    <li key={j} style={{ fontSize: '12px', color: '#999', display: 'flex', gap: '6px' }}>
                      <span style={{ color: '#534AB7', fontWeight: 600 }}>·</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section style={{ padding: '5rem 4rem', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontSize: '12px', color: '#534AB7', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem', fontWeight: 600 }}>Переваги</div>
          <h2 style={{ fontSize: '36px', fontWeight: 600, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Чому Earthify</h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '3rem', lineHeight: 1.6 }}>Єдина платформа замість 4–5 різних систем</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {advantages.map((a, i) => (
              <div key={i} style={{ background: '#f8f7ff', borderRadius: '14px', padding: '1.5rem', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EEEDFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '20px' }}>
                  {a.icon}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>{a.title}</div>
                  <div style={{ fontSize: '13px', color: '#666', lineHeight: 1.6 }}>{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '5rem 4rem', background: '#fafafa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontSize: '12px', color: '#534AB7', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem', fontWeight: 600 }}>Тарифи</div>
          <h2 style={{ fontSize: '36px', fontWeight: 600, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Прозора ціна. Жодних сюрпризів.</h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '3rem', lineHeight: 1.6 }}>Скасуй у будь-який момент. Без прихованих платежів.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {plans.map((plan, i) => (
              <div key={i} style={{ background: '#fff', border: plan.featured ? '2px solid #534AB7' : '1px solid #ebebeb', borderRadius: '16px', padding: '2rem' }}>
                {plan.featured && (
                  <div style={{ display: 'inline-block', background: '#EEEDFE', color: '#3C3489', fontSize: '11px', padding: '4px 12px', borderRadius: '20px', marginBottom: '12px', fontWeight: 600 }}>
                    Найпопулярніший
                  </div>
                )}
                <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>{plan.name}</div>
                <div style={{ fontSize: '40px', fontWeight: 700, lineHeight: 1, color: '#111' }}>{plan.price}</div>
                <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '1.5rem' }}>{plan.period}</div>
                <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '1.5rem 0' }} />
                {plan.features.map((f, j) => (
                  <div key={j} style={{ fontSize: '13px', color: '#555', padding: '5px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: f.ok ? '#1D9E75' : '#ddd', fontWeight: 700 }}>{f.ok ? '✓' : '—'}</span>
                    {f.label}
                  </div>
                ))}
                <a href="/register" style={{
                  display: 'block', marginTop: '1.5rem', padding: '12px', borderRadius: '10px',
                  fontSize: '14px', fontWeight: 600, textAlign: 'center', textDecoration: 'none',
                  background: plan.featured ? '#534AB7' : 'transparent',
                  color: plan.featured ? '#fff' : '#111',
                  border: plan.featured ? 'none' : '1px solid #ddd',
                }}>
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #534AB7 0%, #7c3aed 100%)', padding: '5rem 4rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '40px', fontWeight: 600, marginBottom: '1rem', color: '#fff', letterSpacing: '-0.02em' }}>
          Готовий вивести бізнес на новий рівень?
        </h2>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
          14 днів безкоштовно. Кредитна картка не потрібна. Підключення за 5 хвилин.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/register" style={{ background: '#fff', color: '#534AB7', padding: '14px 32px', borderRadius: '10px', fontSize: '16px', textDecoration: 'none', fontWeight: 600 }}>
            Створити акаунт безкоштовно
          </a>
          <a href="#demo" style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', padding: '14px 32px', borderRadius: '10px', fontSize: '16px', textDecoration: 'none' }}>
            Замовити демо
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #f0f0f0', padding: '2rem 4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: 600 }}>
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" fill="#534AB7"/>
            <ellipse cx="14" cy="14" rx="13" ry="5.5" stroke="#AFA9EC" strokeWidth="1.2" fill="none"/>
            <ellipse cx="14" cy="14" rx="5.5" ry="13" stroke="#AFA9EC" strokeWidth="1.2" fill="none"/>
          </svg>
          Earthify
        </div>
        <div style={{ fontSize: '13px', color: '#aaa' }}>© 2026 Earthify · UA · EN · PL · DE</div>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '13px', color: '#aaa' }}>
          <a href="/terms" style={{ color: '#aaa', textDecoration: 'none' }}>Умови</a>
          <a href="/privacy" style={{ color: '#aaa', textDecoration: 'none' }}>Конфіденційність</a>
          <a href="/support" style={{ color: '#aaa', textDecoration: 'none' }}>Підтримка</a>
        </div>
      </footer>

    </main>
  )
}

const hotelSvg = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="h1" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#0f0c29"/><stop offset="100%" stop-color="#302b63"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#h1)"/><circle cx="52" cy="12" r="6" fill="#fffde7" opacity="0.9"/><circle cx="54" cy="10" r="5" fill="#0f0c29"/><rect x="10" y="18" width="36" height="42" fill="#2d3561"/><path d="M10,18 L28,10 L46,18Z" fill="#d0dce8"/><line x1="54" y1="6" x2="54" y2="2" stroke="#90a4ae" strokeWidth="1.2"/><circle cx="54" cy="2" r="1.5" fill="#ef5350"><animate attributeName="opacity" values="1;0.2;1" dur="1.4s" repeatCount="indefinite"/></circle><rect x="15" y="24" width="7" height="5" rx="0.5" fill="#ffe082" opacity="0.9"/><rect x="25" y="24" width="7" height="5" rx="0.5" fill="#fff8e1" opacity="0.7"/><rect x="35" y="24" width="7" height="5" rx="0.5" fill="#ffe082" opacity="0.9"/><rect x="15" y="33" width="7" height="5" rx="0.5" fill="#fff8e1" opacity="0.6"/><rect x="25" y="33" width="7" height="5" rx="0.5" fill="#ffe082" opacity="0.85"/><rect x="35" y="33" width="7" height="5" rx="0.5" fill="#fff8e1" opacity="0.5"/><rect x="15" y="42" width="7" height="5" rx="0.5" fill="#ffe082" opacity="0.8"/><rect x="35" y="42" width="7" height="5" rx="0.5" fill="#ffe082" opacity="0.7"/><rect x="24" y="52" width="14" height="8" rx="0.5" fill="#1a2040"/><rect x="25" y="24" width="7" height="5" rx="0.5" fill="#ffd54f" opacity="0"><animate attributeName="opacity" values="0;0.6;0;0.8;0" dur="4s" repeatCount="indefinite"/></rect></svg>`

const spaSvg = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="s1" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#1b2838"/><stop offset="100%" stop-color="#0d1f1a"/></linearGradient><radialGradient id="ch1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ff9800" stop-opacity="0.4"/><stop offset="100%" stop-color="#ff9800" stop-opacity="0"/></radialGradient></defs><rect width="64" height="64" rx="12" fill="url(#s1)"/><ellipse cx="32" cy="52" rx="26" ry="9" fill="#1a4a42"/><ellipse cx="32" cy="50" rx="26" ry="9" fill="#26a69a" opacity="0.7"/><path d="M10,47 Q21,42 32,47 Q43,52 54,47" stroke="#80cbc4" strokeWidth="1" fill="none" opacity="0.6"><animate attributeName="d" values="M10,47 Q21,42 32,47 Q43,52 54,47;M10,47 Q21,52 32,47 Q43,42 54,47;M10,47 Q21,42 32,47 Q43,52 54,47" dur="3s" repeatCount="indefinite"/></path><ellipse cx="32" cy="44" rx="11" ry="4" fill="#546e7a"/><ellipse cx="32" cy="42" rx="11" ry="4" fill="#607d8b"/><ellipse cx="32" cy="36" rx="13" ry="4.5" fill="url(#ch1)"><animate attributeName="rx" values="13;17;13" dur="1.3s" repeatCount="indefinite"/></ellipse><rect x="28" y="38" width="8" height="7" rx="1.5" fill="#f5f0dc"/><line x1="32" y1="38" x2="32" y2="34" stroke="#4a3728" strokeWidth="0.8"/><path d="M30,34 Q32,27 34,34 Q33,36 32,35 Q31,36 30,34Z" fill="#ff6d00"><animateTransform attributeName="transform" type="skewX" values="0;8;-6;0" dur="0.7s" repeatCount="indefinite"/></path><path d="M31,34 Q32,29 33,34 Q32.5,35.5 32,35 Q31.5,35.5 31,34Z" fill="#fff9c4"/><path d="M32,18 Q38,12 40,18 Q36,22 32,20 Q28,22 24,18 Q26,12 32,18Z" fill="#4db6ac" opacity="0.85"/><circle cx="32" cy="18" r="2.5" fill="#26a69a"/></svg>`

const salonSvg = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sl1" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#12002a"/><stop offset="100%" stop-color="#1e0a3c"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#sl1)"/><ellipse cx="32" cy="28" rx="18" ry="20" fill="#2d1248" stroke="#9b59b6" strokeWidth="1.5"/><ellipse cx="32" cy="28" rx="14" ry="16" fill="#0d0020" opacity="0.8"/><path d="M22,14 Q32,10 42,14 Q40,12 32,11 Q24,12 22,14Z" fill="white" opacity="0.1"/><rect x="30" y="48" width="4" height="7" rx="1" fill="#4a1c75"/><rect x="23" y="54" width="18" height="3.5" rx="1.5" fill="#6c3483" opacity="0.85"/><g style={{transformOrigin:"32px 28px"}}><animateTransform attributeName="transform" type="rotate" values="0;18;0" dur="2.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/><path d="M24,20 L40,32" stroke="#e0e0e0" strokeWidth="1.8" strokeLinecap="round"/><circle cx="22" cy="19" r="5" fill="none" stroke="#e0e0e0" strokeWidth="1.5"/><circle cx="22" cy="19" r="2" fill="#1e0a3c"/><circle cx="22" cy="19" r="1" fill="#9b59b6"/><path d="M40,20 L24,32" stroke="#c4b5fd" strokeWidth="1.8" strokeLinecap="round"/><circle cx="42" cy="19" r="5" fill="none" stroke="#c4b5fd" strokeWidth="1.5"/><circle cx="42" cy="19" r="2" fill="#1e0a3c"/><circle cx="42" cy="19" r="1" fill="#7c3aed"/><circle cx="32" cy="26" r="3" fill="#37474f"/><circle cx="32" cy="26" r="1.2" fill="#c4b5fd"/></g><g><animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite"/><path d="M10,18 L11.5,14 L13,18 L11.5,22Z" fill="#e040fb" opacity="0.7"/><path d="M52,16 L53,13 L54,16 L53,19Z" fill="#ce93d8" opacity="0.6"/></g></svg>`

const restaurantSvg = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="r1" cx="50%" cy="60%" r="70%"><stop offset="0%" stop-color="#1c0a00"/><stop offset="100%" stop-color="#0a0500"/></radialGradient><radialGradient id="pr1" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#fafafa"/><stop offset="100%" stop-color="#cfcfcf"/></radialGradient></defs><rect width="64" height="64" rx="12" fill="url(#r1)"/><ellipse cx="32" cy="52" rx="20" ry="7" fill="#bdbdbd"/><ellipse cx="32" cy="50" rx="20" ry="7" fill="url(#pr1)"/><ellipse cx="32" cy="49" rx="15" ry="5" fill="#f8f8f8"/><ellipse cx="28" cy="47" rx="6" ry="3.5" fill="#e53935"/><ellipse cx="36" cy="48" rx="5" ry="3" fill="#388e3c"/><ellipse cx="32" cy="46" rx="4" ry="2.5" fill="#ffa000"/><g><animateTransform attributeName="transform" type="translate" values="0,0;0,-9;0,0" dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/><path d="M12,46 Q32,20 52,46Z" fill="#37474f"/><path d="M12,46 Q32,22 52,46 Q42,42 32,42 Q22,42 12,46Z" fill="#455a64"/><ellipse cx="32" cy="46" rx="20" ry="3.5" fill="#546e7a"/><rect x="29" y="20" width="6" height="4" rx="2" fill="#212121"/></g><line x1="8" y1="34" x2="8" y2="52" stroke="#9e9e9e" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/><line x1="56" y1="34" x2="56" y2="52" stroke="#9e9e9e" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/><path d="M56,34 Q61,37 56,44" fill="#bdbdbd" opacity="0.5"/></svg>`

const cafeSvg = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="c1" cx="50%" cy="40%" r="70%"><stop offset="0%" stop-color="#1a0d00"/><stop offset="100%" stop-color="#0a0500"/></radialGradient><linearGradient id="cg1" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox"><stop offset="0%" stop-color="#5d3a1a"/><stop offset="100%" stop-color="#2c1500"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#c1)"/><ellipse cx="30" cy="58" rx="20" ry="4.5" fill="#7a4e20"/><path d="M14,38 L17,56 Q17,58 20,58 L40,58 Q42,58 42,56 L46,38Z" fill="url(#cg1)"/><path d="M44,42 Q54,42 54,49 Q54,55 44,54" stroke="#6d4018" strokeWidth="3.5" fill="none" strokeLinecap="round"/><ellipse cx="30" cy="38" rx="16" ry="4.5" fill="#2c1500"/><ellipse cx="30" cy="37" rx="14" ry="3.5" fill="#4a2c00"/><path d="M23,36.5 Q30,33 37,36.5" stroke="#c49a4a" strokeWidth="1" fill="none" opacity="0.7"/><path d="M20,36 Q17,27 20,18" stroke="#c49a4a" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0"><animate attributeName="opacity" values="0;0.55;0" dur="2.8s" repeatCount="indefinite"/><animate attributeName="d" values="M20,36 Q17,27 20,18;M20,36 Q23,27 20,18;M20,36 Q17,27 20,18" dur="2.8s" repeatCount="indefinite"/></path><path d="M30,34 Q27,25 30,16" stroke="#c49a4a" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0"><animate attributeName="opacity" values="0;0;0.45;0" dur="3.2s" repeatCount="indefinite"/></path><path d="M40,36 Q43,27 40,18" stroke="#c49a4a" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0"><animate attributeName="opacity" values="0;0.5;0" dur="2.4s" repeatCount="indefinite"/></path></svg>`

const poolSvg = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="p1" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#001529"/><stop offset="100%" stop-color="#002a4a"/></linearGradient><linearGradient id="pw1" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#0077b6"/><stop offset="100%" stop-color="#023e8a"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#p1)"/><rect x="4" y="28" width="56" height="32" rx="3" fill="url(#pw1)"/><rect x="4" y="28" width="56" height="3.5" rx="2" fill="#e0eaf4"/><path d="M4,34 Q18,28 32,34 Q46,40 60,34" stroke="#90e0ef" strokeWidth="1.8" fill="none" opacity="0.7" strokeLinecap="round"><animate attributeName="d" values="M4,34 Q18,28 32,34 Q46,40 60,34;M4,34 Q18,40 32,34 Q46,28 60,34;M4,34 Q18,28 32,34 Q46,40 60,34" dur="2.5s" repeatCount="indefinite"/></path><path d="M4,40 Q18,34 32,40 Q46,46 60,40" stroke="#48cae4" strokeWidth="1.2" fill="none" opacity="0.45" strokeLinecap="round"><animate attributeName="d" values="M4,40 Q18,34 32,40 Q46,46 60,40;M4,40 Q18,46 32,40 Q46,34 60,40;M4,40 Q18,34 32,40 Q46,46 60,40" dur="2s" repeatCount="indefinite"/></path><g><animateTransform attributeName="transform" type="translate" values="-6,0;9,0;-6,0" dur="4.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/><path d="M15,36 Q24,33 32,35" stroke="#ffcc99" strokeWidth="4" fill="none" strokeLinecap="round"/><circle cx="34" cy="34" r="5" fill="#f5cba7"/><path d="M32,36 Q26,40 18,37" stroke="#ffcc99" strokeWidth="3" fill="none" strokeLinecap="round"><animate attributeName="d" values="M32,36 Q26,40 18,37;M32,36 Q26,32 18,35;M32,36 Q26,40 18,37" dur="1.2s" repeatCount="indefinite"/></path><path d="M34,40 Q30,36 34,32" fill="#c62828" opacity="0.8"/></g><line x1="54" y1="22" x2="54" y2="38" stroke="#b0bec5" strokeWidth="1.5"/><line x1="60" y1="22" x2="60" y2="38" stroke="#90a4ae" strokeWidth="1.5"/><line x1="54" y1="26" x2="60" y2="26" stroke="#cfd8dc" strokeWidth="1.2"/><line x1="54" y1="32" x2="60" y2="32" stroke="#cfd8dc" strokeWidth="1.2"/></svg>`

const modules = [
  { svg: hotelSvg, name: 'Готель / PMS', desc: 'Управління номерами, бронювання, channel manager', features: ['Інтерактивна карта поверхів', 'Booking.com, Airbnb, Expedia', 'Digital Key через QR / NFC', 'Pre check-in онлайн за 24 год'] },
  { svg: spaSvg, name: 'СПА / Wellness', desc: 'Процедури, кабінети, запис до майстра', features: ['Вибір майстра з рейтингом', 'Авторезервація кабінету', 'SMS/Viber нагадування за 2 год', 'Зарядка на номер готелю'] },
  { svg: salonSvg, name: 'Салон краси', desc: 'Онлайн-запис, майстри, портфоліо', features: ['AI Waitlist — авто-пропозиція часу', 'Портфоліо майстра в картці', 'Облік матеріалів (фарба, гель)', 'Loyalty: кожен N-й візит — знижка'] },
  { svg: restaurantSvg, name: 'Ресторан', desc: 'Бронювання столиків, меню, кухня', features: ['Kitchen Display System (KDS)', 'QR-меню — замовлення без офіціанта', 'Split bill між гостями', 'Зарядка на номер готелю'] },
  { svg: cafeSvg, name: 'Кафе / Бар', desc: 'Швидкі замовлення, каса, QR-меню', features: ['Інтерактивна карта залу', 'QR-меню на кожному столику', 'Офлайн-режим каси', 'Loyalty для постійних гостей'] },
  { svg: poolSvg, name: 'Басейн / Фітнес', desc: 'Абонементи, слоти, QR-вхід', features: ['Разові сеанси + абонементи', 'QR-код замість фізичної картки', 'Резерв шафки онлайн', 'Лічильник відвідувань в додатку'] },
]

const advantages = [
  { icon: '👤', title: 'Єдиний профіль гостя', desc: 'Клієнт бронює готель, спа і ресторан в одному місці, накопичує loyalty-бали по всіх сервісах.' },
  { icon: '🔧', title: 'Модульність', desc: 'Платиш тільки за активні модулі. Непотрібний — вимикається в Settings одним кліком.' },
  { icon: '📶', title: 'Офлайн-режим', desc: 'Каса працює без інтернету. Дані синхронізуються автоматично при відновленні з\'єднання.' },
  { icon: '🏷️', title: 'Білий лейбл', desc: 'Твій бренд, твій клієнтський додаток. Гості бачать тільки твій логотип.' },
  { icon: '🤖', title: 'AI Асистент', desc: 'Smart Pricing динамічно змінює ціну. AI Waitlist пропонує вільний час автоматично.' },
  { icon: '🌍', title: 'Мультимова', desc: 'Інтерфейс українською, англійською, польською та німецькою без перезавантаження.' },
]

const plans = [
  { name: 'Starter', price: '$29', period: '/ місяць · 1 локація', featured: false, cta: 'Почати →', features: [{ ok: true, label: '2 модулі на вибір' }, { ok: true, label: 'До 3 співробітників' }, { ok: true, label: 'Базовий POS' }, { ok: true, label: 'Онлайн-бронювання' }, { ok: false, label: 'White-label додаток' }, { ok: false, label: 'Channel manager' }] },
  { name: 'Growth', price: '$89', period: '/ місяць · 1 локація', featured: true, cta: 'Почати →', features: [{ ok: true, label: 'Всі модулі' }, { ok: true, label: 'До 15 співробітників' }, { ok: true, label: 'Повний POS + офлайн' }, { ok: true, label: 'White-label додаток' }, { ok: true, label: 'Loyalty програма' }, { ok: true, label: 'AI Waitlist + Channel manager' }] },
  { name: 'Enterprise', price: '$199+', period: '/ місяць · необмежено локацій', featured: false, cta: 'Зв\'язатись →', features: [{ ok: true, label: 'Всі модулі' }, { ok: true, label: 'Необмежено співробітників' }, { ok: true, label: 'Digital Key (NFC)' }, { ok: true, label: 'API доступ + SSO / SAML' }, { ok: true, label: 'SLA 99.9% + Status page' }, { ok: true, label: 'Мультилокація' }] },
]
