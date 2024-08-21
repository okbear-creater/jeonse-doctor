'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './globals.css';

const SidebarExpander = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`expander-section ${isExpanded ? 'expanded' : ''}`}>
      <div className="sidebar-expander">
        <button 
          className="expander-title" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {title}
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <div className={`expander-content ${isExpanded ? 'expanded' : ''}`}>
          <div className="expander-content-inner">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <div className="container">
          <div className="sidebar">
            <h1 className="sidebarTitle">🤖 전세닥터AI</h1>
            <nav>
              <div className="nav-section">
                <Link href="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
                  <span className="nav-emoji">💬</span>
                  <span className="nav-text">챗봇</span>
                </Link>
                <Link href="/file-analysis" className={`nav-item ${pathname === '/file-analysis' ? 'active' : ''}`}>
                  <span className="nav-emoji">📑</span>
                  <span className="nav-text">파일 분석</span>
                </Link>
                <div className="nav-indicator"></div>
              </div>
            </nav>
            <h2 className="sidebarTitle">☝️ 꼭 알아둬야 하는 용어들</h2>
            <SidebarExpander title="📄 전세 계약">
              <ul>
                <li>전세 계약서: 임대차 계약의 주요 조건을 명시한 문서.</li>
                <li>등기부등본: 부동산의 소유권, 권리관계 등을 확인할 수 있는 서류.</li>
                <li>계약금: 전세 계약 시 처음 지급하는 금액.</li>
                <li>잔금: 전세 계약 완료 시 지급하는 최종 금액.</li>
              </ul>
            </SidebarExpander>
            <SidebarExpander title="💰 전세 보증금 안전">
              <ul>
                <li>전세금 반환 보증: 전세금을 돌려받지 못하는 경우 보험을 통해 보상받을 수 있는 제도.</li>
                <li>확정일자: 임대차 계약을 신고하여 임차인의 권리를 보장받는 날짜.</li>
                <li>우선변제권: 경매나 공매 시 임차인이 다른 채권자보다 우선하여 보증금을 돌려받을 수 있는 권리.</li>
              </ul>
            </SidebarExpander>
            <SidebarExpander title="🚨 전세 사기 예방">
              <ul>
                <li>명도소송: 임차인이 집을 비워주지 않을 때 집주인이 제기하는 소송.</li>
                <li>대항력: 임차인이 주택에 거주하면서 제3자에게도 임차권을 주장할 수 있는 권리.</li>
                <li>임차권 등기명령: 임차인의 임차권을 공시하여 제3자에게 보호받을 수 있는 제도.</li>
              </ul>
            </SidebarExpander>
            <SidebarExpander title="🏠 기타 용어">
              <ul>
                <li>임대인: 부동산을 빌려주는 사람, 집주인.</li>
                <li>임차인: 부동산을 빌리는 사람, 세입자.</li>
                <li>임대차 보호법: 임차인의 권리 보호를 위한 법률.</li>
                <li>전세권: 임차인이 전세금을 지급하고 일정 기간 부동산을 사용하거나 수익할 수 있는 권리.</li>
              </ul>
            </SidebarExpander>
          </div>
          <div className="content">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}