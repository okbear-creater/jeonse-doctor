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
    "등기부등본이란 무엇인가요?": `
**정의:**     
등기부등본은 부동산의 소유권, 근저당, 가압류, 전세권 등 권리 관계를 명확히 기록한 공적 장부로, 이 서류를 통해 해당 부동산의 소유자와 각종 권리 관계를 확인할 수 있습니다.

1. **표제부**  
표제부에는 해당 부동산의 기본적인 정보가 기록됩니다. 여기에는 부동산의 소재지, 지목(예: 대지, 임야), 면적, 구조, 층수, 건축 연도 등의 물리적 특성이 포함됩니다. 표제부를 통해 부동산의 위치와 물리적 상태를 확인할 수 있습니다.

2. **갑구 (갑부)**  
갑구에는 부동산의 소유권 변동에 관한 사항이 기록됩니다. 구체적으로, 소유권의 최초 등록, 이전, 변경, 경매, 가압류, 압류 등의 사항이 여기에 포함됩니다. 부동산의 소유자가 누구인지, 그리고 소유권에 대한 법적 제한이나 압류가 있는지 등을 확인할 수 있습니다.

3. **을구 (을부)**  
을구에는 부동산에 설정된 권리, 즉 제한 물권에 관한 사항이 기록됩니다. 여기에 근저당권, 전세권, 지상권, 지역권 등의 설정 및 말소 내역이 포함됩니다. 특히, 근저당권이 설정되어 있는 경우, 대출금의 상환이 완료되지 않으면 해당 부동산이 경매로 넘어갈 수 있는 위험이 있습니다. 을구를 통해 부동산의 담보 대출 여부와 금액을 확인할 수 있습니다.

**발급 방법 및 절차:**  
1. **온라인 발급**: 대법원 인터넷 등기소 웹사이트([http://www.iros.go.kr](http://www.iros.go.kr))에 접속하여 공인인증서(공동인증서)로 로그인한 후, 해당 부동산의 주소를 입력하여 발급할 수 있습니다.  
2. **오프라인 발급**: 가까운 등기소나 대법원 등기소를 방문하여 발급 신청서를 작성한 후, 수수료를 납부하고 발급받을 수 있습니다.
    `,
    "전세계약서란 무엇인가요?": `
**정의:**  
전세계약서는 임대인(집주인)과 임차인(세입자) 간의 전세 조건을 명시한 계약서로, 계약 기간, 보증금, 임대차 기간, 특약사항 등을 포함합니다. 이는 주택 임대차 보호법의 적용을 받는 중요한 문서입니다.

**발급 방법 및 절차:**  
전세계약서는 부동산 중개업소에서 계약 체결 시 작성되며, 임대인과 임차인이 서명한 후 각각 보관합니다. 발급 절차라기보다는 계약 시 작성 및 보관이 중요합니다. 전입신고와 확정일자를 받는 것이 임차인의 권리 보호에 필수적입니다.
    `,
    "신탁원부란 무엇인가요?": `
**정의:**     
신탁원부는 신탁 계약에 따라 부동산의 소유권이 신탁회사에 넘어간 경우, 해당 부동산의 신탁 관련 정보가 기록된 문서입니다. 이 문서를 통해 신탁 계약의 내용과 신탁회사의 권한 등을 확인할 수 있습니다.

**발급 방법 및 절차:**  
1. **온라인 발급**: 대법원 인터넷 등기소 웹사이트([http://www.iros.go.kr](http://www.iros.go.kr))에서 공인인증서로 로그인 후, 해당 부동산의 신탁 관련 내용을 확인하고 발급할 수 있습니다.  
2. **오프라인 발급**: 등기소를 방문하여 신탁원부 발급 신청서를 작성하고 발급받을 수 있습니다.
    `,
    "건축물대장이란 무엇인가요?": `
**정의:**     
건축물대장은 건축물의 구조, 용도, 면적, 건축 연도, 층수, 건축물 소유자 등의 정보를 기록한 공적 서류입니다. 이 문서는 건축물의 법적 상태와 실제 용도를 확인하는 데 필수적입니다.

**발급 방법 및 절차:**  
1. **온라인 발급**: 정부24 웹사이트([https://www.gov.kr](https://www.gov.kr))에서 건축물대장을 열람하거나 발급받을 수 있습니다. 발급을 위해 부동산의 주소를 입력하고, 공인인증서로 본인 확인 절차를 거칩니다.  
2. **오프라인 발급**: 가까운 시·군·구청이나 동사무소(주민센터)를 방문하여 발급 신청서를 작성한 후, 해당 부동산의 주소를 기재하여 발급받을 수 있습니다.
    `,
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
        setLoadingDots(prev => (prev.length < 3 ? prev + '.' : ''));
      }, 500);

      return () => clearInterval(loadingTimer);
    } else {
      setLoadingDots('');
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

      // 가상 파일 분석
      setTimeout(() => {
        if (selectedFile.name.toLowerCase().includes('deung')) {
          setCurrentTypingMessage(
            '제출하신 등기부등본에서 문제가 발견되었습니다. 특정 항목(소유권 이전 내역, 근저당 설정 내역 등)에 누락된 정보나 오류가 있을 수 있으니 해당 부분을 다시 확인해 주세요. 정확한 정보를 위해 최신 등본을 준비해 주시기 바랍니다. 신탁원부도 추가로 업로드해 주세요.'
          );
        } else {
          setCurrentTypingMessage(`"${selectedFile.name}" 파일을 분석 중입니다. 잠시만 기다려 주세요.`);
        }
        setIsLoading(false);
      }, 2000); // 파일 분석 대기 시간 (임시)
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
                    {message.content || loadingDots}
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
