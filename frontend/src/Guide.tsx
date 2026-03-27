import { getT } from './i18n';
import type { Language } from './i18n';

interface GuideProps {
  onNavigate?: (view: 'terminal' | 'guide') => void;
  lang: Language;
}

export default function Guide({ onNavigate, lang }: GuideProps) {
  const t = getT(lang).guide;

  const handleWalletClick = (e: any) => {
    e.preventDefault();
    if (onNavigate) onNavigate('terminal');
  };

  const handleWithdrawClick = (e: any) => {
    e.preventDefault();
    alert('Initiating emergency withdrawal...');
    if (onNavigate) onNavigate('terminal');
  };

  return (
    <div className="guide-container glass-panel">
      <h2 style={{color: 'var(--accent-blue)', marginBottom: '24px'}}>{t.title}</h2>
      
      <div className="guide-section">
        <h3>{t.s1Title}</h3>
        <p dangerouslySetInnerHTML={{ __html: t.s1P1 }} />
        <p style={{marginTop: '8px'}} dangerouslySetInnerHTML={{ __html: t.s1P2 }} />
      </div>

      <div className="guide-section">
        <h3>{t.s2Title}</h3>
        <p>{t.s2P1}</p>
        <ul className="guide-list">
            <li dangerouslySetInnerHTML={{ __html: t.s2L1 }} />
            <li dangerouslySetInnerHTML={{ __html: t.s2L2 }} />
            <li dangerouslySetInnerHTML={{ __html: t.s2L3 }} />
        </ul>
      </div>

      <div className="guide-section">
        <h3>{t.s3Title}</h3>
        <p>{t.s3P1}</p>
        <ul className="guide-list">
            <li dangerouslySetInnerHTML={{ __html: t.s3L1 }} />
            <li dangerouslySetInnerHTML={{ __html: t.s3L2 }} />
        </ul>
      </div>

      <div className="guide-section">
        <h3>{t.s4Title}</h3>
        <p dangerouslySetInnerHTML={{ __html: t.s4P1 }} />
        <ul className="prompt-examples">
          <li dangerouslySetInnerHTML={{ __html: t.s4L1 }} />
          <li dangerouslySetInnerHTML={{ __html: t.s4L2 }} />
        </ul>
      </div>

      <div className="guide-section">
        <h3>{t.s5Title}</h3>
        <p>{t.s5P1}</p>
        <ul className="guide-list">
          <li dangerouslySetInnerHTML={{ __html: t.s5L1 }} />
          <li dangerouslySetInnerHTML={{ __html: t.s5L2 }} />
          <li dangerouslySetInnerHTML={{ __html: t.s5L3 }} />
        </ul>
        <p style={{marginTop: '12px', color: 'var(--accent-green)'}} dangerouslySetInnerHTML={{ __html: t.s5Hint }} />
      </div>

      <div className="guide-section">
        <h3>{t.s6Title}</h3>
        <div className="faq-item">
          <strong>{t.s6Q1}</strong>
          <p>
            {t.s6A1}
            <a href="#" onClick={handleWalletClick} style={{color: 'var(--accent-green)', textDecoration: 'underline'}}>
              {t.s6A1Link}
            </a>
            {t.s6A1Ext}
            <a href="#" onClick={handleWithdrawClick} style={{color: 'var(--accent-gold)', textDecoration: 'underline', fontWeight: 'bold'}}>
              <code>{t.s6A1Code}</code>
            </a>
            {t.s6A1Close}
          </p>
        </div>
        <div className="faq-item">
          <strong>{t.s6Q2}</strong>
          <p>{t.s6A2}</p>
        </div>
      </div>
    </div>
  );
}
