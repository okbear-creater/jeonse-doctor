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
        {/* transition을 제거하여 딜레이 없이 바로 확장/축소 */}
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
                <li>
                  <strong>전세 계약서:</strong>  
                  <br />전세 계약의 주요 조건을 명시한 문서.
                </li>
                <li>
                  <strong>등기부등본:</strong>  
                  <br />부동산의 소유권 및 권리관계를 확인할 수 있는 서류.
                </li>
                <li>
                  <strong>계약금:</strong>  
                  <br />전세 계약 체결 시 처음 지급하는 금액.
                </li>
                <li>
                  <strong>잔금:</strong>  
                  <br />전세 계약 완료 시 최종적으로 지급하는 금액.
                </li>
              </ul>
            </SidebarExpander>
            <SidebarExpander title="💰 전세 보증금 안전">
              <ul>
                <li>
                  <strong>전세금 반환 보증:</strong>  
                  <br />전세금을 돌려받지 못할 경우 보험을 통해 보상받을 수 있는 제도.
                </li>
                <li>
                  <strong>확정일자:</strong>  
                  <br />임대차 계약을 신고하여 임차인의 권리를 보호하는 날짜.
                </li>
                <li>
                  <strong>우선변제권:</strong>  
                  <br />경매나 공매 시 다른 채권자보다 우선하여 보증금을 돌려받을 수 있는 권리.
                </li>
              </ul>
            </SidebarExpander>
            <SidebarExpander title="🚨 전세 사기 예방">
              <ul>
                <li>
                  <strong>명도소송:</strong>  
                  <br />임차인이 집을 비워주지 않을 때 집주인이 제기하는 소송.
                </li>
                <li>
                  <strong>대항력:</strong>  
                  <br />임차인이 거주하는 주택에 대해 제3자에게도 임차권을 주장할 수 있는 권리.
                </li>
                <li>
                  <strong>임차권 등기명령:</strong>  
                  <br />임차인의 임차권을 공시하여 제3자로부터 보호받을 수 있는 제도.
                </li>
              </ul>
            </SidebarExpander>
            <SidebarExpander title="🏠 기타 용어">
              <ul>
                <li>
                  <strong>임대인:</strong>  
                  <br />부동산을 빌려주는 사람, 즉 집주인.
                </li>
                <li>
                  <strong>임차인:</strong>  
                  <br />부동산을 빌리는 사람, 즉 세입자.
                </li>
                <li>
                  <strong>임대차 보호법:</strong>  
                  <br />임차인의 권리를 보호하기 위한 법률.
                </li>
                <li>
                  <strong>전세권:</strong>  
                  <br />임차인이 전세금을 지급하고 일정 기간 부동산을 사용하거나 수익할 수 있는 권리.
                </li>
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
