'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './page.module.css';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isGreetingShown, setIsGreetingShown] = useState(false);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showExamples, setShowExamples] = useState(true);
  const [currentTypingMessage, setCurrentTypingMessage] = useState('');
  const [loadingDots, setLoadingDots] = useState('');
  const typingSpeed = 5;

  const examplePrompts = [
    "등기부등본이란 무엇인가요?",
    "전세계약서란 무엇인가요?",
    "신탁원부란 무엇인가요?",
    "건축물대장이란 무엇인가요?"
  ];

  const predefinedAnswers = {
    "등기부등본이란 무엇인가요?": 
`**정의:**     
등기부등본은 부동산의 소유권, 근저당, 가압류, 전세권 등 권리 관계를 명확히 기록한 공적 장부로, 이 서류를 통해 해당 부동산의 소유자와 각종 권리 관계를 확인할 수 있습니다.

1. **표제부**  
표제부에는 해당 부동산의 기본적인 정보가 기록됩니다. 여기에는 부동산의 소재지, 지목(예: 대지, 임야), 면적, 구조, 층수, 건축 연도 등의 물리적 특성이 포함됩니다. 표제부를 통해 부동산의 위치와 물리적 상태를 확인할 수 있습니다.

2. **갑구 (갑부)**  
갑구에는 부동산의 소유권 변동에 관한 사항이 기록됩니다. 구체적으로, 소유권의 최초 등록, 이전, 변경, 경매, 가압류, 압류 등의 사항이 여기에 포함됩니다. 부동산의 소유자가 누구인지, 그리고 소유권에 대한 법적 제한이나 압류가 있는지 등을 확인할 수 있습니다.

3. **을구 (을부)**  
을구에는 부동산에 설정된 권리, 즉 제한 물권에 관한 사항이 기록됩니다. 여기에 근저당권, 전세권, 지상권, 지역권 등의 설정 및 말소 내역이 포함됩니다. 특히, 근저당권이 설정되어 있는 경우, 대출금의 상환이 완료되지 않으면 해당 부동산이 경매로 넘어갈 수 있는 위험이 있습니다. 을구를 통해 부동산의 담보 대출 여부와 금액을 확인할 수 있습니다.

**발급 방법 및 절차:**  
1. **온라인 발급**: 대법원 인터넷 등기소 웹사이트([http://www.iros.go.kr](http://www.iros.go.kr))에 접속하여 공인인증서(공동인증서)로 로그인한 후, 해당 부동산의 주소를 입력하여 발급할 수 있습니다.  
2. **오프라인 발급**: 가까운 등기소나 대법원 등기소를 방문하여 발급 신청서를 작성한 후, 수수료를 납부하고 발급받을 수 있습니다.`,
    "전세계약서란 무엇인가요?": 
`**정의:**  
전세계약서는 임대인(집주인)과 임차인(세입자) 간의 전세 조건을 명시한 계약서로, 계약 기간, 보증금, 임대차 기간, 특약사항 등을 포함합니다. 이는 주택 임대차 보호법의 적용을 받는 중요한 문서입니다.

**발급 방법 및 절차:**  
전세계약서는 부동산 중개업소에서 계약 체결 시 작성되며, 임대인과 임차인이 서명한 후 각각 보관합니다. 발급 절차라기보다는 계약 시 작성 및 보관이 중요합니다. 전입신고와 확정일자를 받는 것이 임차인의 권리 보호에 필수적입니다.`,
    "신탁원부란 무엇인가요?": 
`**정의:**     
신탁원부는 신탁 계약에 따라 부동산의 소유권이 신탁회사에 넘어간 경우, 해당 부동산의 신탁 관련 정보가 기록된 문서입니다. 이 문서를 통해 신탁 계약의 내용과 신탁회사의 권한 등을 확인할 수 있습니다.

**발급 방법 및 절차:**  
1. **온라인 발급**: 대법원 인터넷 등기소 웹사이트([http://www.iros.go.kr](http://www.iros.go.kr))에서 공인인증서로 로그인 후, 해당 부동산의 신탁 관련 내용을 확인하고 발급할 수 있습니다.  
2. **오프라인 발급**: 등기소를 방문하여 신탁원부 발급 신청서를 작성하고 발급받을 수 있습니다.`,
    "건축물대장이란 무엇인가요?": 
`**정의:**     
건축물대장은 건축물의 구조, 용도, 면적, 건축 연도, 층수, 건축물 소유자 등의 정보를 기록한 공적 서류입니다. 이 문서는 건축물의 법적 상태와 실제 용도를 확인하는 데 필수적입니다.

**발급 방법 및 절차:**  
1. **온라인 발급**: 정부24 웹사이트([https://www.gov.kr](https://www.gov.kr))에서 건축물대장을 열람하거나 발급받을 수 있습니다. 발급을 위해 부동산의 주소를 입력하고, 공인인증서로 본인 확인 절차를 거칩니다.  
2. **오프라인 발급**: 가까운 시·군·구청이나 동사무소(주민센터)를 방문하여 발급 신청서를 작성한 후, 해당 부동산의 주소를 기재하여 발급받을 수 있습니다.`,
  };

  useEffect(() => {
    if (!isGreetingShown) {
      const initialMessage = "안녕하세요! 저는 전세닥터AI입니다. 전세 계약이 걱정되시나요? 전세 사기 예방부터 위험도 분석까지 도와드릴 수 있어요. 전세 관련 파일을 제출해 주시면 위험 요소를 분석해 드릴게요. 파일을 업로드해 주세요!";
      setCurrentTypingMessage(initialMessage);
      setIsGreetingShown(true);
    }
  }, [isGreetingShown]);

  useEffect(() => {
    if (currentTypingMessage) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < currentTypingMessage.length) {
          setMessages(prev => {
            const newMessages = [...prev];
            if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
              newMessages[newMessages.length - 1].content = currentTypingMessage.slice(0, index + 1);
            } else {
              newMessages.push({ role: 'assistant', content: currentTypingMessage.slice(0, index + 1) });
            }
            return newMessages;
          });
          index++;
        } else {
          clearInterval(timer);
          setCurrentTypingMessage('');
          setIsLoading(false);
        }
      }, typingSpeed);

      return () => clearInterval(timer);
    }
  }, [currentTypingMessage]);

  useEffect(() => {
    if (isLoading) {
      const loadingTimer = setInterval(() => {
        setLoadingDots(prev => (prev.length < 3 ? prev + '.' : '')); // 점이 3개까지 증가
      }, 500);
  
      return () => clearInterval(loadingTimer);
    } else {
      setLoadingDots('');
    }
  }, [isLoading]);
  
  useEffect(() => {
    if (isLoading) {
      const resetDotsTimer = setInterval(() => {
        setLoadingDots(''); // 3개의 점이 다 채워지면 다시 초기화
      }, 4000); // 2초마다 점을 초기화
  
      return () => clearInterval(resetDotsTimer);
    }
  }, [isLoading]);
  

  const handleFileChange = useCallback((event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: selectedFile.name },
      ]);
      setIsLoading(true);
      setShowExamples(false);
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      // 가상 파일 분석 - 키워드별로 대응되는 메시지를 출력합니다.
      setTimeout(() => {
        let analysisMessage = '';

        if (selectedFile.name.toLowerCase().includes('contract_1')) {
          analysisMessage = `전세계약서에 따르면, 보증금은 2억 5천만 원입니다. 그러나 전세보증금이 안전하게 보호되려면 해당 부동산의 권리관계, 특히 근저당권 설정 여부를 확인해야 합니다. 

또한, 계약서에 명시된 임대인이 실제 소유자인지 확인하기 위해 등기부등본을 업로드해 주세요.`;
        } else if (selectedFile.name.toLowerCase().includes('deed_1')) {
          analysisMessage = `등기부등본에 따르면, 이 부동산에는 3억 원의 근저당권이 설정되어 있습니다. 이는 전세보증금이 근저당권 이후로 후순위로 밀릴 위험이 있다는 의미입니다. 

또한, 전세계약서의 소유주 명 ‘김영희’과 등기부등본상의 소유주 명 ’김철수’가 서로 다릅니다. 임대인이 소유자가 아닌 경우, 임대인이 실제로 임대할 권한이 없을 수 있으니, 대리인 위임장이나 소유자의 동의서를 추가로 요구하는 것이 필요합니다.

근저당권이 3억 원으로 설정되어 있어, 만약 부동산이 경매로 넘어갈 경우 전세보증금 2억 5천만 원은 보호받기 어렵습니다.

이런 경우, 전세보증금을 돌려받을 수 없을 위험이 매우 크기 때문에 추가적인 안전장치를 고려하거나 계약을 재검토하는 것이 필요합니다.`;
        } else if (selectedFile.name.toLowerCase().includes('contract_2')) {
          analysisMessage = `전세계약서에 따르면, 보증금은 3억 원입니다. 그러나 이 부동산의 권리관계, 특히 신탁 설정 여부를 확인하여 보증금이 안전하게 보호될 수 있는지 확인이 필요합니다.

등기부등본을 업로드해 주세요.`;
        } else if (selectedFile.name.toLowerCase().includes('deed_2')) {
          analysisMessage = `등기부등본에 따르면, 이 부동산에는 ‘신탁 설정’이 기재되어 있습니다. 신탁된 부동산에서는 신탁사가 임대차 계약에 동의해야 하며, 동의가 없는 경우 계약이 무효화될 수 있습니다.

이 부동산의 신탁 상황을 확인하기 위해 신탁원부를 업로드해 주세요.`;
        } else if (selectedFile.name.toLowerCase().includes('trust_register')) {
          analysisMessage = `신탁원부에 따르면, 이 부동산은 ‘국민 신탁사’에 신탁되어 있으며, 신탁사는 부동산의 처분 및 임대에 대한 모든 권한을 가지고 있습니다. 하지만 전세계약서에는 신탁사의 동의서나 확인이 포함되지 않았습니다.

이런 경우, 전세 계약이 무효화될 수 있으며, 특히 경매 상황에서는 전세보증금 보호가 어렵습니다. 이 계약을 진행하기 전, 신탁사의 공식 동의서 또는 보증장치를 추가로 요구해야 합니다. 신탁 부동산에서의 전세 계약은 위험이 크므로, 신중하게 검토하셔야 합니다.`;
        } else {
          analysisMessage = `${selectedFile.name} 파일을 분석 중입니다. 잠시만 기다려 주세요.`;
        }

        // 상태를 업데이트합니다.
        setCurrentTypingMessage(analysisMessage);
        setIsLoading(false);
      }, 4000); // 2초 후 응답 표시
    }
  }, []);

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange({ target: { files: [droppedFile] } });
    }
  };

  const handleIconClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleSendMessage = async (message) => {
    if (message.trim() === '') return;

    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setInput('');
    setIsLoading(true);
    setShowExamples(false);
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const responseMessage = predefinedAnswers[message] || "죄송합니다, 해당 질문에 대한 답변을 찾을 수 없습니다.";
      setCurrentTypingMessage(responseMessage);
    } catch (error) {
      console.error('Error:', error);
      setCurrentTypingMessage('죄송합니다, 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setFile(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage(input);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>파일 분석</h1>
      </header>
      <div className={styles.chatContainer}>
        <div className={styles.chatMessages}>
          {messages.map((message, index) => (
            <div key={index} className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage}`}>
              {message.role === 'assistant' && <span className={styles.assistantEmoji}>🤖</span>}
              <div className={styles.messageContent}>
                {message.role === 'user' ? (
                  message.content
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className={styles.paragraph}>{children}</p>
                    }}
                  >
                    {message.content || `분석중${loadingDots}`}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.inputWrapper}>
        {showExamples && (
          <div className={styles.examplePromptsWrapper}>
            <div className={styles.examplePrompts}>
              {examplePrompts.map((prompt, index) => (
                <button key={index} onClick={() => handleSendMessage(prompt)} className={styles.examplePrompt}>
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        <div
          className={`${styles.inputContainer} ${isDragging ? styles.dragging : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept=".pdf,.docx,.txt"
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="전세 관련 파일을 여기에 끌어다 놓아 주세요"
            className={styles.input}
            readOnly
          />
          <button className={styles.uploadButton} onClick={handleIconClick}>
            파일 업로드
          </button>
        </div>
      </div>
    </div>
  );
}
